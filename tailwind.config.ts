import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#2B2B26',
        charcoal: '#3A3A34',
        lime: '#C8D600',
        neonline: '#D8E600',
        light: '#F3F3EF'
      },
      boxShadow: {
        lime: '0 0 25px rgba(200, 214, 0, 0.35)'
      },
      backgroundImage: {
        'sport-grid':
          'linear-gradient(rgba(200,214,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(200,214,0,0.08) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

export default config;
