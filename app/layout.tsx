import type { Metadata } from 'next';
import './globals.css';
import { PERMANENT_CLUB_IMAGES, PERMANENT_SCHEDULE_IMAGES } from '../lib/media';

export const metadata: Metadata = {
  title: 'Энерджи фитнес-клуб | Сарапул',
  description: 'Современный фитнес-клуб в Сарапуле: групповые программы, расписание и атмосфера результата.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const galleryPreloadOrder = [0, 1, 2, PERMANENT_CLUB_IMAGES.length - 1];
  const criticalGalleryImages: string[] = [];
  for (const index of galleryPreloadOrder) {
    const src = PERMANENT_CLUB_IMAGES[index];
    if (src && !criticalGalleryImages.includes(src)) {
      criticalGalleryImages.push(src);
    }
  }
  const criticalScheduleImage = 'https://i.ibb.co/VpN2kKxY/08-04.jpg';
  const fallbackScheduleImage = PERMANENT_SCHEDULE_IMAGES[0];

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://i.ibb.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        {criticalGalleryImages.map((src) => (
          <link key={`preload-${src}`} rel="preload" as="image" href={src} fetchPriority="high" />
        ))}
        <link rel="preload" as="image" href={criticalScheduleImage} fetchPriority="high" />
        <link rel="preload" as="image" href={fallbackScheduleImage} fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}

