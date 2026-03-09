'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type DaySchedule = {
  day: string;
  classes: string[];
};

type GalleryPhoto = {
  src: string;
  alt: string;
  badge: string;
};

const toRenderableImage = (url: string) =>
  url.includes('ibb.co/') ? `https://image.thum.io/get/width/1800/noanimate/${url}` : url;

const clubImages: GalleryPhoto[] = [
  { src: 'https://ibb.co/RpSy5WSd', alt: 'Интерьер клуба 1', badge: 'Зона тренировок' },
  { src: 'https://ibb.co/F4XvgY8q', alt: 'Интерьер клуба 2', badge: 'Атмосфера клуба' },
  { src: 'https://ibb.co/LD5gmrGM', alt: 'Интерьер клуба 3', badge: 'Городской ритм' },
  { src: 'https://ibb.co/ZjPPHNJ', alt: 'Интерьер клуба 4', badge: 'Сильная энергия' },
  { src: 'https://ibb.co/3y9dMMHp', alt: 'Интерьер клуба 5', badge: 'Свет и глубина' },
  { src: 'https://ibb.co/7Jf0bk5y', alt: 'Интерьер клуба 6', badge: 'Фирменный стиль' },
  { src: 'https://ibb.co/b57dYxXc', alt: 'Интерьер клуба 7', badge: 'Тренировочная зона' },
  { src: 'https://ibb.co/qL0B48YR', alt: 'Интерьер клуба 8', badge: 'Рабочая атмосфера' },
  { src: 'https://ibb.co/y9KzYfh', alt: 'Интерьер клуба 9', badge: 'Клубный настрой' },
  { src: 'https://ibb.co/4gtrrbqg', alt: 'Интерьер клуба 10', badge: 'Динамика пространства' },
  { src: 'https://ibb.co/Y4hS3xYb', alt: 'Интерьер клуба 11', badge: 'Современный зал' },
  { src: 'https://ibb.co/23njvXy7', alt: 'Интерьер клуба 12', badge: 'Визуальный характер' }
];

const schedulePhoto = 'https://ibb.co/xKQMk6ZT';

