import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб',
  description: 'Современный фитнес-клуб с групповыми программами и удобным расписанием.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
