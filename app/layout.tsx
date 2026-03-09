import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб | Сарапул',
  description: 'Современный фитнес-клуб в Сарапуле: групповые программы, расписание и атмосфера движения.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
