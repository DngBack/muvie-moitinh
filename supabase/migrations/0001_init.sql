-- =====================================================================
-- Mối Tình Đẫm Máu — schema (bản đơn giản, KHÔNG cần tài khoản)
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor.
-- Chạy lại lúc nào cũng được: file tự xóa schema cũ (dữ liệu phòng cũ mất).
--
-- Mô hình:
--   - DM bấm "Tạo lượt chơi" → nhận mã khóa 8 số + khóa DM bí mật (lưu ở trình duyệt).
--   - Người chơi nhập mã khóa → nhận khóa ghế bí mật (lưu ở trình duyệt).
--   - Ai cũng ĐỌC được phòng (để realtime chạy); mọi thao tác GHI đi qua hàm
--     bên dưới và phải đúng khóa.
--   - Phòng tự hết hạn: không vào được sau 12 giờ, tự xóa sau 2 ngày.
-- =====================================================================

-- ---------- Dọn schema cũ (bản có tài khoản) ----------
drop policy if exists media_dm_insert on storage.objects;
drop policy if exists media_dm_update on storage.objects;
drop policy if exists media_dm_delete on storage.objects;
drop table if exists public.assets, public.dm_accounts, public.seat_keys,
  public.room_secrets, public.room_players, public.rooms cascade;
drop function if exists public.is_dm() cascade;
drop function if exists public.is_room_member(uuid) cascade;
drop function if exists public.is_room_dm(uuid) cascade;
drop function if exists public.join_room(text, int) cascade;
drop function if exists public.save_progress(uuid, jsonb) cascade;
drop function if exists public.create_room(text) cascade;
drop function if exists public.save_progress(uuid, int, uuid, jsonb) cascade;
drop function if exists public.dm_update_room(uuid, uuid, jsonb) cascade;
drop function if exists public.dm_seat(uuid, uuid, int, text, jsonb) cascade;
drop function if exists public.dm_delete_room(uuid, uuid) cascade;

-- ---------- Bảng công khai (chỉ đọc) ----------
create table public.rooms (
  id           uuid primary key default gen_random_uuid(),
  invite_code  text not null unique check (invite_code ~ '^[0-9]{8}$'),
  name         text,
  stage        jsonb not null default
               '{"chat":false,"i1":false,"i2":false,"i3":false,"i4":false,"i5":false,"i6":false,"final":false}'::jsonb,
  ending       text check (ending in ('off','continue')),
  script_step  int not null default 0,
  created_at   timestamptz not null default now(),
  closed_at    timestamptz
);

create table public.room_players (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid not null references public.rooms(id) on delete cascade,
  slot       smallint not null check (slot between 1 and 6),
  holder     uuid,                 -- mã công khai của thiết bị đang giữ ghế (null = trống)
  joined_at  timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  progress   jsonb not null default '{}'::jsonb,
  unique (room_id, slot)
);

-- ---------- Bảng bí mật (không ai đọc được từ trình duyệt) ----------
create table public.room_secrets (
  room_id uuid primary key references public.rooms(id) on delete cascade,
  dm_key  uuid not null default gen_random_uuid()
);

create table public.seat_keys (
  room_id uuid not null references public.rooms(id) on delete cascade,
  slot    smallint not null,
  key     uuid not null,
  primary key (room_id, slot)
);

alter table public.rooms        enable row level security;
alter table public.room_players enable row level security;
alter table public.room_secrets enable row level security;
alter table public.seat_keys    enable row level security;

create policy rooms_read   on public.rooms        for select using (true);
create policy players_read on public.room_players for select using (true);
-- room_secrets / seat_keys: không có policy → trình duyệt không đọc/ghi được.

-- ---------- Helper ----------
create or replace function public._dm_ok(p_room uuid, p_key uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.room_secrets where room_id = p_room and dm_key = p_key);
$$;
revoke all on function public._dm_ok(uuid, uuid) from public, anon, authenticated;

-- ---------- DM: tạo lượt chơi ----------
create or replace function public.create_room(p_name text default null)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_code text;
  v_id   uuid;
  v_key  uuid;
begin
  -- Dọn phòng cũ (không lưu lâu dài)
  delete from public.rooms where created_at < now() - interval '2 days';

  loop
    v_code := lpad(floor(random() * 100000000)::bigint::text, 8, '0');
    exit when not exists (select 1 from public.rooms where invite_code = v_code);
  end loop;

  insert into public.rooms (invite_code, name) values (v_code, nullif(trim(p_name), ''))
  returning id into v_id;
  insert into public.room_secrets (room_id) values (v_id) returning dm_key into v_key;

  return json_build_object('id', v_id, 'code', v_code, 'key', v_key);
