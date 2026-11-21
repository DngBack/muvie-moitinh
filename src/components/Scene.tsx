'use client';
/**
 * Ảnh nền các cảnh — vẽ bằng SVG để mô phỏng phong cách minh họa của app gốc.
 * Nếu DM đã upload ảnh thật vào slot bg_* thì dùng ảnh thật.
 */
import type { SceneKey } from '@/content/interfaces';

export type AnyScene = SceneKey | 'login' | 'chat';

export function Scene({ scene, imageUrl, className = '' }: { scene: AnyScene; imageUrl?: string | null; className?: string }) {
  if (imageUrl) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }
  return <div className={`absolute inset-0 overflow-hidden ${className}`}>{SCENES[scene]?.() ?? null}</div>;
}

const full = { width: '100%', height: '100%' } as const;

const SCENES: Record<AnyScene, () => JSX.Element> = {
  login: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3448" />
          <stop offset="1" stopColor="#141a27" />
        </linearGradient>
        <filter id="lb"><feGaussianBlur stdDeviation="2.2" /></filter>
        <radialGradient id="marble" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#e9f4ff" stopOpacity=".9" />
          <stop offset=".35" stopColor="#9ed6c7" stopOpacity=".7" />
          <stop offset="1" stopColor="#3b6a7a" stopOpacity=".6" />
        </radialGradient>
      </defs>
      <rect width="400" height="800" fill="url(#lg)" />
      {/* bi thủy tinh cánh cam */}
      <g filter="url(#lb)">
        <circle cx="230" cy="110" r="120" fill="url(#marble)" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d="M230 110 C 260 40, 320 40, 330 90 Z" fill="#e8743f" opacity=".85" transform={`rotate(${a} 230 110)`} />
        ))}
        <circle cx="200" cy="70" r="22" fill="#fff" opacity=".35" />
        {/* cục đất nặn */}
        <rect x="290" y="230" width="140" height="120" rx="40" fill="#d8743f" opacity=".9" transform="rotate(-20 360 290)" />
        <rect x="300" y="250" width="110" height="40" rx="18" fill="#3f8f7a" opacity=".7" transform="rotate(-20 360 290)" />
        {/* dây tết hoa */}
        <path d="M330 360 q -40 80 20 140 q 50 60 -10 140" stroke="#b84a3a" strokeWidth="14" fill="none" opacity=".8" />
      </g>
      <rect width="400" height="800" fill="#0b1020" opacity=".25" />
    </svg>
  ),

  chat: () => <div style={full} />,

  path: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ec9ec" />
          <stop offset=".55" stopColor="#d7e8f3" />
          <stop offset="1" stopColor="#f3ead2" />
        </linearGradient>
        <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f86b5" />
          <stop offset="1" stopColor="#9db6cf" />
        </linearGradient>
        <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c98a" />
          <stop offset="1" stopColor="#9fb26a" />
        </linearGradient>
        <filter id="wc"><feTurbulence baseFrequency=".02" numOctaves="3" seed="3" /><feDisplacementMap in="SourceGraphic" scale="8" /></filter>
        <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="400" height="800" fill="url(#sky)" />
      <g fill="#fff" opacity=".95" filter="url(#soft)">
        <ellipse cx="300" cy="170" rx="110" ry="45" />
        <ellipse cx="350" cy="140" rx="70" ry="45" />
        <ellipse cx="250" cy="200" rx="80" ry="30" />
        <ellipse cx="60" cy="120" rx="70" ry="22" />
      </g>
      <g filter="url(#wc)">
        <path d="M-20 430 L60 330 L130 380 L210 300 L300 370 L420 320 L420 480 L-20 480 Z" fill="url(#mtn)" opacity=".85" />
        <path d="M-20 470 L80 400 L170 440 L260 390 L420 430 L420 520 L-20 520 Z" fill="#7d9cbf" opacity=".9" />
        <rect y="470" width="400" height="330" fill="url(#field)" />
        <path d="M230 470 C 200 520, 330 560, 210 620 C 110 670, 160 720, 120 800 L 250 800 C 260 730, 200 690, 290 640 C 390 590, 250 530, 245 470 Z" fill="#eee3c8" />
        <g fill="#6f8f4b" opacity=".8">
          <circle cx="40" cy="480" r="26" /><circle cx="70" cy="470" r="22" /><circle cx="370" cy="478" r="20" />
        </g>
      </g>
      {/* đôi tình nhân */}
      <g transform="translate(170 560)">
        <ellipse cx="45" cy="210" rx="70" ry="10" fill="#000" opacity=".12" />
        {/* chàng trai */}
        <circle cx="20" cy="18" r="17" fill="#3a2a22" />
        <path d="M0 40 Q20 30 40 40 L44 110 L-4 110 Z" fill="#6c9fd8" />
        <path d="M2 110 L38 110 L36 205 L24 205 L20 140 L16 205 L4 205 Z" fill="#2b3346" />
        {/* cô gái */}
        <path d="M68 8 C 52 8, 50 40, 56 70 C 60 50, 90 50, 94 70 C 100 40, 90 8, 68 8 Z" fill="#3a2a22" />
        <circle cx="74" cy="24" r="15" fill="#e8c3a8" opacity=".3" />
        <path d="M58 46 Q76 38 92 46 L112 205 L44 205 Z" fill="#f28fb3" />
        <path d="M40 70 Q52 74 58 64" stroke="#e8c3a8" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  ),

  school: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full} className="rgb-split">
      <defs>
        <linearGradient id="sc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d5aa8" />
          <stop offset=".5" stopColor="#9a8fd6" />
          <stop offset="1" stopColor="#3a2e66" />
        </linearGradient>
        <pattern id="px" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="none" />
          <rect width="3" height="3" fill="#fff" opacity=".07" />
        </pattern>
      </defs>
      <rect width="400" height="800" fill="url(#sc)" />
      {/* tòa nhà dạy học */}
      <g opacity=".55">
        <rect x="40" y="250" width="320" height="360" fill="#2c2552" />
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 6 }).map((__, c) => (
            <rect key={`${r}-${c}`} x={58 + c * 50} y={270 + r * 64} width="30" height="38" fill={(r + c) % 4 === 0 ? '#ffd6f2' : '#6e63b8'} opacity={(r + c) % 4 === 0 ? 0.8 : 0.6} />
          )),
        )}
        <rect x="170" y="540" width="60" height="70" fill="#15112c" />
      </g>
      {/* hình người mờ + trái tim đỏ */}
      <g opacity=".75">
        <circle cx="200" cy="330" r="38" fill="#2a1f3d" />
        <circle cx="188" cy="325" r="5" fill="#fff" /><circle cx="212" cy="325" r="5" fill="#fff" />
        <path d="M186 345 Q200 356 214 345" stroke="#fff" strokeWidth="3" fill="none" />
        <path d="M200 370 C 230 430, 260 520, 300 560" stroke="#e01b5a" strokeWidth="3" fill="none" />
        <path d="M300 560 c -20 -30 -60 -10 -40 20 c 10 16 40 34 40 34 c 0 0 30 -18 40 -34 c 20 -30 -20 -50 -40 -20 z" fill="#ff2f86" />
      </g>
      {/* dải nhiễu */}
      {[120, 210, 380, 470, 650].map((y, i) => (
        <rect key={y} x={i % 2 ? 160 : 40} y={y} width={i % 2 ? 200 : 150} height={i % 3 ? 5 : 3} fill={i % 2 ? '#ff4fa3' : '#ffffff'} opacity=".7" />
      ))}
      <rect width="400" height="800" fill="url(#px)" />
    </svg>
  ),

  garden: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full}>
      <defs>
        <radialGradient id="bowl" cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor="#5b3b5f" />
          <stop offset="1" stopColor="#1d1426" />
        </radialGradient>
        <radialGradient id="rose" cx=".45" cy=".4" r=".6">
          <stop offset="0" stopColor="#ff6b8b" />
          <stop offset=".6" stopColor="#c8193f" />
          <stop offset="1" stopColor="#6d0b22" />
        </radialGradient>
      </defs>
      <rect width="400" height="800" fill="#cfc3d6" />
      <ellipse cx="230" cy="330" rx="330" ry="300" fill="#efe9f1" />
      <ellipse cx="240" cy="330" rx="290" ry="260" fill="url(#bowl)" />
      {Array.from({ length: 46 }).map((_, i) => {
        const a = i * 2.39996;
        const r = 18 * Math.sqrt(i + 1) * 1.55;
        const x = 240 + Math.cos(a) * r;
        const y = 330 + Math.sin(a) * r * 0.85;
        const s = 16 + ((i * 7) % 9);
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={s} fill="url(#rose)" />
            <path d={`M${-s * 0.5} 0 Q0 ${-s * 0.6} ${s * 0.5} 0 Q0 ${s * 0.5} ${-s * 0.5} 0`} fill="#8e0f2e" opacity=".55" />
            <circle r={s * 0.25} fill="#5a0718" opacity=".7" />
          </g>
        );
      })}
      <rect width="400" height="800" fill="#4a5a9a" opacity=".22" />
    </svg>
  ),

  room: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9a3d6" />
          <stop offset="1" stopColor="#e9def3" />
        </linearGradient>
        <filter id="grain"><feTurbulence baseFrequency=".8" numOctaves="2" /><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .2  0 0 0 0 .5  0 0 0 .35 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      </defs>
      <rect width="400" height="800" fill="url(#wall)" />
      {/* quạt trần */}
      <g transform="translate(200 90)" fill="#3a2d45" opacity=".85">
        <rect x="-3" y="-90" width="6" height="80" />
        <ellipse cx="0" cy="0" rx="16" ry="9" />
        <path d="M0 0 L-150 -14 L-150 6 Z" /><path d="M0 0 L150 -14 L150 6 Z" /><path d="M0 0 L-30 40 L-10 44 Z" />
      </g>
      {/* khung tranh */}
      <rect x="235" y="300" width="70" height="80" fill="none" stroke="#4b3b5c" strokeWidth="5" opacity=".7" />
      <rect x="245" y="310" width="50" height="60" fill="#7b6a95" opacity=".5" />
      {/* giường sắt */}
      <g stroke="#2b2236" strokeWidth="4" fill="none" opacity=".85">
        <path d="M20 560 L20 460 Q60 430 100 460 L100 560" />
        {[35, 50, 65, 80].map((x) => <line key={x} x1={x} y1="470" x2={x} y2="560" />)}
      </g>
      <rect x="20" y="560" width="380" height="60" fill="#f6f1fa" />
      <rect x="20" y="615" width="380" height="20" fill="#cbbfda" />
      {/* cô gái ngồi mép giường, quay lưng */}
      <g transform="translate(250 430)">
        <path d="M0 30 C -18 30, -22 70, -14 95 L 14 95 C 22 70, 18 30, 0 30 Z" fill="#4a2f3e" />
        <circle cx="0" cy="20" r="22" fill="#3a2430" />
        <path d="M-26 90 Q0 70 26 90 L 40 175 L -40 175 Z" fill="#f2d6e6" />
        <path d="M-40 175 L 40 175 L 50 200 L -30 200 Z" fill="#d79bbb" />
      </g>
      <rect width="400" height="800" filter="url(#grain)" opacity=".7" />
      <rect width="400" height="800" fill="#7a3fa0" opacity=".18" />
    </svg>
  ),

  field: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full}>
      <defs>
        <linearGradient id="fs" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e9f4" />
          <stop offset=".5" stopColor="#f2c8e0" />
          <stop offset="1" stopColor="#e7a6c8" />
        </linearGradient>
        <filter id="blur3"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="400" height="800" fill="url(#fs)" />
      <g filter="url(#blur3)">
        {Array.from({ length: 70 }).map((_, i) => {
          const x = (i * 53) % 420 - 10;
          const y = 470 + ((i * 37) % 330);
          const r = 8 + ((i * 13) % 14) * (y / 800);
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? '#e2457c' : '#ff8fb5'} opacity=".75" />;
        })}
      </g>
      {/* Hoan Hoan giữa cánh đồng */}
      <g transform="translate(200 300)">
        <path d="M-18 0 C -30 0, -34 50, -28 80 L 28 80 C 34 50, 30 0, 18 0 Z" fill="#6b4a5e" opacity=".85" />
        <circle cx="0" cy="18" r="22" fill="#f0d2c4" />
        <path d="M-22 10 C -22 -10, 22 -10, 22 10 C 14 0, -14 0, -22 10 Z" fill="#5a3b4c" />
        <path d="M-30 70 Q0 55 30 70 L 70 260 L -70 260 Z" fill="#ffffff" />
        <path d="M-70 260 L70 260 L80 280 L-80 280 Z" fill="#f4e6ef" />
      </g>
      <rect width="400" height="800" fill="#fff" opacity=".12" />
    </svg>
  ),

  void: () => (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={full} className="rgb-split">
      <rect width="400" height="800" fill="#141018" />
      {Array.from({ length: 40 }).map((_, i) => (
        <rect key={i} x="0" y={(i * 41) % 800} width="400" height={1 + (i % 3)} fill={i % 5 === 0 ? '#ff4fa3' : '#5b5466'} opacity={i % 5 === 0 ? 0.5 : 0.25} />
      ))}
      <rect x="0" y="0" width="400" height="40" fill="#ff3d8b" opacity=".55" />
    </svg>
  ),
};
