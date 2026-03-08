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
        neonline: '#D8E600',
        softlight: '#F3F3EF'
      },
      boxShadow: {
        lime: '0 0 40px rgba(200, 214, 0, 0.32)'
      }
    }
  },
  plugins: []
};

export default config;
