import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб',
  description: 'Энерджи фитнес-клуб — современный городской клуб с сильной атмосферой движения и результата.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
