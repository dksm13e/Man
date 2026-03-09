import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб',
  description: 'Современный городской фитнес-клуб с сильной атмосферой и удобным расписанием.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
