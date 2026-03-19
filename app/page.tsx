'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type DaySchedule = { day: string; classes: string[] };

const defaultClubImages = Array.from({ length: 12 }, (_, i) => `/images/club-atmosphere/club-${i + 1}.svg`);
const defaultScheduleImages = ['/images/schedule/schedule-main.svg'];
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

const programDetails: Record<string, string> = {
  АБТ: 'Силовой класс для проработки всех групп мышц (работа с инвентарем), помогает развить мышечную силу, улучшает рельеф.',
  '90/60/90': 'Силовой урок направленный на развитие выносливости мышц живота, ягодиц, груди.',
  АБЛ: 'Силовой урок для тренировки нижней части тела и брюшного пресса.',
  'БЕДРА “-”': 'Смешанный формат тренировки (1 часть – аэробная или танцевальная, 2 часть – силовая на ноги, бедра, ягодицы).',
  'СУПЕР ПРЕСС': 'Силовой урок для тренировки мышц брюшного пресса (работа с инвентарем).',
  'АНТИЦЕЛ. ТРЕНИНГ': 'Силовой урок для всех основных мышечных групп с акцентом на мышцы бедер, ягодиц и пресса. Способствует уменьшению жировой прослойки и коррекции проблемных зон.',
  'МОЩНЫЙ КЛАСС': 'Силовая программа на все группы мышц (работа с инвентарем).',
  'Функциональный тренинг': 'Силовая тренировка, построенная на движениях из жизни, позволяет задействовать максимальное количество мышечных групп.',
  'СКУЛЬПТОР ТЕЛА': 'Целостная программа низко-ударной тренировки с использованием штанги, направлена на коррекцию фигуры и укрепление мышц. Рекомендована с 17 лет и при высоком уровне подготовленности.',
  'СИЛОВАЯ С ПЕТЛЯМИ': 'Функциональная тренировка с использованием подвесных петель. Развивает гибкость, координацию, равновесие.',
  ДЖАМПИНГ: 'Силовая + аэробная кардио-тренировка на специальных шестиугольных батутах.',
  КРУГОВАЯ: 'Круговая тренировка, поочередное выполнение нескольких упражнений по кругу за определенный промежуток времени с минимальным отдыхом.',
  'Смешанный тренинг': 'Включает различные танцевальные стили, базовую степ-аэробику и силовой класс.',
  Фитбол: 'Урок с использованием специальных мячей. Направлен на развитие гибкости, координации и исправление осанки.',
  'Степ 1': 'Урок для начинающих, состоящий из двух частей: степ-аэробика и силовая часть.',
  ЗУМБА: 'Танцевальная фитнес-программа, которая подойдет каждому. Сочетает аэробные упражнения и танцевальные элементы.'
};

const clubHours = [
  { label: 'Пн – Чт', value: 'с 07:00 до 21:00' },
  { label: 'Пт', value: 'с 07:00 до 20:45' },
  { label: 'Сб – Вс', value: 'с 09:00 до 17:45' }
];

const heroTitleLetters = Array.from('ЭНЕРДЖИ');
const easeOut = [0.22, 1, 0.36, 1] as const;
const sectionReveal = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut }
  }
} as const;
const staggerReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
} as const;
const itemReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut }
  }
} as const;
const modalOverlayTransition = { duration: 0.26, ease: easeOut } as const;
const modalPanelTransition = { duration: 0.28, ease: easeOut } as const;
const ctaMotion = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { scale: 0.985 }
} as const;

function ModalCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-carbon/75 text-soft backdrop-blur transition hover:border-lime/40 hover:bg-lime/10 hover:text-white"
      aria-label="Закрыть"
      whileHover={{ scale: 1.04, rotate: 90 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.22, ease: easeOut }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}


