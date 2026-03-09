'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { address, faq, galleryImages, phone, phoneHref, programs, scheduleByDay, schedulePhoto } from '@/lib/data';

const dayList = Object.keys(scheduleByDay);
const categoryList = Object.keys(programs);

export default function HomePage() {
  const [activeDay, setActiveDay] = useState(dayList[0]);
  const [activeCategory, setActiveCategory] = useState(categoryList[0]);
  const [activeProgram, setActiveProgram] = useState(programs[categoryList[0]][0][0]);
  const [faqOpen, setFaqOpen] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [photoOpen, setPhotoOpen] = useState(false);

  const activeProgramContent = programs[activeCategory].find((item) => item[0] === activeProgram) ?? programs[activeCategory][0];

  return (
    <main className="relative overflow-x-clip bg-carbon">
      <section className="relative border-b border-white/10 bg-wall-texture">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        <div className="section-shell relative py-20 sm:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <p className="mb-3 inline-flex rounded-full border border-lime/40 px-4 py-1 text-xs uppercase tracking-[0.4em] text-neon">Сарапул · Первомайская 34</p>
            <h1 className="text-soft">
              <span className="block text-[clamp(2.5rem,15vw,8.5rem)] font-semibold leading-[0.85] tracking-[0.16em] sm:tracking-[0.22em]">ЭНЕРДЖИ</span>
              <span className="mt-2 block text-lg font-light uppercase tracking-[0.35em] text-soft/80 sm:text-2xl">фитнес-клуб</span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="mt-8 text-2xl font-medium sm:text-3xl">Энергия движения. Сила результата.</motion.p>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-4 max-w-2xl text-soft/80">Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-10 flex flex-wrap gap-4">
              <a href="#schedule" className="lime-gradient rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-carbon transition hover:-translate-y-0.5 hover:shadow-lime">Смотреть расписание</a>
              <a href={phoneHref} className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:border-lime/70 hover:text-neon">Позвонить</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell py-16">
        <h2 className="mb-6 text-3xl font-semibold">Атмосфера клуба</h2>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-charcoal/30 p-4">
          <div className="flex snap-x gap-4 overflow-x-auto pb-2">
            {galleryImages.map((item, idx) => (
              <motion.div key={item.src} whileHover={{ y: -4 }} className={`relative h-52 min-w-[75%] snap-center overflow-hidden rounded-2xl border border-white/10 md:min-w-[45%] ${galleryIndex === idx ? 'ring-1 ring-lime/60' : ''}`} onMouseEnter={() => setGalleryIndex(idx)}>
                <Image src={item.src} alt={item.alt} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-2xl font-semibold">О клубе</h3>
            <p className="mt-4 text-soft/80">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
            <div className="mt-6 rounded-2xl border border-lime/30 bg-lime/10 p-4 text-sm">
              <p className="font-semibold text-neon">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 lg:col-span-2">
            <h4 className="text-xl font-semibold">Часы работы</h4>
            <ul className="mt-4 space-y-2 text-soft/85">
              <li>Пн – Чт: с 07:00 до 21:00</li><li>Пт: с 07:00 до 20:45</li><li>Сб – Вс: с 09:00 до 17:45</li>
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((p) => (
                <div key={p} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <h2 className="mb-6 text-3xl font-semibold">Групповые программы</h2>
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-charcoal/30 p-4 md:p-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {categoryList.map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setActiveProgram(programs[cat][0][0]); }} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeCategory === cat ? 'lime-gradient text-carbon' : 'border border-white/10 bg-white/5 hover:border-lime/40'}`}>{cat}</button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              {programs[activeCategory].map(([name]) => (
                <button key={name} onClick={() => setActiveProgram(name)} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeProgram === name ? 'border-lime/60 bg-lime/10' : 'border-white/10 bg-white/5 hover:border-lime/40'} border`}>{name}</button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.article key={activeProgramContent[0]} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass-card rounded-2xl p-5">
                <h3 className="text-xl font-semibold text-neon">{activeProgramContent[0]}</h3>
                <p className="mt-3 text-soft/80">{activeProgramContent[1]}</p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="schedule" className="section-shell py-16">
        <h2 className="text-3xl font-semibold">Расписание</h2>
        <p className="mt-3 max-w-2xl text-soft/75">Выберите день недели и посмотрите занятия. Фото расписания доступно отдельно в полном размере.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-charcoal/30 p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {dayList.map((day) => (
                <button key={day} onClick={() => setActiveDay(day)} className={`rounded-full px-4 py-2 text-sm transition ${activeDay === day ? 'lime-gradient text-carbon' : 'border border-white/15 bg-white/5 hover:border-lime/40'}`}>{day}</button>
              ))}
            </div>
            <ul className="space-y-3">
              {scheduleByDay[activeDay].map((row) => (
                <li key={row} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{row}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => setPhotoOpen(true)} className="group relative min-h-72 overflow-hidden rounded-3xl border border-white/10 text-left">
            <Image src={schedulePhoto} alt="Фото расписания Энерджи фитнес-клуб" fill className="object-cover transition duration-500 group-hover:scale-[1.03]" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-6 flex items-end">
              <span className="rounded-full border border-lime/60 bg-black/50 px-4 py-2 text-sm text-neon">Открыть фото расписания</span>
            </div>
          </button>
        </div>
      </section>

      <section className="section-shell py-16">
        <h2 className="mb-6 text-3xl font-semibold">Тарифы</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Старт', ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство']],
            ['Стандарт', ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись']],
            ['Полный', ['расширенный доступ', 'максимум возможностей', 'выгодные условия']]
          ].map(([name, opts], idx) => (
            <motion.article whileHover={{ y: -6 }} key={name} className={`rounded-2xl border p-6 transition ${idx === 1 ? 'border-lime/70 bg-lime/10' : 'border-white/10 bg-white/5'}`}>
              <h3 className="text-2xl font-semibold">{name}</h3>
              <ul className="mt-4 space-y-2 text-soft/80">{(opts as string[]).map((x) => <li key={x}>• {x}</li>)}</ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-shell py-16">
        <h2 className="mb-6 text-3xl font-semibold">Частые вопросы</h2>
        <div className="space-y-3">
          {faq.map(([q, a], i) => {
            const open = faqOpen === i;
            return (
              <div key={q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <button onClick={() => setFaqOpen(open ? -1 : i)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <span>{q}</span><span className="text-neon">{open ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-4 text-soft/75">{a}</motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-shell py-16" id="contacts">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-charcoal/30 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">Контакты</h2>
            <p className="mt-4 text-soft/80">{address}</p>
            <p className="mt-2 text-xl font-semibold text-neon">{phone}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={phoneHref} className="lime-gradient rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-carbon">Позвонить</a>
              <a target="_blank" rel="noreferrer" href="https://yandex.ru/maps/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034&rtext=~%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034&rtt=auto" className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.12em] hover:border-lime/60">Построить маршрут</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <iframe title="Карта Энерджи фитнес-клуб" src="https://yandex.ru/map-widget/v1/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034" className="h-72 w-full" />
          </div>
        </div>
      </section>

      <a href={phoneHref} className="fixed bottom-5 right-4 z-50 rounded-full lime-gradient px-5 py-3 text-sm font-semibold text-carbon shadow-lime md:hidden">Позвонить</a>

      <AnimatePresence>
        {photoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4" onClick={() => setPhotoOpen(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-lime/30">
              <Image src={schedulePhoto} alt="Полное фото расписания" fill className="object-contain bg-black" unoptimized />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
