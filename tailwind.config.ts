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
        neonLime: '#D8E600',
        softLight: '#F3F3EF'
      },
      boxShadow: {
        glow: '0 0 40px rgba(200, 214, 0, 0.35)'
      },
      backgroundImage: {
        'radial-energy': 'radial-gradient(circle at 20% 20%, rgba(216,230,0,0.22), transparent 40%), radial-gradient(circle at 80% 0%, rgba(200,214,0,0.12), transparent 28%)'
      }
    }
  },
  plugins: []
};

export default config;
