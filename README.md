# Энерджи фитнес-клуб — сайт (Next.js)

## Запуск проекта
1. `npm install`
2. `npm run dev`
3. Откройте `http://localhost:3000`

## Где менять данные
- Фото атмосферы клуба: папка `public/images/club-atmosphere/`.
- Фото расписания: папка `public/images/schedule/`.
- Путь(и) к фото в коде: `app/page.tsx` → `clubImages` и `scheduleImages`.
- Номера телефона и блок выбора звонка: `app/page.tsx` → массив `phones`.
- Адрес клуба и маршрут: `app/page.tsx` → блок «Контакты», ссылка/iframe Яндекс Карт.
- Расписание по дням: `app/page.tsx` → массив `scheduleByDay`.
- Тексты и контент сайта: `app/page.tsx`.
- Глобальные стили и hero background: `app/globals.css`.

## Технологии
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
