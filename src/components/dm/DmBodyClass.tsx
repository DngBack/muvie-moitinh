'use client';
import { useEffect } from 'react';

/** Trang DM dùng nền trắng (body mặc định là nền tối của người chơi). */
export function DmBodyClass() {
  useEffect(() => {
    document.body.classList.add('dm-body');
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute('content');
    meta?.setAttribute('content', '#ffffff');
    return () => { document.body.classList.remove('dm-body'); if (prev) meta?.setAttribute('content', prev); };
  }, []);
  return null;
}
