import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
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
        lime: '0 0 0 1px rgba(200,214,0,0.45), 0 16px 40px rgba(200,214,0,0.2)',
        card: '0 12px 28px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'wall-texture': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 0, transparent 35%), radial-gradient(circle at 80% 20%, rgba(200,214,0,0.1) 0, transparent 30%), linear-gradient(145deg, #24241F 0%, #2B2B26 55%, #3A3A34 100%)'
      }
    }
  },
  plugins: []
};

export default config;
