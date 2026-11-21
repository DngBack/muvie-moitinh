-- =====================================================================
-- Mối Tình Đẫm Máu — schema khởi tạo
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor (1 lần).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Danh sách email được cấp quyền DM.
-- Thêm DM:  insert into public.dm_accounts(email) values ('dm@quan-cua-ban.vn');
-- ---------------------------------------------------------------------
create table if not exists public.dm_accounts (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.dm_accounts enable row level security;
-- Không policy nào → chỉ quản trị (SQL Editor / service role) thêm/xóa được.

-- Người dùng hiện tại có phải DM? (đăng nhập email, không ẩn danh, email nằm trong dm_accounts)
create or replace function public.is_dm()
returns boolean
language sql stable security definer set search_path = public
as $$
  select auth.uid() is not null
     and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
     and exists (select 1 from public.dm_accounts d
                 where lower(d.email) = lower(auth.jwt() ->> 'email'));
$$;

-- ---------------------------------------------------------------------
-- Bảng lượt chơi (phòng)
-- ---------------------------------------------------------------------
create table if not exists public.rooms (
  id           uuid primary key default gen_random_uuid(),
  invite_code  text not null unique check (invite_code ~ '^[0-9]{8}$'),
  dm_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name         text,
  stage        jsonb not null default
               '{"chat":false,"i1":false,"i2":false,"i3":false,"i4":false,"i5":false,"i6":false,"final":false}'::jsonb,
  ending       text check (ending in ('off','continue')),
  script_step  int not null default 0,
  created_at   timestamptz not null default now(),
  closed_at    timestamptz
);

-- ---------------------------------------------------------------------
-- Ghế người chơi (6 vai / phòng)
-- ---------------------------------------------------------------------
create table if not exists public.room_players (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid not null references public.rooms(id) on delete cascade,
  slot       smallint not null check (slot between 1 and 6),
  auth_uid   uuid references auth.users(id) on delete set null,
  joined_at  timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  progress   jsonb not null default '{}'::jsonb,
  unique (room_id, slot)
);
create index if not exists room_players_auth_uid_idx on public.room_players(auth_uid);

-- ---------------------------------------------------------------------
-- Tài sản đa phương tiện (nhạc, âm thanh, video, ảnh nền) — dùng chung cho cửa hàng
-- ---------------------------------------------------------------------
create table if not exists public.assets (
  key          text primary key,
  storage_path text not null,
  mime         text,
  file_name    text,
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Helper (security definer, tránh đệ quy RLS)
-- ---------------------------------------------------------------------
create or replace function public.is_room_member(p_room uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.room_players
                 where room_id = p_room and auth_uid = auth.uid());
$$;

create or replace function public.is_room_dm(p_room uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.rooms
                 where id = p_room and dm_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.assets enable row level security;

drop policy if exists rooms_select on public.rooms;
create policy rooms_select on public.rooms for select
  using (dm_id = auth.uid() or public.is_room_member(id));

drop policy if exists rooms_insert on public.rooms;
create policy rooms_insert on public.rooms for insert
  with check (public.is_dm() and dm_id = auth.uid());

drop policy if exists rooms_update on public.rooms;
create policy rooms_update on public.rooms for update
  using (dm_id = auth.uid()) with check (dm_id = auth.uid());

drop policy if exists rooms_delete on public.rooms;
create policy rooms_delete on public.rooms for delete
  using (dm_id = auth.uid());

drop policy if exists players_select on public.room_players;
create policy players_select on public.room_players for select
  using (public.is_room_dm(room_id) or public.is_room_member(room_id));

-- Người chơi KHÔNG ghi trực tiếp; mọi ghi của người chơi đi qua RPC bên dưới.
drop policy if exists players_dm_write on public.room_players;
create policy players_dm_write on public.room_players for all
  using (public.is_room_dm(room_id)) with check (public.is_room_dm(room_id));

drop policy if exists assets_select on public.assets;
create policy assets_select on public.assets for select
  using (auth.uid() is not null);

drop policy if exists assets_write on public.assets;
create policy assets_write on public.assets for all
  using (public.is_dm()) with check (public.is_dm());

-- ---------------------------------------------------------------------
-- RPC: người chơi vào / quay lại ghế bằng mã khóa lời mời
--   - Chiếm lại ghế nếu thiết bị khác đang giữ (dùng khi đổi máy / mất phiên)
--   - Một thiết bị chỉ giữ một ghế trong một phòng
--   - Đủ 6 người → tự mở phòng chat (đúng sổ tay)
-- ---------------------------------------------------------------------
create or replace function public.join_room(p_code text, p_slot int)
returns json
language plpgsql security definer set search_path = public
as $$
declare
  v_uid  uuid := auth.uid();
  v_room public.rooms%rowtype;
  v_count int;
begin
  if v_uid is null then raise exception 'NOT_AUTHENTICATED'; end if;
  if p_slot is null or p_slot < 1 or p_slot > 6 then raise exception 'BAD_SLOT'; end if;

  select * into v_room from public.rooms
   where invite_code = trim(p_code) and closed_at is null;
  if not found then raise exception 'INVALID_CODE'; end if;

  update public.room_players set auth_uid = null
   where room_id = v_room.id and auth_uid = v_uid and slot <> p_slot;

  insert into public.room_players (room_id, slot, auth_uid, last_seen)
  values (v_room.id, p_slot, v_uid, now())
  on conflict (room_id, slot)
  do update set auth_uid = excluded.auth_uid, last_seen = now();

  select count(*) into v_count from public.room_players
   where room_id = v_room.id and auth_uid is not null;
  if v_count >= 6 and coalesce((v_room.stage ->> 'chat')::boolean, false) = false then
    update public.rooms set stage = stage || '{"chat":true}'::jsonb where id = v_room.id;
  end if;

  return json_build_object('room_id', v_room.id, 'slot', p_slot);
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: người chơi lưu tiến độ (merge nông) + heartbeat
-- ---------------------------------------------------------------------
create or replace function public.save_progress(p_room uuid, p_patch jsonb)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.room_players
     set progress = progress || coalesce(p_patch, '{}'::jsonb),
         last_seen = now()
   where room_id = p_room and auth_uid = auth.uid();
end;
$$;

grant execute on function public.join_room(text, int) to authenticated;
grant execute on function public.save_progress(uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------
do $$
begin
  begin
    alter publication supabase_realtime add table public.rooms;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.room_players;
  exception when duplicate_object then null;
  end;
end $$;

-- ---------------------------------------------------------------------
-- Storage: bucket "media" (đọc công khai, chỉ DM được ghi)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_dm_insert on storage.objects;
create policy media_dm_insert on storage.objects for insert
  with check (bucket_id = 'media' and public.is_dm());

drop policy if exists media_dm_update on storage.objects;
create policy media_dm_update on storage.objects for update
  using (bucket_id = 'media' and public.is_dm());

drop policy if exists media_dm_delete on storage.objects;
create policy media_dm_delete on storage.objects for delete
  using (bucket_id = 'media' and public.is_dm());
