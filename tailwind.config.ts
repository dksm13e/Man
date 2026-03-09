import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
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
        glow: '0 0 30px rgba(200,214,0,0.25)'
      }
    }
  },
  plugins: []
};

export default config;
