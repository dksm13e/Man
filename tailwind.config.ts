import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './data/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#2B2B26',
        charcoal: '#3A3A34',
        carbon: '#24241F',
        lime: '#C8D600',
        neonLime: '#D8E600',
        soft: '#F3F3EF'
      },
      boxShadow: {
        limeGlow: '0 0 0 1px rgba(200,214,0,.35), 0 12px 30px rgba(200,214,0,.14)',
        card: '0 20px 45px rgba(0,0,0,.25)'
      }
    }
  },
  plugins: []
};

export default config;
