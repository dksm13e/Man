# Энерджи фитнес-клуб — сайт (Next.js)

## Запуск проекта
1. `npm install`
2. `npm run dev`
3. Откройте `http://localhost:3000`

## Где менять данные
- Фото атмосферы клуба: папка `public/images/club-atmosphere/`.
- Фото расписания: папка `public/images/schedule/`.
- Путь(и) к фото в коде: `lib/media.ts` → `PERMANENT_CLUB_IMAGES` и `listMediaFiles`.
- Номера телефона и блок выбора звонка: `app/home-client.tsx` → массив `phones`.
- Адрес клуба и маршрут: `app/home-client.tsx` → блок «Контакты», ссылка/iframe Яндекс Карт.
- Расписание по дням: `app/home-client.tsx` → массив `scheduleByDay`.
- Тексты и контент сайта: `app/home-client.tsx`.
- Глобальные стили и hero background: `app/globals.css`.

## Технологии
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
