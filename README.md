# Энерджи фитнес-клуб — сайт на Next.js

## Запуск проекта
1. `npm install`
2. `npm run dev`
3. Откройте `http://localhost:3000`

## Где менять контент
- Фото клуба для галереи: `public/images/club/` и список в `lib/data.ts` (`galleryImages`).
- Телефон и ссылка на звонок: `lib/data.ts` (`phone`, `phoneHref`).
- Адрес клуба: `lib/data.ts` (`address`).
- Расписание по дням: `lib/data.ts` (`scheduleByDay`).
- Фото расписания: `lib/data.ts` (`schedulePhoto`) — замените ссылку или используйте локальный файл в `public/images/`.
- Тексты секций, тарифы, FAQ и UI-структура: `app/page.tsx`.

## Примечание
Данные расписания хранятся в коде в виде массива/объекта (без Excel/xlsx), а фото расписания открывается в полноразмерном модальном окне.
