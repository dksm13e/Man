'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type DaySchedule = { day: string; classes: string[] };

const clubImages = Array.from({ length: 12 }, (_, i) => `/images/club-atmosphere/club-${i + 1}.svg`);
const scheduleImages = ['/images/schedule/schedule-main.svg'];

const phones = [
  { label: 'Основной номер', display: '8-904-31-444-31', href: 'tel:+79043144431' },
  { label: 'Быстрая связь', display: '8-912-456-62-56', href: 'tel:+79124566256' }
];

const programCategories = [
  {
    title: 'Силовые программы',
    items: ['АБТ', '90/60/90', 'АБЛ', 'БЕДРА “-”', 'СУПЕР ПРЕСС', 'АНТИЦЕЛ. ТРЕНИНГ', 'МОЩНЫЙ КЛАСС', 'Функциональный тренинг', 'СКУЛЬПТОР ТЕЛА', 'СИЛОВАЯ С ПЕТЛЯМИ', 'ДЖАМПИНГ', 'КРУГОВАЯ']
  },
  { title: 'Аэробные программы', items: ['Смешанный тренинг', 'Фитбол', 'Степ 1'] },
  { title: 'Танцевальные программы', items: ['ЗУМБА'] }
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
  { q: 'Нужна ли предварительная запись?', a: 'Да, для первого посещения и пробной тренировки лучше заранее связаться с клубом по телефону, чтобы подобрать удобное время.' },
  { q: 'Что взять с собой на тренировку?', a: 'Удобную спортивную форму, сменную обувь, полотенце и воду. Если нужна консультация по первому посещению, администратор подскажет все детали.' },
  { q: 'Есть ли пробное посещение?', a: 'Да, можно записаться на пробное посещение и познакомиться с клубом, атмосферой и тренировочными зонами.' },
  { q: 'Как посмотреть расписание?', a: 'Актуальное расписание доступно на сайте в специальном разделе, а также его можно уточнить по телефону клуба.' },
  { q: 'Когда нужно покинуть клуб?', a: 'Клиенты покидают клуб за 15 минут до закрытия.' },
  { q: 'Подходит ли клуб для новичков?', a: 'Да, клуб подходит как для начинающих, так и для тех, кто давно занимается. Можно подобрать комфортный формат тренировок под свой уровень.' }
];

