'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type Shot = { src: string; title: string };

const gallery: Shot[] = [
  { src: 'https://i.ibb.co/s9Q6MZ0/club-1.jpg', title: 'Силовая зона' },
  { src: 'https://i.ibb.co/wQWjr4B/club-2.jpg', title: 'Кардио пространство' },
  { src: 'https://i.ibb.co/5vCWPH3/club-3.jpg', title: 'Зал групповых программ' },
  { src: 'https://i.ibb.co/0m3CLP7/club-4.jpg', title: 'Функциональный блок' }
];

const atmosphere: Shot[] = [
  { src: 'https://i.ibb.co/RpSy5WSd/atmo-1.jpg', title: 'Городская энергия' },
  { src: 'https://i.ibb.co/F4XvgY8q/atmo-2.jpg', title: 'Сильная атмосфера' },
  { src: 'https://i.ibb.co/LD5gmrGM/atmo-3.jpg', title: 'Выразительный интерьер' },
  { src: 'https://i.ibb.co/ZjPPHNJ/atmo-4.jpg', title: 'Тренировки в ритме города' }
];

const scheduleImage = { src: 'https://i.ibb.co/xKQMk6ZT/schedule.jpg', title: 'Расписание групповых программ' };

const schedule = {
  Понедельник: ['08:00 АБТ', '10:00 Степ 1', '18:00 Функциональный тренинг', '19:00 ЗУМБА'],
  Вторник: ['09:00 СУПЕР ПРЕСС', '11:00 Фитбол', '18:30 КРУГОВАЯ', '19:30 90/60/90'],
  Среда: ['08:00 АБЛ', '10:00 Смешанный тренинг', '18:00 МОЩНЫЙ КЛАСС', '19:00 ЗУМБА'],
  Четверг: ['09:00 АНТИЦЕЛ. ТРЕНИНГ', '11:00 Степ 1', '18:00 СИЛОВАЯ С ПЕТЛЯМИ', '19:30 ДЖАМПИНГ'],
  Пятница: ['08:00 СКУЛЬПТОР ТЕЛА', '10:00 Фитбол', '18:00 БЕДРА "-"', '19:00 Функциональный тренинг'],
  Суббота: ['10:00 Смешанный тренинг', '11:00 КРУГОВАЯ', '12:00 ЗУМБА'],
  Воскресенье: ['10:00 СУПЕР ПРЕСС', '11:00 Фитбол', '12:00 Степ 1']
};

const programs = {
  'Силовые программы': ['АБТ', '90/60/90', 'АБЛ', 'БЕДРА “-”', 'СУПЕР ПРЕСС', 'АНТИЦЕЛ. ТРЕНИНГ', 'МОЩНЫЙ КЛАСС', 'Функциональный тренинг', 'СКУЛЬПТОР ТЕЛА', 'СИЛОВАЯ С ПЕТЛЯМИ', 'ДЖАМПИНГ', 'КРУГОВАЯ'],
  'Аэробные программы': ['Смешанный тренинг', 'Фитбол', 'Степ 1'],
  'Танцевальные программы': ['ЗУМБА']
};

