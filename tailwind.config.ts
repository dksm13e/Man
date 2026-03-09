import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#2B2B26',
        charcoal: '#3A3A34',
        carbon: '#24241F',
        lime: '#C8D600',
        neon: '#D8E600',
        soft: '#F3F3EF'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(216, 230, 0, 0.2), 0 0 28px rgba(216, 230, 0, 0.3)',
      },
      backgroundImage: {
        texture: 'radial-gradient(circle at 20% 20%, rgba(216,230,0,.07), transparent 42%), radial-gradient(circle at 70% 10%, rgba(255,255,255,.06), transparent 38%), linear-gradient(145deg,#24241F,#2B2B26,#3A3A34)'
      }
    }
  },
  plugins: []
};

export default config;
