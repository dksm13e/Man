import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб',
  description:
    'Современный городской фитнес-клуб с сильной атмосферой, групповыми программами и удобным расписанием.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
