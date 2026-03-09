# Энерджи фитнес-клуб — сайт (Next.js)

## Запуск проекта
1. `npm install`
2. `npm run dev`
3. Откройте `http://localhost:3000`

## Где менять данные
- Фото клуба (галерея и атмосферные секции): `app/page.tsx` → массив `clubImages`.
- Телефон и ссылки звонка: `app/page.tsx` → все `tel:+79000000000` и текст `+7 (900) 000-00-00`.
- Адрес клуба и маршрут: `app/page.tsx` → блок «Контакты», ссылка/iframe Яндекс Карт.
- Расписание по дням: `app/page.tsx` → массив `scheduleByDay`.
- Фото расписания: `app/page.tsx` → константа `schedulePhoto`.
- Тексты и контент сайта (hero, «О клубе», FAQ, тарифы, программы): `app/page.tsx`.
- Цвета/глобальные стили/кнопки: `app/globals.css`, `tailwind.config.ts`.

## Технологии
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