const phones = [
  { label: 'Основной номер', display: '8-904-31-444-31', href: 'tel:+79043144431' },
  { label: 'Быстрая связь', display: '8-912-456-62-56', href: 'tel:+79124566256' }
];

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
  const [isSchedulePhoto, setIsSchedulePhoto] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pinchStart, setPinchStart] = useState<number | null>(null);

  const selectedDay = useMemo(() => scheduleByDay.find((d) => d.day === activeDay) ?? scheduleByDay[0], [activeDay]);
  const currentPhoto = isSchedulePhoto ? { src: schedulePhoto, alt: 'Фото расписания Энерджи фитнес-клуб' } : lightboxIndex !== null ? clubImages[lightboxIndex] : null;

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsSchedulePhoto(false);
    setZoom(1);
    setDrag({ x: 0, y: 0 });
    setTouchStartX(null);
    setPinchStart(null);
  };

  const nextPhoto = () => {
    if (isSchedulePhoto || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % clubImages.length));
    setZoom(1);
    setDrag({ x: 0, y: 0 });
  };

  const prevPhoto = () => {
    if (isSchedulePhoto || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + clubImages.length) % clubImages.length));
    setZoom(1);
    setDrag({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
        setCallModal(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="relative overflow-x-hidden bg-carbon text-soft">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-texture" />

      <section className="section-shell relative pt-12 md:pt-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-card hero-bg relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-16">
          <motion.div initial={{ opacity: 0.35, x: -24 }} animate={{ opacity: 0.55, x: 18 }} transition={{ duration: 6.5, repeat: Infinity, repeatType: 'mirror' }} className="hero-orb-left absolute -left-24 top-0 h-80 w-80 rounded-full" />
          <motion.div initial={{ opacity: 0.3, x: 28 }} animate={{ opacity: 0.5, x: -14 }} transition={{ duration: 7.2, repeat: Infinity, repeatType: 'mirror' }} className="hero-orb-right absolute -right-24 bottom-2 h-80 w-80 rounded-full" />
          <div className="hero-grain absolute inset-0" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1.1 }} className="absolute left-0 top-8 h-px w-52 bg-gradient-to-r from-transparent via-lime to-transparent" />
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-lime/90">Сарапул • Первомайская 34</p>
          <h1 className="text-[2.55rem] font-black uppercase leading-[0.84] tracking-[0.2em] text-white md:text-[6.4rem] md:tracking-[0.28em]">ЭНЕРДЖИ</h1>
          <p className="mt-2 text-lg tracking-[0.23em] text-soft/85 md:text-2xl">фитнес-клуб</p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-7 text-2xl font-semibold text-white md:text-4xl">Энергия движения. Сила результата.</motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-4 max-w-3xl text-sm leading-relaxed text-soft/85 md:text-base">Современный фитнес-клуб с сильным ритмом тренировок, удобным расписанием и атмосферой, где хочется возвращаться к результату каждую неделю.</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap gap-4">
            <a href="#schedule" className="brand-button">Смотреть расписание</a>
            <button onClick={() => setCallModal(true)} className="ghost-button">Позвонить</button>
          </motion.div>
        </motion.div>
      </section>

      <section className="section-shell pt-12 md:pt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white md:text-3xl">Атмосфера клуба</h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:gap-6">
          {clubImages.map((photo, i) => (
            <motion.button key={photo.src} type="button" onClick={() => { setLightboxIndex(i); setIsSchedulePhoto(false); }} whileHover={{ y: -4 }} transition={{ duration: 0.24 }} className="group relative h-[260px] min-w-[83%] snap-center overflow-hidden rounded-2xl border border-white/10 bg-charcoal text-left md:h-[360px] md:min-w-[46%]">
              <img src={toRenderableImage(photo.src)} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.03]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/30 to-transparent" />
              <div className="absolute inset-0 transition duration-500 group-hover:bg-lime/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm text-soft/90">Фото клуба #{i + 1}</p>
                <p className="text-xs text-lime/80">{photo.badge}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Групповые программы</h2>
        <p className="mt-2 max-w-2xl text-soft/75">Сильная сетка направлений без перегруженных описаний — только понятная и современная навигация по программам.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {programCategories.map((category) => (
            <motion.article key={category.title} whileHover={{ y: -4 }} transition={{ duration: 0.24 }} className="glass-card rounded-2xl p-5 shadow-card transition duration-300">
              <h3 className="mb-4 text-lg font-semibold text-lime">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-soft/90 transition hover:border-lime/40 hover:bg-lime/10">{item}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="schedule" className="section-shell pt-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Расписание тренировок</h2>
        <p className="mt-2 max-w-3xl text-soft/75">Выберите день и соберите свой темп недели. Всё сделано быстро: сетка занятий перед вами, а полное фото расписания открывается мгновенно в один клик.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-5 flex flex-wrap gap-2">
              {scheduleByDay.map((day) => (
                <button key={day.day} onClick={() => setActiveDay(day.day)} className={`rounded-full px-4 py-2 text-sm transition ${activeDay === day.day ? 'bg-lime text-carbon' : 'bg-white/5 text-soft hover:bg-white/10'}`}>{day.day}</button>
              ))}
            </div>
            <ul className="space-y-2">
              {selectedDay.classes.map((line) => (
                <li key={line} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-soft/90 transition hover:border-lime/25 hover:bg-white/[0.05]">{line}</li>
              ))}
            </ul>
          </div>

          <motion.button type="button" onClick={() => { setIsSchedulePhoto(true); setLightboxIndex(null); }} whileHover={{ y: -4 }} transition={{ duration: 0.24 }} className="glass-card schedule-preview relative overflow-hidden rounded-2xl p-6 text-left shadow-card">
            <div className="absolute inset-0" />
            <p className="relative text-xs uppercase tracking-[0.22em] text-lime">Официальная сетка</p>
            <h3 className="relative mt-3 text-2xl font-semibold text-white">Открыть полное расписание</h3>
            <p className="relative mt-2 text-sm text-soft/80">Полный кадр без обрезки, удобный просмотр и быстрый возврат к странице.</p>
          </motion.button>
        </div>
      </section>


      <section className="section-shell pt-16">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">О клубе</h2>
          <p className="mt-3 max-w-4xl text-soft/80">«Энерджи фитнес-клуб» — пространство для тех, кто выбирает движение, силу и стабильный прогресс. Современный формат тренировок, удобное расписание и яркая спортивная атмосфера объединены в одном ритме.</p>
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
              <button type="button" onClick={() => setCallModal(true)} className="mt-5 inline-flex text-sm text-lime underline underline-offset-4">Позвонить для записи</button>
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
              <div className="grid gap-2">
                {phones.map((phone) => (
                  <a key={phone.href} className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-3 py-3 transition hover:border-lime/40 hover:bg-lime/10" href={phone.href}>
                    <span className="text-soft/70">{phone.label}</span>
                    <span className="font-semibold text-white transition group-hover:translate-x-0.5">{phone.display}</span>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a className="brand-button" href="https://yandex.ru/maps/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034" target="_blank" rel="noreferrer">Построить маршрут</a>
                <button type="button" onClick={() => setCallModal(true)} className="ghost-button">Позвонить</button>
              </div>
            </div>
            <iframe title="Карта фитнес-клуба" src="https://yandex.ru/map-widget/v1/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034&z=16" className="h-64 w-full rounded-2xl border border-white/15" loading="lazy" />
          </div>
        </div>
      </section>

      <button type="button" onClick={() => setCallModal(true)} className="fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-lime text-carbon shadow-lime md:hidden" aria-label="Позвонить в клуб">☎</button>

      <AnimatePresence>
        {callModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center" onClick={() => setCallModal(false)}>
            <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }} transition={{ duration: 0.24 }} className="glass-card w-full max-w-md rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-lime">Связь с клубом</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Выберите номер для звонка</h3>
                </div>
                <button onClick={() => setCallModal(false)} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white">Закрыть</button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 md:p-6" onClick={closeLightbox}>
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative flex max-h-[95vh] w-full max-w-7xl items-center justify-center rounded-2xl border border-white/10 bg-charcoal/75 p-2" onClick={(e) => e.stopPropagation()}>
              {!isSchedulePhoto && (
                <>
                  <button onClick={prevPhoto} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-carbon/70 px-3 py-2 text-white">←</button>
                  <button onClick={nextPhoto} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-carbon/70 px-3 py-2 text-white">→</button>
                </>
              )}
              <button onClick={closeLightbox} className="absolute right-3 top-3 z-10 rounded-full border border-white/25 bg-carbon/80 px-3 py-1 text-xs text-white">Закрыть</button>
              <div
                className="relative flex h-[90vh] w-full items-center justify-center overflow-hidden rounded-xl"
                onTouchStart={(e) => {
                  if (e.touches.length === 1) setTouchStartX(e.touches[0].clientX);
                  if (e.touches.length === 2) {
                    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    setPinchStart(d);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2 && pinchStart) {
                    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    const nextZoom = Math.min(3, Math.max(1, (d / pinchStart) * zoom));
                    setZoom(nextZoom);
                    setPinchStart(d);
                    return;
                  }
                  if (e.touches.length === 1 && touchStartX !== null && zoom <= 1.05 && !isSchedulePhoto) {
                    const delta = e.touches[0].clientX - touchStartX;
                    if (delta > 70) {
                      prevPhoto();
                      setTouchStartX(e.touches[0].clientX);
                    } else if (delta < -70) {
                      nextPhoto();
                      setTouchStartX(e.touches[0].clientX);
                    }
                  }
                }}
                onTouchEnd={() => {
                  setTouchStartX(null);
                  setPinchStart(null);
                  if (zoom < 1.02) {
                    setZoom(1);
                    setDrag({ x: 0, y: 0 });
                  }
                }}
              >
                <img
                  src={toRenderableImage(currentPhoto.src)}
                  alt={currentPhoto.alt}
                  className="max-h-[88vh] max-w-full object-contain transition-transform duration-200"
                  style={{ transform: `translate(${drag.x}px, ${drag.y}px) scale(${zoom})` }}
                  draggable={false}
                  onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
                  onMouseMove={(e) => {
                    if (zoom <= 1.05) return;
                    const rect = (e.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * -30;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
                    setDrag({ x, y });
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
