'use client';
import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { publicMediaUrl } from './supabase';

export interface AssetRow { key: string; storage_path: string; mime: string | null; file_name: string | null; updated_at: string }

/** Bản đồ key → URL công khai của tài sản đã upload (nhạc, ảnh nền...). */
export function useAssets(client: SupabaseClient | null, enabled = true) {
  const [rows, setRows] = useState<AssetRow[]>([]);
  const reload = useCallback(async () => {
    if (!client || !enabled) return;
    const { data } = await client.from('assets').select('*');
    if (data) setRows(data as AssetRow[]);
  }, [client, enabled]);
  useEffect(() => { reload(); }, [reload]);
  const urlOf = useCallback(
    (key: string) => {
      const r = rows.find((x) => x.key === key);
      return r ? `${publicMediaUrl(r.storage_path)}?v=${encodeURIComponent(r.updated_at)}` : null;
    },
    [rows],
  );
  return { rows, urlOf, reload };
}