export default function Home() {
  const [day, setDay] = useState<keyof typeof schedule>('Понедельник');
  const [active, setActive] = useState(1);
  const [lightbox, setLightbox] = useState<{ open: boolean; list: Shot[]; index: number }>({ open: false, list: [], index: 0 });
  const list = useMemo(() => Object.entries(schedule), []);

  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % gallery.length), 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip bg-texture">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <section className="relative rounded-3xl border border-white/10 bg-carbon/70 p-8 md:p-14">
          <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,230,0,.15),transparent_40%)]" />
          <div className="relative z-10 space-y-6">
            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.75 }} className="text-[clamp(2.4rem,9vw,7rem)] font-black uppercase leading-none tracking-[0.34em] text-soft [text-shadow:0_10px_40px_rgba(0,0,0,.4)]">
              ЭНЕРДЖИ
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="-mt-3 text-xl md:text-3xl text-lime">фитнес-клуб</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="text-2xl md:text-4xl font-semibold">Энергия движения. Сила результата.</motion.h2>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="max-w-2xl text-soft/80 text-lg">Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-wrap gap-4">
              <a href="#schedule" className="rounded-xl bg-lime px-6 py-3 font-semibold text-carbon transition hover:bg-neon">Смотреть расписание</a>
              <a href="tel:+79000000000" className="rounded-xl border border-lime/60 px-6 py-3 font-semibold text-soft transition hover:shadow-glow">Позвонить</a>
            </motion.div>
          </div>
        </section>

        <section className="mt-14">
          <h3 className="section-title mb-6">Галерея клуба</h3>
          <div className="flex gap-4 overflow-hidden">
            {gallery.map((img, idx) => (
              <motion.button key={img.src} whileHover={{ y: -4 }} onClick={() => setLightbox({ open: true, list: gallery, index: idx })} className={`relative h-64 md:h-80 rounded-2xl overflow-hidden border transition-all ${idx === active ? 'w-[62%] border-lime/70' : 'w-[19%] border-white/10 opacity-75'}`}>
                <Image src={img.src} alt={img.title} fill className="object-cover" sizes="(max-width: 768px) 90vw, 30vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 text-left text-sm">{img.title}</div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {Object.entries(programs).map(([title, items], i) => (
            <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
              <h4 className="mb-4 text-xl font-semibold text-lime">{title}</h4>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-lime/70 hover:text-lime transition">{item}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </section>

        <section id="schedule" className="mt-16 card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="section-title">Расписание</h3>
            <button onClick={() => setLightbox({ open: true, list: [scheduleImage], index: 0 })} className="rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-left transition hover:border-lime/60 hover:shadow-glow">
              <div className="text-sm text-soft/70">Полное расписание</div>
              <div className="font-semibold">Открыть в полном размере</div>
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {list.map(([label]) => (
              <button key={label} onClick={() => setDay(label as keyof typeof schedule)} className={`rounded-lg px-3 py-2 text-sm ${day === label ? 'bg-lime text-carbon' : 'bg-white/5 hover:bg-white/10'}`}>{label}</button>
            ))}
          </div>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {schedule[day].map((item) => <li key={item} className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">{item}</li>)}
          </ul>
        </section>

        <section className="mt-16">
          <h3 className="section-title mb-6">Атмосфера клуба</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {atmosphere.map((img, idx) => (
              <button key={img.src} onClick={() => setLightbox({ open: true, list: atmosphere, index: idx })} className="group relative h-56 overflow-hidden rounded-2xl border border-white/10">
                <Image src={img.src} alt={img.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 text-sm">{img.title}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-16 card p-7 md:p-9">
          <h3 className="section-title mb-4">О клубе</h3>
          <p className="text-soft/85">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-black/20 p-4">
              <h4 className="mb-2 font-semibold text-lime">Часы работы клуба</h4>
              <ul className="space-y-1 text-sm">
                <li>Пн – Чт: с 07:00 до 21:00</li>
                <li>Пт: с 07:00 до 20:45</li>
                <li>Сб – Вс: с 09:00 до 17:45</li>
              </ul>
              <p className="mt-2 text-xs text-soft/70">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((b) => (
                <span key={b} className="h-fit rounded-lg border border-white/10 px-3 py-2 text-sm">{b}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 card p-7">
          <h3 className="section-title mb-5">Частые вопросы</h3>
          <FAQ />
        </section>

        <section className="mt-16 card p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Сарапул, Первомайская 34</h3>
            <p className="text-soft/70">Энерджи фитнес-клуб</p>
            <a href="tel:+79000000000" className="mt-3 inline-block text-2xl font-bold text-lime">+7 (900) 000-00-00</a>
          </div>
          <Link href="https://yandex.ru/maps/?text=Сарапул%2C%20Первомайская%2034" target="_blank" className="rounded-xl bg-lime px-5 py-3 font-semibold text-carbon">Построить маршрут</Link>
        </section>
      </div>

      <a href="tel:+79000000000" className="fixed bottom-5 right-5 rounded-full bg-lime px-5 py-3 font-semibold text-carbon shadow-glow md:hidden">Позвонить</a>

      <Lightbox state={lightbox} onClose={() => setLightbox((s) => ({ ...s, open: false }))} onNavigate={(dir) => setLightbox((s) => ({ ...s, index: (s.index + dir + s.list.length) % s.list.length }))} />
    </main>
  );
}

function FAQ() {
  const qa = [
    ['Есть ли пробное посещение?', 'Да, вы можете записаться на пробное посещение и подобрать подходящую программу с тренером.'],
    ['Подходит ли клуб для новичков?', 'Да, программы выстроены так, чтобы комфортно стартовать и постепенно повышать нагрузку.'],
    ['Нужна ли предварительная запись на групповые?', 'Рекомендуем запись заранее, чтобы гарантировать место в удобном слоте.'],
    ['Есть ли вечерние тренировки?', 'Да, в будни есть насыщенные вечерние группы после 18:00.']
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {qa.map(([q, a], i) => (
        <div key={q} className="rounded-xl border border-white/10">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left font-medium">
            {q}<span className="text-lime">{open === i ? '−' : '+'}</span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-4 text-soft/80">
                {a}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function Lightbox({ state, onClose, onNavigate }: { state: { open: boolean; list: Shot[]; index: number }; onClose: () => void; onNavigate: (dir: number) => void }) {
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.open, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 p-4 md:p-10" onClick={onClose}>
          <button className="absolute right-5 top-5 rounded-lg border border-white/20 px-3 py-2" onClick={onClose}>Закрыть</button>
          {state.list.length > 1 && <>
            <button className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2" onClick={(e) => {e.stopPropagation(); onNavigate(-1);}}>←</button>
            <button className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2" onClick={(e) => {e.stopPropagation(); onNavigate(1);}}>→</button>
          </>}
          <div
            className="relative mx-auto h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setStartX(e.changedTouches[0].clientX)}
            onTouchEnd={(e) => {
              if (startX === null) return;
              const delta = e.changedTouches[0].clientX - startX;
              if (Math.abs(delta) > 45 && state.list.length > 1) onNavigate(delta < 0 ? 1 : -1);
              setStartX(null);
            }}
          >
            <Image src={state.list[state.index].src} alt={state.list[state.index].title} fill className="object-contain" sizes="100vw" priority />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
