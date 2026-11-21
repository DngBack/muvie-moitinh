'use client';
import { DmGuard, useDmSession } from '@/components/dm/useDmSession';
import { RoomConsole } from '@/components/dm/RoomConsole';

export default function DmRoomPage({ params }: { params: { id: string } }) {
  const { client } = useDmSession();
  return <DmGuard>{() => (client ? <RoomConsole client={client} roomId={params.id} /> : null)}</DmGuard>;
}
