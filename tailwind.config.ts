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
        glow: '0 0 30px rgba(216,230,0,0.2)',
        card: '0 20px 50px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'hero-texture': 'radial-gradient(circle at 20% 20%, rgba(216,230,0,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(200,214,0,0.08), transparent 35%), linear-gradient(120deg, transparent 0%, rgba(216,230,0,0.06) 45%, transparent 55%), linear-gradient(160deg, rgba(58,58,52,0.4), rgba(36,36,31,0.75))'
      }
    }
  },
  plugins: []
};

export default config;
