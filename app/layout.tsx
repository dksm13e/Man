import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб | Сарапул',
  description: 'Современный фитнес-клуб в Сарапуле: групповые программы, расписание и атмосфера результата.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
