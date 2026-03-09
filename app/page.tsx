'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type DaySchedule = {
  day: string;
  classes: string[];
};

const clubImages = [
  'https://ibb.co/RpSy5WSd',
  'https://ibb.co/F4XvgY8q',
  'https://ibb.co/LD5gmrGM',
  'https://ibb.co/ZjPPHNJ'
];

const schedulePhoto = 'https://ibb.co/xKQMk6ZT';

const programCategories = [
  {
    title: 'Силовые программы',
    items: ['АБТ', '90/60/90', 'АБЛ', 'БЕДРА “-”', 'СУПЕР ПРЕСС', 'АНТИЦЕЛ. ТРЕНИНГ', 'МОЩНЫЙ КЛАСС', 'Функциональный тренинг', 'СКУЛЬПТОР ТЕЛА', 'СИЛОВАЯ С ПЕТЛЯМИ', 'ДЖАМПИНГ', 'КРУГОВАЯ']
  },
  {
    title: 'Аэробные программы',
    items: ['Смешанный тренинг', 'Фитбол', 'Степ 1']
  },
  {
    title: 'Танцевальные программы',
    items: ['ЗУМБА']
  }
];

const scheduleByDay: DaySchedule[] = [
  { day: 'Пн', classes: ['07:30 — Смешанный тренинг', '09:00 — Функциональный тренинг', '18:00 — АБТ', '19:00 — ЗУМБА'] },
  { day: 'Вт', classes: ['07:30 — Степ 1', '09:00 — СУПЕР ПРЕСС', '18:00 — КРУГОВАЯ', '19:00 — Фитбол'] },
  { day: 'Ср', classes: ['07:30 — АБЛ', '09:00 — МОЩНЫЙ КЛАСС', '18:00 — 90/60/90', '19:00 — ЗУМБА'] },
  { day: 'Чт', classes: ['07:30 — СИЛОВАЯ С ПЕТЛЯМИ', '09:00 — СКУЛЬПТОР ТЕЛА', '18:00 — АНТИЦЕЛ. ТРЕНИНГ', '19:00 — Смешанный тренинг'] },
  { day: 'Пт', classes: ['07:30 — ДЖАМПИНГ', '09:00 — СУПЕР ПРЕСС', '18:00 — Функциональный тренинг', '19:00 — ЗУМБА'] },
  { day: 'Сб', classes: ['10:00 — КРУГОВАЯ', '11:00 — Фитбол', '12:00 — ЗУМБА'] },
  { day: 'Вс', classes: ['10:00 — Смешанный тренинг', '11:00 — Степ 1', '12:00 — Функциональный тренинг'] }
];

const faq = [
  {
    q: 'Нужна ли предварительная запись?',
    a: 'Да, для первого посещения и пробной тренировки лучше заранее связаться с клубом по телефону, чтобы подобрать удобное время.'
  },
  {
    q: 'Что взять с собой на тренировку?',
    a: 'Удобную спортивную форму, сменную обувь, полотенце и воду. Если нужна консультация по первому посещению, администратор подскажет все детали.'
  },
  {
    q: 'Есть ли пробное посещение?',
    a: 'Да, можно записаться на пробное посещение и познакомиться с клубом, атмосферой и тренировочными зонами.'
  },
  {
    q: 'Как посмотреть расписание?',
    a: 'Актуальное расписание доступно на сайте в специальном разделе, а также его можно уточнить по телефону клуба.'
  },
  {
    q: 'Когда нужно покинуть клуб?',
    a: 'Клиенты покидают клуб за 15 минут до закрытия.'
  },
  {
    q: 'Подходит ли клуб для новичков?',
    a: 'Да, клуб подходит как для начинающих, так и для тех, кто давно занимается. Можно подобрать комфортный формат тренировок под свой уровень.'
  }
];

