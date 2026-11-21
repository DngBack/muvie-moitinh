'use client';
import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClient, supabaseConfigured } from '@/lib/supabase';
import { dmKeyOf, saveDmRoom } from '@/lib/keys';
import { makeDmApi } from '@/lib/dmApi';
import { RoomConsole } from '@/components/dm/RoomConsole';
import { DmShellMessage, NOT_CONFIGURED } from '@/components/dm/DmShell';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function DmRoom({ id }: { id: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [key, setKey] = useState<string | null | undefined>(undefined);
  const client = useMemo(() => (supabaseConfigured ? getClient() : null), []);

  // Mở bằng link điều khiển (?k=...) → nhớ khóa trên máy này rồi xóa khỏi thanh địa chỉ
  useEffect(() => {
    const k = sp.get('k');
    if (k && UUID.test(k) && client) {
      client.from('rooms').select('invite_code,name,created_at').eq('id', id).maybeSingle().then(({ data }) => {
        if (data) saveDmRoom({ id, code: data.invite_code, key: k, name: data.name, created: new Date(data.created_at).getTime() });
        setKey(k);
        router.replace(`/dm/room/${id}`);
      });
      return;
    }
    setKey(dmKeyOf(id));
  }, [sp, id, client, router]);

  const api = useMemo(() => (client && key ? makeDmApi(client, id, key) : null), [client, id, key]);

  if (!client) return <DmShellMessage spin={false} {...NOT_CONFIGURED} />;
  if (key === undefined) return <DmShellMessage title="Đang mở lượt chơi…" />;
  if (!key || !api) {
    return (
      <DmShellMessage spin={false} title="Máy này chưa có quyền điều khiển lượt chơi này" sub="Hãy mở bằng “Link điều khiển” (tab Lượt chơi trên máy đã tạo phòng), hoặc tạo lượt chơi mới.">
        <Link href="/dm" className="mt-4 text-[var(--dm-pink)] underline">Về trang DM</Link>
      </DmShellMessage>
    );
  }
  return <RoomConsole client={client} roomId={id} api={api} dmKey={key} />;
}

export default function DmRoomPage({ params }: { params: { id: string } }) {
  return <Suspense><DmRoom id={params.id} /></Suspense>;
}
