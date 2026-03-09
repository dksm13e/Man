import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб',
  description: 'Современный фитнес-клуб в Сарапуле: программы, расписание, тарифы и запись по телефону.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