export default function Home() {
  const [activeDay, setActiveDay] = useState('Пн');
  const [scheduleModal, setScheduleModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const selectedDay = useMemo(() => scheduleByDay.find((d) => d.day === activeDay) ?? scheduleByDay[0], [activeDay]);

  return (
    <main className="relative overflow-x-hidden bg-carbon text-soft">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-texture" />

      <section className="section-shell relative pt-12 md:pt-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-card relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-transparent to-transparent" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1.1 }} className="absolute left-0 top-8 h-px w-52 bg-gradient-to-r from-transparent via-lime to-transparent" />
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-lime/90">Сарапул • Первомайская 34</p>
          <h1 className="text-[2.55rem] font-black uppercase leading-[0.84] tracking-[0.2em] text-white md:text-[6.4rem] md:tracking-[0.28em]">ЭНЕРДЖИ</h1>
          <p className="mt-2 text-lg tracking-[0.23em] text-soft/85 md:text-2xl">фитнес-клуб</p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-7 text-2xl font-semibold text-white md:text-4xl">
            Энергия движения. Сила результата.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-4 max-w-3xl text-sm leading-relaxed text-soft/85 md:text-base">
            Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap gap-4">
            <a href="#schedule" className="brand-button">Смотреть расписание</a>
            <a href="tel:+79000000000" className="ghost-button">Позвонить</a>
          </motion.div>
        </motion.div>
      </section>

      <section className="section-shell pt-12 md:pt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white md:text-3xl">Атмосфера клуба</h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:gap-6">
          {clubImages.map((src, i) => (
            <motion.a key={src} href={src} target="_blank" rel="noreferrer" whileHover={{ y: -5 }} className="group relative h-[260px] min-w-[83%] snap-center overflow-hidden rounded-2xl border border-white/10 bg-charcoal md:h-[360px] md:min-w-[46%]">
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/20 to-transparent" />
              <div className="absolute inset-0 transition duration-500 group-hover:bg-lime/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm text-soft/85">Фото клуба #{i + 1}</p>
                <p className="text-xs text-soft/60">Открыть в полном размере</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Групповые программы</h2>
        <p className="mt-2 max-w-2xl text-soft/75">Сильная сетка направлений без перегруженных описаний — только понятная и современная навигация по программам.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {programCategories.map((category) => (
            <motion.article key={category.title} whileHover={{ y: -6 }} className="glass-card rounded-2xl p-5 shadow-card transition duration-300">
              <h3 className="mb-4 text-lg font-semibold text-lime">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-soft/90">
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="schedule" className="section-shell pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Расписание</h2>
        <p className="mt-2 max-w-2xl text-soft/75">Выберите день недели, чтобы увидеть актуальные занятия. Полное фото расписания открывается отдельно в удобном формате.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-5 flex flex-wrap gap-2">
              {scheduleByDay.map((day) => (
                <button key={day.day} onClick={() => setActiveDay(day.day)} className={`rounded-full px-4 py-2 text-sm transition ${activeDay === day.day ? 'bg-lime text-carbon' : 'bg-white/5 text-soft hover:bg-white/10'}`}>
                  {day.day}
                </button>
              ))}
            </div>
            <ul className="space-y-2">
              {selectedDay.classes.map((line) => (
                <li key={line} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-soft/90">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <motion.button onClick={() => setScheduleModal(true)} whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 text-left shadow-card transition">
            <p className="text-xs uppercase tracking-[0.22em] text-lime">Фото расписания</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Открыть расписание</h3>
            <p className="mt-2 text-sm text-soft/75">Нажмите, чтобы открыть полное фото расписания без обрезки в отдельном окне.</p>
          </motion.button>
        </div>
      </section>

      <section className="section-shell pt-16">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">О клубе</h2>
          <p className="mt-3 max-w-4xl text-soft/80">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-lime/30 bg-lime/10 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-lime">Часы работы</p>
              <ul className="mt-3 space-y-1 text-sm text-soft">
                <li>Пн – Чт: с 07:00 до 21:00</li>
                <li>Пт: с 07:00 до 20:45</li>
                <li>Сб – Вс: с 09:00 до 17:45</li>
              </ul>
              <p className="mt-4 rounded-xl bg-carbon/80 px-3 py-2 text-sm font-semibold text-lime">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-lime">Преимущества</p>
              <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-soft/90 sm:grid-cols-2">
                {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-carbon/60 px-2 py-1">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Тарифы</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { name: 'Старт', items: ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство'] },
            { name: 'Стандарт', items: ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись'], featured: true },
            { name: 'Полный', items: ['расширенный доступ', 'максимум возможностей', 'выгодные условия'] }
          ].map((tariff) => (
            <motion.article key={tariff.name} whileHover={{ y: -5 }} className={`rounded-2xl border p-5 transition ${tariff.featured ? 'border-lime bg-lime/10 shadow-lime' : 'border-white/10 bg-white/[0.03]'}`}>
              <h3 className="text-xl font-semibold text-white">{tariff.name}</h3>
              <ul className="mt-3 space-y-2 text-sm text-soft/85">
                {tariff.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <a href="tel:+79000000000" className="mt-5 inline-flex text-sm text-lime underline underline-offset-4">Позвонить для записи</a>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Частые вопросы</h2>
        <div className="mt-5 space-y-3">
          {faq.map((entry, index) => (
            <div key={entry.q} className="glass-card rounded-2xl">
              <button className="flex w-full items-center justify-between px-4 py-4 text-left" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span className="text-sm font-medium text-white md:text-base">{entry.q}</span>
                <span className="text-lime">{activeFaq === index ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-4 text-sm text-soft/80">
                    {entry.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Контакты</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-3 text-sm text-soft/90">
              <p><span className="text-lime">Адрес:</span> Сарапул, Первомайская 34</p>
              <p><span className="text-lime">Телефон:</span> <a className="underline" href="tel:+79000000000">+7 (900) 000-00-00</a></p>
              <p><span className="text-lime">Часы работы:</span> Пн–Чт 07:00–21:00, Пт 07:00–20:45, Сб–Вс 09:00–17:45</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a className="brand-button" href="https://yandex.ru/maps/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034" target="_blank" rel="noreferrer">Построить маршрут</a>
                <a className="ghost-button" href="tel:+79000000000">Позвонить</a>
              </div>
            </div>
            <iframe
              title="Карта фитнес-клуба"
              src="https://yandex.ru/map-widget/v1/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034&z=16"
              className="h-64 w-full rounded-2xl border border-white/15"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <a href="tel:+79000000000" className="fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-lime text-carbon shadow-lime md:hidden" aria-label="Позвонить в клуб">
        ☎
      </a>

      <AnimatePresence>
        {scheduleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setScheduleModal(false)}>
            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }} className="relative max-h-[92vh] w-full max-w-5xl rounded-2xl border border-white/10 bg-charcoal p-3" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setScheduleModal(false)} className="absolute right-4 top-4 rounded-full border border-white/20 px-3 py-1 text-xs text-white">Закрыть</button>
              <a href={schedulePhoto} target="_blank" rel="noreferrer" className="mt-8 block h-[80vh] w-full rounded-xl border border-white/15 bg-carbon/50 p-4 text-center text-sm text-soft/80">
                Открыть полное фото расписания в отдельной вкладке
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