const tariffs = [
  {
    title: 'Недельный',
    description:
      'Подходит для первого знакомства с клубом, возвращения в тренировочный ритм или короткого интенсивного периода занятий. Удобный формат, чтобы оценить пространство клуба, атмосферу и расписание групповых программ.',
    perks: ['удобный короткий формат', 'доступ к тренировочным зонам', 'возможность попробовать клуб в деле']
  },
  {
    title: 'Месячный',
    description:
      'Оптимальный вариант для стабильных тренировок и уверенного прогресса. Подходит тем, кто хочет заниматься регулярно, пользоваться залом и включить тренировки в привычный ритм жизни.',
    perks: ['комфортный формат на каждый день', 'регулярные тренировки и прогресс', 'удобное решение для постоянного посещения'],
    featured: true
  },
  {
    title: 'Годовой',
    description:
      'Максимально выгодный формат для тех, кто настроен на долгосрочный результат. Позволяет тренироваться системно, не выпадать из режима и чувствовать себя частью пространства клуба на постоянной основе.',
    perks: ['лучший вариант на длительный срок', 'стабильность и системный результат', 'выгодный формат для постоянных тренировок']
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
  const [lightboxMode, setLightboxMode] = useState<'gallery' | 'schedule' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pinchStart, setPinchStart] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [clubImages, setClubImages] = useState<string[]>(defaultClubImages);
  const [scheduleImages, setScheduleImages] = useState<string[]>(defaultScheduleImages);
  const [selectedProgram, setSelectedProgram] = useState(programCategories[0].items[0]);

  const selectedDay = useMemo(() => scheduleByDay.find((d) => d.day === activeDay) ?? scheduleByDay[0], [activeDay]);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCallModal(false);
        closeLightbox();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [clubRes, scheduleRes] = await Promise.all([
          fetch('/api/media?type=club-atmosphere'),
          fetch('/api/media?type=schedule')
        ]);

        if (clubRes.ok) {
          const clubData: { files?: string[] } = await clubRes.json();
          if (clubData.files?.length) {
            setClubImages(clubData.files);
          }
        }

        if (scheduleRes.ok) {
          const scheduleData: { files?: string[] } = await scheduleRes.json();
          if (scheduleData.files?.length) {
            setScheduleImages(scheduleData.files);
          }
        }
      } catch {
        // keep default images if media discovery is unavailable
      }
    };

    loadImages();
  }, []);

  const lightboxImages = lightboxMode === 'schedule' ? scheduleImages : clubImages;
  const currentPhoto = lightboxMode ? lightboxImages[lightboxIndex ?? 0] : null;
  const selectedProgramCategory =
    programCategories.find((category) => category.items.includes(selectedProgram))?.title ?? programCategories[0].title;

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
          <motion.div variants={staggerReveal} initial="hidden" animate="visible" className="relative max-w-5xl px-1 py-12 md:px-2 md:py-16">
            <motion.p variants={itemReveal} className="mb-2 text-xs uppercase tracking-[0.4em] text-lime/90">
              Сарапул • Первомайская 34
            </motion.p>
            <div className="relative overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 0.28, x: 0 }}
                transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
                className="absolute inset-y-[14%] left-0 w-[58%] -skew-x-[28deg] bg-lime/10 blur-2xl"
              />
              <h1 className="relative flex flex-wrap text-[2.55rem] font-black uppercase leading-[0.84] tracking-[0.2em] text-white md:text-[6.4rem] md:tracking-[0.28em]">
                {heroTitleLetters.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    initial={{ opacity: 0, y: 48, clipPath: 'inset(100% 0% 0% 0%)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                    transition={{ duration: 0.65, delay: 0.22 + index * 0.055, ease: easeOut }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </div>
            <motion.p variants={itemReveal} className="mt-2 text-lg tracking-[0.23em] text-soft/85 md:text-2xl">
              фитнес-клуб
            </motion.p>
            <motion.p variants={itemReveal} className="mt-7 text-2xl font-semibold text-white md:text-4xl">
              Энергия движения. Сила результата.
            </motion.p>
            <motion.p variants={itemReveal} className="mt-4 max-w-3xl text-sm leading-relaxed text-soft/85 md:text-base">
              Современный фитнес-клуб с сильным ритмом тренировок, удобным расписанием и атмосферой, где хочется возвращаться к результату каждую неделю.
            </motion.p>
            <motion.div variants={itemReveal} className="mt-8 flex flex-wrap gap-4">
              <motion.button
                type="button"
                className="brand-button premium-transition"
                onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                {...ctaMotion}
                transition={{ duration: 0.22, ease: easeOut }}
              >
                Смотреть расписание
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setCallModal(true)}
                className="ghost-button premium-transition"
                {...ctaMotion}
                transition={{ duration: 0.22, ease: easeOut }}
              >
                Позвонить
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section className="section-shell section-accent pt-12 md:pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <h2 className="mb-5 text-2xl font-semibold text-white md:text-3xl">Залы и атмосфера</h2>
        <motion.div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:gap-6" variants={staggerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {clubImages.map((src, i) => (
            <motion.button
              key={src}
              type="button"
              onClick={() => openGallery(i)}
              variants={itemReveal}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="group relative h-[260px] min-w-[83%] snap-center overflow-hidden rounded-2xl border border-white/10 bg-charcoal text-left md:h-[360px] md:min-w-[46%]"
            >
              <motion.img src={src} alt="Атмосфера клуба" className="absolute inset-0 h-full w-full object-cover" loading="lazy" whileHover={{ scale: 1.035 }} transition={{ duration: 0.45, ease: easeOut }} />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-carbon/20 via-transparent to-white/[0.03]" whileHover={{ opacity: 0.55 }} transition={{ duration: 0.28 }} />
            </motion.button>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Групповые программы</h2>
        <p className="mt-2 max-w-2xl text-soft/75">Сильная сетка направлений без перегруженных описаний — только понятная и современная навигация по программам.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {programCategories.map((category) => (
            <motion.article key={category.title} whileHover={{ y: -4 }} transition={{ duration: 0.24 }} className="glass-card rounded-2xl p-5 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-lime">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => setSelectedProgram(item)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      selectedProgram === item ? 'border-lime/60 bg-lime/15 text-white' : 'border-white/15 bg-white/5 text-soft/90 hover:border-lime/40 hover:bg-lime/10'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            key={selectedProgram}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
            className="glass-card mt-6 rounded-3xl border border-lime/20 p-5 shadow-card md:p-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-lime">{selectedProgramCategory}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{selectedProgram}</h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-soft/75">
                Нажмите на любую программу, чтобы посмотреть описание
              </div>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-soft/85 md:text-base">{programDetails[selectedProgram]}</p>
          </motion.article>
        </AnimatePresence>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Тарифы</h2>
        <p className="mt-2 max-w-3xl text-soft/75">Выберите удобный формат посещения и держите тренировочный ритм в том темпе, который подходит именно вам.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tariffs.map((tariff) => (
            <motion.article
              key={tariff.title}
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.24, ease: easeOut }}
              className={`rounded-2xl p-5 shadow-card premium-transition ${tariff.featured ? 'glass-card border-lime/40 bg-lime/10' : 'glass-card'}`}
            >
              <h3 className={`text-xl font-semibold ${tariff.featured ? 'text-lime' : 'text-white'}`}>{tariff.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft/85">{tariff.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-soft/85">
                {tariff.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-lime" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </motion.section>


      <motion.section id="schedule" className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Расписание тренировок</h2>
        <p className="mt-2 max-w-3xl text-soft/75">Выберите день и задайте темп недели. Полное фото расписания открывается мягко и сразу, без лишних шагов.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-5 flex flex-wrap gap-2">
              {scheduleByDay.map((day) => (
                <button key={day.day} onClick={() => setActiveDay(day.day)} className="relative rounded-full px-4 py-2 text-sm text-soft transition">
                  {activeDay === day.day && (
                    <motion.span
                      layoutId="active-day-pill"
                      className="absolute inset-0 rounded-full bg-lime"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className={`relative z-10 ${activeDay === day.day ? 'text-carbon' : 'text-soft'}`}>{day.day}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.ul key={selectedDay.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22, ease: easeOut }} className="space-y-2">
                {selectedDay.classes.map((line, index) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.04, ease: easeOut }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-soft/90 transition hover:border-lime/25 hover:bg-white/[0.05]"
                  >
                    {line}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <motion.button type="button" onClick={openSchedule} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.25, ease: easeOut }} className="glass-card schedule-preview premium-transition rounded-2xl p-6 text-left shadow-card">
            <p className="text-xs uppercase tracking-[0.22em] text-lime">Официальная сетка</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Открыть полное расписание</h3>
            <p className="mt-2 text-sm text-soft/80">Четкий просмотр фото в фирменном lightbox, с плавным открытием и удобным закрытием.</p>
          </motion.button>
        </div>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
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
      </motion.section>

      <motion.section className="section-shell section-accent py-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
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
                <motion.a className="brand-button" href="https://yandex.ru/maps/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034" target="_blank" rel="noreferrer" {...ctaMotion} transition={{ duration: 0.22, ease: easeOut }}>
                  Построить маршрут
                </motion.a>
                <motion.button type="button" onClick={() => setCallModal(true)} className="ghost-button premium-transition" {...ctaMotion} transition={{ duration: 0.22, ease: easeOut }}>
                  Позвонить
                </motion.button>
              </div>
              <div className="rounded-2xl border border-lime/20 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-lime">Время работы клуба</p>
                <div className="mt-4 space-y-3">
                  {clubHours.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-white">{item.label}</span>
                      <span className="text-soft/80">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-2xl border border-lime/20 bg-lime/10 px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-lime">
                  Клиенты покидают клуб за 15 минут до закрытия
                </p>
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
      </motion.section>

      {mounted &&
        createPortal(
          <motion.button
            type="button"
            onClick={() => setCallModal(true)}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[120] inline-flex h-12 w-12 items-center justify-center rounded-full border border-lime/50 bg-lime text-carbon shadow-lime pointer-events-auto md:hidden"
            aria-label="Позвонить в клуб"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.24, ease: easeOut }}
          >
            ☎
          </motion.button>,
          document.body
        )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {callModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={modalOverlayTransition} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" onClick={() => setCallModal(false)}>
                <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={modalPanelTransition} className="glass-card w-full max-w-sm rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-lime">Связь с клубом</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">Выберите номер для звонка</h3>
                    </div>
                    <ModalCloseButton onClick={() => setCallModal(false)} />
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
          </AnimatePresence>,
          document.body
        )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {currentPhoto && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={modalOverlayTransition} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-3 md:p-6" onClick={closeLightbox}>
                <motion.div initial={{ scale: 0.965, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0, y: 8 }} transition={modalPanelTransition} className="relative flex max-h-[95vh] w-full max-w-7xl items-center justify-center rounded-2xl border border-white/10 bg-charcoal/80 p-2" onClick={(e) => e.stopPropagation()}>
              {lightboxMode === 'gallery' && (
                <>
                  <motion.button onClick={prev} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-carbon/70 px-3 py-2 text-white">
                    ←
                  </motion.button>
                  <motion.button onClick={next} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-carbon/70 px-3 py-2 text-white">
                    →
                  </motion.button>
                </>
              )}
              <div className="absolute right-3 top-3 z-10">
                <ModalCloseButton onClick={closeLightbox} />
              </div>
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
          </AnimatePresence>,
          document.body
        )}
    </main>
  );
}
