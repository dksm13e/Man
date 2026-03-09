import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб',
  description: 'Современный фитнес-клуб с функциональными зонами, групповыми программами и сильным комьюнити.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