export default function Home() {
  const [activeDay, setActiveDay] = useState('Пн');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [callModal, setCallModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxMode, setLightboxMode] = useState<'gallery' | 'schedule' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pinchStart, setPinchStart] = useState<number | null>(null);

  const selectedDay = useMemo(() => scheduleByDay.find((d) => d.day === activeDay) ?? scheduleByDay[0], [activeDay]);
  const lightboxImages = lightboxMode === 'schedule' ? scheduleImages : clubImages;
  const currentPhoto = lightboxMode ? lightboxImages[lightboxIndex ?? 0] : null;

  const openGallery = (index: number) => {
    setLightboxMode('gallery');
    setLightboxIndex(index);
    setZoom(1);
  };

  const openSchedule = () => {
    setLightboxMode('schedule');
    setLightboxIndex(0);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxMode(null);
    setLightboxIndex(null);
    setZoom(1);
  };

  const next = () => {
    if (lightboxMode !== 'gallery' || lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % clubImages.length);
    setZoom(1);
  };

  const prev = () => {
    if (lightboxMode !== 'gallery' || lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + clubImages.length) % clubImages.length);
    setZoom(1);
  };

  return (
    <main className="site-bg relative overflow-x-hidden bg-carbon text-soft">

      <section className="hero-backdrop section-accent hero-scene relative pt-12 md:pt-16">
        <motion.div
          initial={{ opacity: 0.5, x: -20 }}
          animate={{ opacity: 0.8, x: 20 }}
          transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror' }}
          className="hero-slash hero-slash-a"
        />
        <motion.div
          initial={{ opacity: 0.45, x: 18 }}
          animate={{ opacity: 0.72, x: -16 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror' }}
          className="hero-slash hero-slash-b"
        />
        <div className="section-shell relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative max-w-5xl px-1 py-12 md:px-2 md:py-16">
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-lime/90">Сарапул • Первомайская 34</p>
            <h1 className="text-[2.55rem] font-black uppercase leading-[0.84] tracking-[0.2em] text-white md:text-[6.4rem] md:tracking-[0.28em]">ЭНЕРДЖИ</h1>
            <p className="mt-2 text-lg tracking-[0.23em] text-soft/85 md:text-2xl">фитнес-клуб</p>
            <p className="mt-7 text-2xl font-semibold text-white md:text-4xl">Энергия движения. Сила результата.</p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-soft/85 md:text-base">
              Современный фитнес-клуб с сильным ритмом тренировок, удобным расписанием и атмосферой, где хочется возвращаться к результату каждую неделю.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" className="brand-button premium-transition" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Смотреть расписание
              </button>
              <button type="button" onClick={() => setCallModal(true)} className="ghost-button premium-transition">
                Позвонить
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell section-accent pt-12 md:pt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white md:text-3xl">Залы и атмосфера</h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:gap-6">
          {clubImages.map((src, i) => (
            <motion.button key={src} type="button" onClick={() => openGallery(i)} whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="group relative h-[260px] min-w-[83%] snap-center overflow-hidden rounded-2xl border border-white/10 bg-charcoal text-left md:h-[360px] md:min-w-[46%]">
              <img src={src} alt="Атмосфера клуба" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="section-shell section-accent pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Групповые программы</h2>
        <p className="mt-2 max-w-2xl text-soft/75">Сильная сетка направлений без перегруженных описаний — только понятная и современная навигация по программам.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {programCategories.map((category) => (
            <motion.article key={category.title} whileHover={{ y: -4 }} transition={{ duration: 0.24 }} className="glass-card rounded-2xl p-5 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-lime">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-soft/90 transition hover:border-lime/40 hover:bg-lime/10">
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="schedule" className="section-shell section-accent pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Расписание тренировок</h2>
        <p className="mt-2 max-w-3xl text-soft/75">Выберите день и задайте темп недели. Полное фото расписания открывается мягко и сразу, без лишних шагов.</p>
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
                <li key={line} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-soft/90 transition hover:border-lime/25 hover:bg-white/[0.05]">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <motion.button type="button" onClick={openSchedule} whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="glass-card schedule-preview premium-transition rounded-2xl p-6 text-left shadow-card">
            <p className="text-xs uppercase tracking-[0.22em] text-lime">Официальная сетка</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Открыть полное расписание</h3>
            <p className="mt-2 text-sm text-soft/80">Четкий просмотр фото в фирменном lightbox, с плавным открытием и удобным закрытием.</p>
          </motion.button>
        </div>
      </section>

      <section className="section-shell section-accent pt-16">
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
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24 }} className="overflow-hidden px-4 pb-4 text-sm text-soft/80">
                    {entry.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell section-accent py-16">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Контакты</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-3 text-sm text-soft/90">
              <p>
                <span className="text-lime">Адрес:</span> Сарапул, Первомайская 34
              </p>
              <div className="grid gap-2">
                {phones.map((phone) => (
                  <a key={phone.href} className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-3 py-3 transition hover:border-lime/40 hover:bg-lime/10" href={phone.href}>
                    <span className="text-soft/70">{phone.label}</span>
                    <span className="font-semibold text-white transition group-hover:translate-x-0.5">{phone.display}</span>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a className="brand-button" href="https://yandex.ru/maps/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034" target="_blank" rel="noreferrer">
                  Построить маршрут
                </a>
                <button type="button" onClick={() => setCallModal(true)} className="ghost-button premium-transition">
                  Позвонить
                </button>
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

      <button type="button" onClick={() => setCallModal(true)} className="fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-lime text-carbon shadow-lime md:hidden" aria-label="Позвонить в клуб">
        ☎
      </button>

      <AnimatePresence>
        {callModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center" onClick={() => setCallModal(false)}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.26 }} className="glass-card w-full max-w-md rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-lime">Связь с клубом</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Выберите номер для звонка</h3>
                </div>
                <button onClick={() => setCallModal(false)} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white">
                  Закрыть
                </button>
              </div>
              <div className="space-y-2">
                {phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-3 py-3 transition hover:border-lime/40 hover:bg-lime/10">
                    <span className="text-sm text-soft/70">{phone.label}</span>
                    <span className="text-base font-semibold text-white transition group-hover:translate-x-0.5">{phone.display}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-3 md:p-6" onClick={closeLightbox}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ type: 'spring', stiffness: 190, damping: 24, mass: 0.9 }} className="relative flex max-h-[95vh] w-full max-w-7xl items-center justify-center rounded-2xl border border-white/10 bg-charcoal/80 p-2" onClick={(e) => e.stopPropagation()}>
              {lightboxMode === 'gallery' && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-carbon/70 px-3 py-2 text-white">
                    ←
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-carbon/70 px-3 py-2 text-white">
                    →
                  </button>
                </>
              )}
              <button onClick={closeLightbox} className="absolute right-3 top-3 z-10 rounded-full border border-white/25 bg-carbon/80 px-3 py-1 text-xs text-white">
                Закрыть
              </button>
              <div
                className="relative flex h-[90vh] w-full items-center justify-center overflow-hidden rounded-xl"
                onTouchStart={(e) => {
                  if (e.touches.length === 1) setTouchStartX(e.touches[0].clientX);
                  if (e.touches.length === 2) {
                    setPinchStart(Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY));
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2 && pinchStart) {
                    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    setZoom((z) => Math.min(3, Math.max(1, z * (d / pinchStart))));
                    setPinchStart(d);
                    return;
                  }
                  if (e.touches.length === 1 && touchStartX !== null && zoom <= 1.05 && lightboxMode === 'gallery') {
                    const delta = e.touches[0].clientX - touchStartX;
                    if (delta > 70) {
                      prev();
                      setTouchStartX(e.touches[0].clientX);
                    } else if (delta < -70) {
                      next();
                      setTouchStartX(e.touches[0].clientX);
                    }
                  }
                }}
                onTouchEnd={() => {
                  setTouchStartX(null);
                  setPinchStart(null);
                  if (zoom < 1.03) setZoom(1);
                }}
              >
                <img src={currentPhoto} alt="Фото" className="max-h-[88vh] max-w-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoom})` }} onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
