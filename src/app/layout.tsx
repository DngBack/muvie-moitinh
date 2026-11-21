import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Charm, VT323 } from 'next/font/google';
import './globals.css';

const sans = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});
const pixel = VT323({ subsets: ['vietnamese', 'latin'], weight: '400', variable: '--font-pixel', display: 'swap' });
const brush = Charm({ subsets: ['vietnamese', 'latin'], weight: ['400', '700'], variable: '--font-brush', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mối Tình Đẫm Máu — Thiên Hy Niên 2.0',
  description: 'Ứng dụng đồng hành cho kịch bản 《Mối Tình Đẫm Máu》: giao diện người chơi và bảng điều khiển người dẫn trò.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0f1c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${pixel.variable} ${brush.variable}`}>
      <body>{children}</body>
    </html>
  );
}