end;
$$;

-- ---------- DM: cập nhật phòng (giai đoạn, kết cục, bước kịch bản, đóng/mở) ----------
create or replace function public.dm_update_room(p_room uuid, p_key uuid, p_patch jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._dm_ok(p_room, p_key) then raise exception 'FORBIDDEN'; end if;
  update public.rooms set
    stage       = case when p_patch ? 'stage'       then p_patch -> 'stage'                    else stage end,
    ending      = case when p_patch ? 'ending'      then p_patch ->> 'ending'                  else ending end,
    script_step = case when p_patch ? 'script_step' then (p_patch ->> 'script_step')::int      else script_step end,
    closed_at   = case when p_patch ? 'closed_at'   then (p_patch ->> 'closed_at')::timestamptz else closed_at end,
    name        = case when p_patch ? 'name'        then p_patch ->> 'name'                    else name end
  where id = p_room;
end;
$$;

-- ---------- DM: thao tác trên ghế (giải phóng / sửa tiến độ) ----------
create or replace function public.dm_seat(p_room uuid, p_key uuid, p_slot int, p_action text, p_progress jsonb default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._dm_ok(p_room, p_key) then raise exception 'FORBIDDEN'; end if;
  if p_action = 'release' then
    update public.room_players set holder = null where room_id = p_room and slot = p_slot;
    delete from public.seat_keys where room_id = p_room and slot = p_slot;
  elsif p_action = 'progress' then
    update public.room_players set progress = coalesce(p_progress, '{}'::jsonb)
     where room_id = p_room and slot = p_slot;
  else
    raise exception 'BAD_ACTION';
  end if;
end;
$$;

-- ---------- DM: xóa phòng ----------
create or replace function public.dm_delete_room(p_room uuid, p_key uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._dm_ok(p_room, p_key) then raise exception 'FORBIDDEN'; end if;
  delete from public.rooms where id = p_room;
end;
$$;

-- ---------- Người chơi: vào / vào lại ghế bằng mã khóa ----------
--   Vào lại cùng vai trên máy khác → máy cũ bị đẩy ra, tiến độ giữ nguyên.
--   Đủ 6 người → tự mở phòng chat.
create or replace function public.join_room(p_code text, p_slot int)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_room   public.rooms%rowtype;
  v_holder uuid := gen_random_uuid();
  v_key    uuid := gen_random_uuid();
  v_count  int;
begin
  if p_slot is null or p_slot < 1 or p_slot > 6 then raise exception 'BAD_SLOT'; end if;

  select * into v_room from public.rooms
   where invite_code = trim(p_code) and closed_at is null
     and created_at > now() - interval '12 hours';
  if not found then raise exception 'INVALID_CODE'; end if;

  insert into public.room_players (room_id, slot, holder, last_seen)
  values (v_room.id, p_slot, v_holder, now())
  on conflict (room_id, slot) do update set holder = excluded.holder, last_seen = now();

  insert into public.seat_keys (room_id, slot, key) values (v_room.id, p_slot, v_key)
  on conflict (room_id, slot) do update set key = excluded.key;

  select count(*) into v_count from public.room_players
   where room_id = v_room.id and holder is not null;
  if v_count >= 6 and coalesce((v_room.stage ->> 'chat')::boolean, false) = false then
    update public.rooms set stage = stage || '{"chat":true}'::jsonb where id = v_room.id;
  end if;

  return json_build_object('room_id', v_room.id, 'slot', p_slot, 'holder', v_holder, 'key', v_key);
end;
$$;

-- ---------- Người chơi: lưu tiến độ (merge nông) + heartbeat ----------
-- Trả về false nếu khóa không còn hợp lệ (ghế đã bị máy khác lấy / DM giải phóng).
create or replace function public.save_progress(p_room uuid, p_slot int, p_key uuid, p_patch jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.seat_keys where room_id = p_room and slot = p_slot and key = p_key) then
    return false;
  end if;
  update public.room_players
     set progress = progress || coalesce(p_patch, '{}'::jsonb), last_seen = now()
   where room_id = p_room and slot = p_slot;
  return true;
end;
$$;

grant execute on function public.create_room(text)                         to anon, authenticated;
grant execute on function public.dm_update_room(uuid, uuid, jsonb)          to anon, authenticated;
grant execute on function public.dm_seat(uuid, uuid, int, text, jsonb)      to anon, authenticated;
grant execute on function public.dm_delete_room(uuid, uuid)                 to anon, authenticated;
grant execute on function public.join_room(text, int)                       to anon, authenticated;
grant execute on function public.save_progress(uuid, int, uuid, jsonb)      to anon, authenticated;

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_players;
