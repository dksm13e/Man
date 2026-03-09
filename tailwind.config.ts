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
        lime: '0 0 40px rgba(200, 214, 0, 0.2)',
        card: '0 25px 50px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        texture:
          'radial-gradient(circle at 20% 10%, rgba(255,255,255,.05), transparent 30%), radial-gradient(circle at 80% 40%, rgba(200,214,0,.08), transparent 25%), linear-gradient(120deg, rgba(255,255,255,.03) 0%, transparent 60%)'
      }
    }
  },
  plugins: []
};

export default config;
