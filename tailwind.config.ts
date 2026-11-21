import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dm: { pink: '#E8457A', pink2: '#F06292', ink: '#2b2b33', line: '#e6e3ea', mute: '#9a97a3', done: '#8e6bbf' },
        qq: { bg: '#0D1220', bg2: '#1B2333', text: '#dfe6f5', mute: '#8b95ab', gold: '#F3C443', green: '#3c9a48' },
        glitch: { violet: '#C86BD6', pink: '#ff4fa3' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'ui-monospace', 'monospace'],
        brush: ['var(--font-brush)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
