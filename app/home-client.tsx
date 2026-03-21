'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type DaySchedule = { day: string; classes: string[] };
type HomeClientProps = {
  initialClubImages: string[];
  initialScheduleImages: string[];
};

const phones = [
  { label: 'Телефон клуба', display: '8-904-31-444-31', href: 'tel:+79043144431' },
  { label: 'Телефон клуба', display: '8-912-456-62-56', href: 'tel:+79124566256' }
];

const programCategories = [
  {
    title: 'Силовые программы',
    items: ['АБТ', '90/60/90', 'АБЛ', 'БЕДРА', 'СУПЕР ПРЕСС', 'АНТИЦЕЛ. ТРЕНИНГ', 'МОЩНЫЙ КЛАСС', 'Функциональный тренинг', 'СКУЛЬПТОР ТЕЛА', 'СИЛОВАЯ С ПЕТЛЯМИ', 'ДЖАМПИНГ', 'КРУГОВАЯ']
  },
  { title: 'Аэробные программы', items: ['Смешанный тренинг', 'Фитбол', 'Степ 1'] },
  { title: 'Танцевальные программы', items: ['ЗУМБА'] }
];

const programDetails: Record<string, string> = {
  АБТ: 'Силовой класс для проработки всех групп мышц (работа с инвентарем), помогает развить мышечную силу, улучшает рельеф.',
  '90/60/90': 'Силовой урок направленный на развитие выносливости мышц живота, ягодиц, груди.',
  АБЛ: 'Силовой урок для тренировки нижней части тела и брюшного пресса.',
  'БЕДРА': 'Смешанный формат тренировки (1 часть – аэробная или танцевальная, 2 часть – силовая на ноги, бедра, ягодицы).',
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

const programCategoryHighlights: Record<string, string> = {
  'Силовые программы': 'Акцент на мышечную силу, выносливость и чистую технику движения в насыщенном темпе групповой тренировки.',
  'Аэробные программы': 'Ровный кардио-ритм, работа с координацией и легкая динамика, которую комфортно встроить в регулярный режим.',
  'Танцевальные программы': 'Энергичный формат с музыкальной подачей, драйвом движения и заметной эмоциональной отдачей от занятия.'
};

const programCategoryTags: Record<string, string[]> = {
  'Силовые программы': ['Сила', 'Выносливость', 'Рельеф'],
  'Аэробные программы': ['Кардио', 'Ритм', 'Координация'],
  'Танцевальные программы': ['Драйв', 'Пластика', 'Энергия']
};

const clubHours = [
  { label: 'Пн – Чт', value: 'с 07:00 до 21:00' },
  { label: 'Пт', value: 'с 07:00 до 20:45' },
  { label: 'Сб – Вс', value: 'с 09:00 до 17:45' }
];

const heroTitleLetters = Array.from('ЭНЕРДЖИ');
const heroLetterSpacingAdjustments = ['0.024em', '0.01em', '0.012em', '0.022em', '0.008em', '0.024em', '0em'] as const;
const easeOut = [0.22, 1, 0.36, 1] as const;
const sectionReveal = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.88, ease: easeOut }
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
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: easeOut }
  }
} as const;
const softPanelReveal = {
  hidden: { opacity: 0, y: 16, scale: 0.994 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.64, ease: easeOut }
  }
} as const;
const modalOverlayTransition = { duration: 0.32, ease: easeOut } as const;
const modalPanelTransition = { duration: 0.36, ease: easeOut } as const;
const lightboxOverlayTransition = { duration: 0.38, ease: easeOut } as const;
const lightboxPanelTransition = { duration: 0.42, ease: easeOut } as const;
const lightboxImageTransition = { duration: 0.46, ease: easeOut } as const;
const ctaMotion = {
  whileHover: { y: -1.5, scale: 1.006 },
  whileTap: { scale: 0.988 }
} as const;

function ModalCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-carbon/75 text-soft backdrop-blur-xl transition hover:border-lime/35 hover:bg-white/[0.08] hover:text-white"
      aria-label="Закрыть"
      whileHover={{ scale: 1.035, rotate: 90 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.22, ease: easeOut }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

function ProgramPanelCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-soft/85 backdrop-blur-xl transition-colors duration-300 hover:border-lime/35 hover:bg-lime/[0.08] hover:text-white"
      aria-label="Закрыть карточку программы"
      whileHover={{ scale: 1.03, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.24, ease: easeOut }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(191,255,0,0.14),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="relative h-4 w-4">
        <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

function LightboxArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.018 }}
      whileTap={{ scale: 0.972 }}
      transition={{ duration: 0.22, ease: easeOut }}
      className={`group absolute top-[calc(50%-1.5rem)] z-10 inline-flex h-12 w-12 items-center justify-center rounded-full outline-none ${
        isPrev ? 'left-3 md:left-4' : 'right-3 md:right-4'
      }`}
      aria-label={isPrev ? 'Предыдущее фото' : 'Следующее фото'}
    >
      <span className="absolute inset-0 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(33,33,31,0.84),rgba(24,24,22,0.78))] shadow-[0_14px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 group-hover:border-lime/24 group-hover:bg-[linear-gradient(180deg,rgba(38,38,35,0.88),rgba(26,26,24,0.8))] group-hover:shadow-[0_18px_34px_rgba(0,0,0,0.34)] group-focus-visible:border-lime/34" />
      <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(191,255,0,0.09),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="relative z-10 h-[14px] w-[14px] text-soft/92 transition-colors duration-300 group-hover:text-white">
        <path
          d={isPrev ? 'M14.25 5.75L8.75 12L14.25 18.25' : 'M9.75 5.75L15.25 12L9.75 18.25'}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.55"
        />
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

export default function HomeClient({ initialClubImages, initialScheduleImages }: HomeClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeDay, setActiveDay] = useState('Пн');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [callModal, setCallModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxMode, setLightboxMode] = useState<'gallery' | 'schedule' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pinchStart, setPinchStart] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [programPanelOpen, setProgramPanelOpen] = useState(false);
  const [clubImages] = useState<string[]>(initialClubImages);
  const [scheduleImages] = useState<string[]>(initialScheduleImages.slice(0, 1));
  const [selectedProgram, setSelectedProgram] = useState(programCategories[0].items[0]);
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const galleryResumeAtRef = useRef(0);
  const galleryLastFrameTimeRef = useRef<number | null>(null);
  const galleryScrollCarryRef = useRef(0);
    const isGalleryInteractingRef = useRef(false);

  const pauseGalleryAutoplay = (delay = 1800) => {
    galleryResumeAtRef.current = performance.now() + delay;
  };

  const selectedDay = useMemo(() => scheduleByDay.find((d) => d.day === activeDay) ?? scheduleByDay[0], [activeDay]);
  const galleryLoopImages = useMemo(() => (clubImages.length > 1 ? [...clubImages, ...clubImages] : clubImages), [clubImages]);
  const lightboxImages = lightboxMode === 'schedule' ? scheduleImages : clubImages;
  const currentPhoto = lightboxMode ? lightboxImages[lightboxIndex ?? 0] : null;
  const isAnyOverlayOpen = mounted && (callModal || programPanelOpen || currentPhoto !== null);
  const selectedProgramCategory =
    programCategories.find((category) => category.items.includes(selectedProgram))?.title ?? programCategories[0].title;
  const selectedProgramTags = programCategoryTags[selectedProgramCategory] ?? ['Энергия', 'Фокус', 'Групповой формат'];
  const selectedProgramHighlight =
    programCategoryHighlights[selectedProgramCategory] ?? 'Групповая тренировка с уверенным ритмом, продуманной подачей и вниманием к качеству движения.';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    if (isAnyOverlayOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isAnyOverlayOpen, mounted]);

  const closeLightbox = () => {
    setLightboxMode(null);
    setLightboxIndex(null);
    setZoom(1);
    setTouchStartX(null);
    setPinchStart(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCallModal(false);
        setProgramPanelOpen(false);
        closeLightbox();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const viewport = galleryViewportRef.current;
    if (!viewport || clubImages.length <= 1 || shouldReduceMotion) return;

    viewport.scrollLeft = 0;

    const isPaused = (timestamp: number) =>
      isGalleryInteractingRef.current || timestamp < galleryResumeAtRef.current;

    let animationFrame = 0;
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
    const pixelsPerSecond = isMobileViewport ? 27 : 31;
    galleryLastFrameTimeRef.current = null;
    galleryScrollCarryRef.current = 0;

    const tick = (timestamp: number) => {
      const segmentWidth = viewport.scrollWidth / 2;
      const lastFrameTime = galleryLastFrameTimeRef.current ?? timestamp;
      const delta = Math.min(timestamp - lastFrameTime, isMobileViewport ? 24 : 32);
      galleryLastFrameTimeRef.current = timestamp;

      if (!isPaused(timestamp) && segmentWidth > 0) {
        const rawStep = galleryScrollCarryRef.current + (pixelsPerSecond * delta) / 1000;
        const appliedStep = rawStep >= 1 ? Math.floor(rawStep) : 0;
        galleryScrollCarryRef.current = rawStep - appliedStep;

        if (appliedStep > 0) {
          viewport.scrollLeft += appliedStep;
        }

        if (viewport.scrollLeft >= segmentWidth) {
          viewport.scrollLeft -= segmentWidth;
        }
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      galleryLastFrameTimeRef.current = null;
      galleryScrollCarryRef.current = 0;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [clubImages.length, shouldReduceMotion]);

  const openGallery = (index: number) => {
    galleryResumeAtRef.current = performance.now() + 2200;
    setLightboxMode('gallery');
    setLightboxIndex(index);
    setZoom(1);
  };

  const openSchedule = () => {
    if (!scheduleImages.length) return;
    setLightboxMode('schedule');
    setLightboxIndex(0);
    setZoom(1);
  };

  const closeProgramPanel = () => {
    setProgramPanelOpen(false);
  };

  const next = () => {
    if (lightboxMode !== 'gallery' || lightboxIndex === null || clubImages.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % clubImages.length);
    setZoom(1);
  };

  const prev = () => {
    if (lightboxMode !== 'gallery' || lightboxIndex === null || clubImages.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + clubImages.length) % clubImages.length);
    setZoom(1);
  };

  const openProgramPanel = (program: string) => {
    setSelectedProgram(program);
    setProgramPanelOpen(true);
  };

  return (
    <main className="site-bg relative bg-carbon text-soft">
      <section className="hero-backdrop section-accent hero-scene relative min-h-[39rem] pt-12 pb-11 md:min-h-[41rem] md:pt-16 md:pb-14">
        <motion.div
          initial={{ opacity: 0.38, x: -22, y: -6 }}
          animate={{ opacity: shouldReduceMotion ? 0.54 : 0.78, x: shouldReduceMotion ? 0 : 22, y: shouldReduceMotion ? 0 : 6 }}
          transition={{ duration: 10, repeat: shouldReduceMotion ? 0 : Infinity, repeatType: 'mirror' }}
          className="hero-slash hero-slash-a"
        />
        <motion.div
          initial={{ opacity: 0.3, x: 18, y: 8 }}
          animate={{ opacity: shouldReduceMotion ? 0.48 : 0.68, x: shouldReduceMotion ? 0 : -16, y: shouldReduceMotion ? 0 : -6 }}
          transition={{ duration: 11, repeat: shouldReduceMotion ? 0 : Infinity, repeatType: 'mirror' }}
          className="hero-slash hero-slash-b"
        />
        <motion.div
          initial={{ opacity: 0, x: -34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.95, delay: 0.08, ease: easeOut }}
          className="pointer-events-none absolute left-0 top-[18%] hidden h-px w-[22vw] max-w-[18rem] bg-gradient-to-r from-transparent via-lime/55 to-transparent md:block"
        />
        <motion.div
          initial={{ opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.05, delay: 0.16, ease: easeOut }}
          className="pointer-events-none absolute bottom-[14%] right-0 hidden h-px w-[26vw] max-w-[22rem] bg-gradient-to-l from-transparent via-white/18 to-transparent md:block"
        />

        <div className="section-shell relative z-10 overflow-visible">
          <motion.div variants={staggerReveal} initial="hidden" animate="visible" className="hero-copy-shell relative max-w-[54rem] overflow-visible px-1 pt-[3.35rem] pb-[3.35rem] md:px-2 md:pt-[4.35rem] md:pb-[4rem]">
            <motion.p variants={itemReveal} className="premium-label mb-4 text-xs uppercase tracking-[0.4em] text-lime/90">
              Сарапул • Первомайская 34
            </motion.p>

            <div className="relative overflow-visible">
              <motion.div
                initial={{ opacity: 0, x: -38, scaleX: 0.94 }}
                animate={{ opacity: 0.12, x: 0, scaleX: 1 }}
                transition={{ duration: 1, ease: easeOut, delay: 0.16 }}
                className="absolute inset-y-[18%] left-[8%] w-[36%] -skew-x-[22deg] bg-lime/[0.07] blur-[24px]"
              />
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 0.07, x: 0 }}
                transition={{ duration: 1.05, ease: easeOut, delay: 0.28 }}
                className="absolute inset-y-[30%] right-[11%] w-[14%] -skew-x-[26deg] bg-white/[0.045] blur-[30px]"
              />
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.22, ease: easeOut }}
                className="pointer-events-none absolute left-[9%] top-[20%] h-px w-[16%] bg-gradient-to-r from-lime/52 via-lime/14 to-transparent"
              />
              <h1 className="hero-wordmark premium-display relative inline-flex flex-wrap pb-1.5 text-[2.72rem] font-black uppercase leading-[0.83] tracking-[0.075em] text-white md:pb-2 md:text-[6.85rem] md:leading-[0.85] md:tracking-[0.108em]">
                {heroTitleLetters.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    initial={{ opacity: 0, y: 54, filter: 'blur(10px)', clipPath: 'inset(100% 0% 0% 0%)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0%)' }}
                    transition={{ duration: 0.76, delay: 0.24 + index * 0.06, ease: easeOut }}
                    className="inline-block bg-gradient-to-b from-white via-white to-[#f4f4ef] bg-clip-text text-transparent drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
                    style={{ marginRight: heroLetterSpacingAdjustments[index] }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </div>

            <motion.p variants={itemReveal} className="hero-kicker premium-label mt-[1.15rem] text-[0.76rem] font-medium uppercase tracking-[0.58em] text-soft/56 md:mt-[1.35rem] md:text-[0.95rem] md:tracking-[0.68em]">
              фитнес-клуб
            </motion.p>
            <motion.div variants={itemReveal} className="mt-7 flex items-center gap-3.5 md:mt-8 md:gap-4">
              <span className="h-px w-11 bg-gradient-to-r from-lime/78 via-lime/18 to-transparent md:w-14" />
              <span className="h-1.5 w-1.5 rounded-full bg-lime/78 shadow-[0_0_14px_rgba(200,214,0,0.26)]" />
            </motion.div>
            <motion.h2
              variants={itemReveal}
              className="hero-headline premium-display relative mt-[1.35rem] max-w-[15.8ch] pb-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.042em] text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)] md:mt-[1.45rem] md:max-w-[52rem] md:pb-6 md:text-[3.18rem] md:leading-[1.08] md:whitespace-nowrap md:[word-spacing:0.02em] lg:text-[3.28rem]"
            >
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scaleX: 0.88 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.64, delay: 0.5, ease: easeOut }}
                className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-18 origin-left bg-gradient-to-r from-lime/66 via-lime/14 to-transparent md:w-24"
              />
              <motion.span
                initial={{ opacity: 0, y: 24, filter: 'blur(9px)', clipPath: 'inset(0 0 100% 0)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 0.68, delay: 0.44, ease: easeOut }}
                className="block bg-[linear-gradient(96deg,#ffffff_0%,#f7f7f3_32%,#eef0dd_68%,#f3f3ef_100%)] bg-clip-text text-transparent"
              >
                Энергия движения. Сила результата
              </motion.span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.72, delay: 0.62, ease: easeOut }}
              className="hero-supporting premium-body mt-[1.3rem] max-w-[30rem] text-pretty text-[0.96rem] font-light leading-[1.76] tracking-[0.01em] text-soft/78 md:mt-[1.35rem] md:max-w-[43rem] md:text-[1.01rem] md:leading-[1.82]"
            >
              <span className="md:block">Современный фитнес-клуб с сильным тренировочным ритмом,</span>{' '}
              <span className="md:block">удобным расписанием и атмосферой, где хочется возвращаться к результату каждую неделю.</span>
            </motion.p>
            <motion.div variants={itemReveal} className="mt-10 flex flex-wrap gap-4 md:mt-11">
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
        <h2 className="premium-display mb-5 text-2xl font-semibold tracking-[-0.028em] text-white md:text-3xl">Залы и атмосфера</h2>
        <div className="gallery-rail relative">
          {galleryLoopImages.length > 0 ? (
            <div className="gallery-edge-shell">
              <motion.div
                ref={galleryViewportRef}
                className="-mx-4 flex gap-[0.55rem] overflow-x-auto overflow-y-hidden px-4 pb-4 scrollbar-hidden md:gap-[0.68rem]"
                variants={staggerReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                onPointerDown={() => {
                  isGalleryInteractingRef.current = true;
                  pauseGalleryAutoplay(2600);
                }}
                onPointerUp={() => {
                  isGalleryInteractingRef.current = false;
                  pauseGalleryAutoplay(1800);
                }}
                onPointerCancel={() => {
                  isGalleryInteractingRef.current = false;
                  pauseGalleryAutoplay(1800);
                }}
                onPointerLeave={() => {
                  isGalleryInteractingRef.current = false;
                }}
                onTouchStart={() => {
                  isGalleryInteractingRef.current = true;
                  pauseGalleryAutoplay(3000);
                }}
                onTouchEnd={() => {
                  isGalleryInteractingRef.current = false;
                  pauseGalleryAutoplay(2200);
                }}
                onWheel={() => {
                  pauseGalleryAutoplay(1800);
                }}
                onScroll={() => {
                  if (isGalleryInteractingRef.current) {
                    pauseGalleryAutoplay(1800);
                  }
                }}
              >
                {galleryLoopImages.map((src, i) => (
                  <motion.button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => openGallery(i % clubImages.length)}
                    variants={itemReveal}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.32, ease: easeOut }}
                    className="group relative h-[278px] min-w-[86%] flex-none overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(45,44,39,0.72),rgba(23,22,19,0.96))] p-[1.5px] text-left shadow-[0_0_0_1px_rgba(29,28,24,0.78),0_18px_44px_rgba(0,0,0,0.18)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 md:h-[378px] md:min-w-[48%]"
                  >
                    <div className="absolute inset-px rounded-[1.86rem] bg-[linear-gradient(180deg,rgba(24,23,20,0.74),rgba(14,14,12,0.9))]" />
                    <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-charcoal">
                      <motion.img
                        src={src}
                        alt={`Атмосфера клуба — фото ${i + 1}`}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        loading={i < 3 ? 'eager' : 'lazy'}
                        whileHover={{ scale: 1.035 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/0 opacity-78 transition-opacity duration-400 group-hover:opacity-86" />
                      <div className="absolute inset-0 rounded-[1.65rem] shadow-[inset_0_0_0_1px_rgba(60,58,52,0.18)]" />
                      <div className="pointer-events-none absolute inset-[1px] rounded-[1.58rem] bg-[radial-gradient(circle_at_18%_22%,rgba(200,214,0,0.01),transparent_18%)] opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.12]" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl border border-white/10 px-5 py-12 text-center text-sm text-soft/70">
              Добавьте фотографии клуба в <span className="text-lime">public/images/club-atmosphere/</span>, и они автоматически появятся в галерее.
            </div>
          )}
        </div>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <motion.div variants={staggerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
          <motion.h2 variants={itemReveal} className="premium-display text-2xl font-semibold tracking-[-0.028em] text-white md:text-3xl">
            Групповые программы
          </motion.h2>
        </motion.div>
        <div className="mt-8 grid gap-4 md:mt-9 md:grid-cols-3">
          {programCategories.map((category, categoryIndex) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.74, delay: categoryIndex * 0.06, ease: easeOut }}
              whileHover={{ y: -3 }}
              className="program-card glass-card rounded-[1.85rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.022))] p-[1.5rem] shadow-card md:p-[1.65rem]"
            >
              <h3 className="program-card-title premium-display mb-3.5 text-[1.12rem] font-semibold text-white md:text-[1.18rem]">{category.title}</h3>
              <p className="program-card-copy premium-body mb-[1.35rem] max-w-[24rem] text-[0.92rem] font-light text-soft/74">{programCategoryHighlights[category.title]}</p>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => openProgramPanel(item)}
                    className={`program-card-chip premium-chip rounded-full border px-3.5 py-[0.58rem] text-[0.72rem] font-medium transition ${
                      selectedProgram === item && programPanelOpen
                        ? 'program-card-chip-active'
                        : 'hover:border-lime/28 hover:bg-white/[0.06] hover:text-white'
                    }`}
                    whileHover={{ y: -0.5 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.26, ease: easeOut }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={itemReveal} className="premium-display text-2xl font-semibold tracking-[-0.028em] text-white md:text-3xl">
          Тарифы
        </motion.h2>
        <div className="mt-8 grid gap-4 md:mt-9 md:grid-cols-3">
          {tariffs.map((tariff, index) => (
            <motion.article
              key={tariff.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.76, delay: index * 0.07, ease: easeOut }}
              whileHover={{ y: -4.5, scale: 1.008 }}
              whileTap={{ scale: 0.992 }}
              className={`tariff-card rounded-[2rem] p-[1.5rem] shadow-card premium-transition md:p-[1.65rem] ${
                tariff.featured ? 'tariff-card-featured' : 'tariff-card-standard'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className={`tariff-title premium-display text-[1.32rem] font-semibold ${tariff.featured ? 'text-[#edf2b8]' : 'text-white'}`}>{tariff.title}</h3>
                {tariff.featured && <span className="premium-chip rounded-full border border-[#8e9630]/28 bg-[linear-gradient(180deg,rgba(104,112,34,0.18),rgba(72,78,24,0.1))] px-3.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#dce58d] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">выбор клуба</span>}
              </div>
              <p className="tariff-copy premium-body mt-3.5 max-w-[24rem] text-[0.95rem] font-light text-soft/84">{tariff.description}</p>
              <ul className="tariff-list premium-body mt-5 space-y-2.5 text-[0.92rem] font-light leading-[1.72] text-soft/84">
                {tariff.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[linear-gradient(180deg,rgba(201,212,91,0.92),rgba(140,151,43,0.92))] shadow-[0_0_0_3px_rgba(96,104,31,0.12)]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section id="schedule" className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={itemReveal} className="premium-display text-2xl font-semibold tracking-[-0.028em] text-white md:text-3xl">
          Расписание тренировок
        </motion.h2>
        <div className="mt-8 grid gap-5 md:mt-9 lg:grid-cols-[1.35fr_1fr]">
          <motion.div variants={softPanelReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="schedule-shell glass-card rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-[1.4rem] md:p-[1.6rem]">
            <div className="mb-5 flex flex-wrap gap-2.5">
              {scheduleByDay.map((day) => (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => setActiveDay(day.day)}
                  className="schedule-tab premium-chip relative rounded-full px-4 py-2.5 text-sm text-soft outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/35"
                >
                  {activeDay === day.day && (
                    <motion.span
                      layoutId="active-day-pill"
                      className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(216,230,0,1),rgba(198,214,0,0.94))] shadow-[0_10px_26px_rgba(200,214,0,0.24)]"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className={`schedule-tab-label premium-chip relative z-10 ${activeDay === day.day ? 'text-carbon' : 'text-soft/90'}`}>{day.day}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.ul
                key={selectedDay.day}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.26, ease: easeOut }}
                className="space-y-2"
              >
                {selectedDay.classes.map((line, index) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.04, ease: easeOut }}
                    className="schedule-slot premium-body rounded-[1.15rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.018))] px-4 py-3 text-sm text-soft/90 transition hover:border-lime/22 hover:bg-white/[0.048]"
                  >
                    <span className="schedule-slot-copy block pl-2">{line}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </motion.div>

          <motion.button
            type="button"
            onClick={openSchedule}
            variants={softPanelReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.26, ease: easeOut }}
            className="glass-card schedule-preview premium-transition rounded-[1.9rem] border border-white/10 p-[1.6rem] text-left shadow-card outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          >
            <p className="premium-label text-[0.68rem] uppercase tracking-[0.28em] text-lime/90">Расписание клуба</p>
            <h3 className="schedule-promo-title premium-display mt-3 text-[1.82rem] font-semibold text-white">Открыть полное расписание</h3>
          </motion.button>
        </div>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={itemReveal} className="premium-display text-2xl font-semibold tracking-[-0.028em] text-white md:text-3xl">
          Частые вопросы
        </motion.h2>
        <div className="mt-5 space-y-3">
          {faq.map((entry, index) => (
            <motion.div
              key={entry.q}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.03, ease: easeOut }}
              className="faq-item glass-card rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.038),rgba(255,255,255,0.02))]"
            >
              <button className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left md:px-5.5 md:py-5" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span className="faq-question premium-display text-[1rem] font-medium tracking-[-0.018em] md:text-[1.04rem]">{entry.q}</span>
                <motion.span
                  animate={{ scale: activeFaq === index ? 1.02 : 1 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="faq-indicator inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="faq-indicator-mark h-[1rem] w-[1rem]">
                    <path d="M5.25 10H14.75" />
                    <motion.path
                      d="M10 5.25V14.75"
                      animate={{ opacity: activeFaq === index ? 0 : 1, scaleY: activeFaq === index ? 0.7 : 1 }}
                      transition={{ duration: 0.22, ease: easeOut }}
                      style={{ originX: '50%', originY: '50%' }}
                    />
                  </svg>
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  gridTemplateRows: activeFaq === index ? '1fr' : '0fr',
                  opacity: activeFaq === index ? 1 : 0.68
                }}
                transition={{ duration: 0.34, ease: easeOut }}
                className="faq-answer-wrap grid"
              >
                <div className="overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{
                      y: activeFaq === index ? 0 : -8,
                      opacity: activeFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.28, ease: easeOut }}
                    className="faq-answer premium-body px-5 pb-5 pr-12 text-[0.94rem] font-light md:px-5.5 md:pb-5"
                  >
                    {entry.a}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="section-shell section-accent py-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <motion.div variants={softPanelReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="contact-shell glass-card rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 md:p-8">
          <h2 className="premium-display text-2xl font-semibold tracking-[-0.028em] text-white md:text-3xl">Контакты</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="contact-copy premium-body space-y-3.5 text-sm">
              <p className="contact-address-row text-[0.98rem]">
                <span className="premium-label mr-2 text-[0.72rem] uppercase tracking-[0.24em] text-lime/92">Адрес</span>
                <span className="contact-address-copy premium-display tracking-[-0.015em] text-white">
                  <span className="text-soft/84">Сарапул, </span>
                  <span className="contact-address-highlight">Первомайская 34</span>
                </span>
              </p>
              <div className="grid gap-2.5">
                {phones.map((phone) => (
                  <motion.a
                    key={phone.href}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.995 }}
                    className="contact-link-card group flex items-center justify-between rounded-[1.2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.038),rgba(255,255,255,0.024))] px-4 py-3.5 transition hover:border-lime/28 hover:bg-white/[0.048]"
                    href={phone.href}
                  >
                    <span className="contact-link-label premium-label text-[0.68rem] uppercase">{phone.label}</span>
                    <span className="contact-link-value premium-display text-[1.03rem] font-semibold text-white transition group-hover:translate-x-0.5">{phone.display}</span>
                  </motion.a>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.a
                  className="brand-button"
                  href="https://yandex.ru/maps/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034"
                  target="_blank"
                  rel="noreferrer"
                  {...ctaMotion}
                  transition={{ duration: 0.22, ease: easeOut }}
                >
                  Построить маршрут
                </motion.a>
                <motion.button
                  type="button"
                  onClick={() => setCallModal(true)}
                  className="ghost-button premium-transition"
                  {...ctaMotion}
                  transition={{ duration: 0.22, ease: easeOut }}
                >
                  Позвонить
                </motion.button>
              </div>
              <div className="contact-hours rounded-[1.6rem] border border-lime/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <p className="premium-label text-[0.68rem] uppercase tracking-[0.28em] text-lime/90">Время работы клуба</p>
                <div className="mt-4 space-y-3">
                  {clubHours.map((item) => (
                    <div key={item.label} className="contact-hours-row flex items-center justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                      <span className="premium-display text-[0.98rem] font-medium tracking-[-0.015em] text-white">{item.label}</span>
                      <span className="premium-body text-[0.93rem] text-soft/78">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="contact-hours-note mt-4 rounded-2xl border border-lime/20 bg-[linear-gradient(180deg,rgba(200,214,0,0.14),rgba(200,214,0,0.08))] px-3.5 py-3 text-[0.68rem] font-semibold uppercase text-lime/92">
                  Клиенты покидают клуб за 15 минут до закрытия
                </p>
              </div>
            </div>
            <iframe
              title="Карта фитнес-клуба"
              src="https://yandex.ru/map-widget/v1/?text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BF%D1%83%D0%BB%2C%20%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%2034&z=16"
              className="contact-map-frame h-64 w-full rounded-2xl border border-white/15 bg-charcoal/70"
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.section>

      {mounted &&
        createPortal(
          <motion.button
            type="button"
            onClick={() => setCallModal(true)}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[120] inline-flex h-14 w-14 items-center justify-center rounded-full border border-lime/50 bg-[linear-gradient(145deg,#d8e600,#c8d600)] text-carbon shadow-[0_16px_38px_rgba(200,214,0,0.32)] pointer-events-auto md:hidden"
            aria-label="Позвонить в клуб"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.24, ease: easeOut }}
          >
            <span className="pointer-events-none absolute inset-[1px] rounded-full border border-white/35 opacity-50" />
            <span className="relative text-lg leading-none">☎</span>
          </motion.button>,
          document.body
        )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {programPanelOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="fixed inset-0 z-[88] flex items-start justify-center bg-black/58 p-4 backdrop-blur-[8px] md:items-center"
                onClick={closeProgramPanel}
              >
                <motion.aside
                  initial={{ opacity: 0, y: 24, scale: 0.982 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.988 }}
                  transition={{ duration: 0.38, ease: easeOut }}
                  className="program-panel-shell relative w-full max-w-[48rem] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(43,43,38,0.985),rgba(24,24,22,0.99))] shadow-[0_28px_110px_rgba(0,0,0,0.46)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-lime/95 via-lime/60 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(191,255,0,0.12),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.07),transparent_24%)]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="relative p-[1.5rem] md:p-[2.15rem]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <span className="program-panel-label premium-chip inline-flex items-center rounded-full border border-lime/20 bg-[linear-gradient(180deg,rgba(200,214,0,0.14),rgba(200,214,0,0.08))] px-3.5 py-1.5 text-[0.62rem] font-medium uppercase text-lime/92">
                          {selectedProgramCategory}
                        </span>
                        <p className="program-panel-kicker premium-label text-[0.63rem] uppercase text-soft/52">Программа клуба «Энерджи»</p>
                      </div>
                      <ProgramPanelCloseButton onClick={closeProgramPanel} />
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={selectedProgram}
                        initial={{ opacity: 0, y: 16, scale: 0.994, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, scale: 0.994, filter: 'blur(10px)' }}
                        transition={{ duration: 0.34, ease: easeOut }}
                        className="mt-[2.05rem] grid gap-[1.6rem]"
                      >
                        <div className="max-w-3xl">
                          <h3 className="program-panel-heading premium-display text-[2.08rem] font-semibold text-white md:text-[3.08rem]">{selectedProgram}</h3>
                          <div className="mt-4 h-px w-24 bg-gradient-to-r from-lime via-lime/30 to-transparent" />
                          <p className="program-panel-copy premium-body mt-5 max-w-[38rem] text-[0.99rem] font-light text-soft/84 md:text-[1.04rem]">{programDetails[selectedProgram]}</p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
                          <div className="program-panel-block rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] px-[1.125rem] py-[1.125rem] backdrop-blur-sm">
                            <p className="program-panel-block-title premium-label text-[0.63rem] uppercase text-lime/82">Фокус тренировки</p>
                            <p className="program-panel-copy premium-body mt-3 text-[0.93rem] font-light text-soft/80 md:text-[0.96rem]">{selectedProgramHighlight}</p>
                          </div>
                          <div className="program-panel-block rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-[1.125rem] py-[1.125rem]">
                            <p className="program-panel-block-title premium-label text-[0.63rem] uppercase text-soft/58">Ритм и акценты</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selectedProgramTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="program-panel-chip premium-chip rounded-full border px-3.5 py-1.5 text-[0.68rem] font-medium uppercase text-soft/82"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {callModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={modalOverlayTransition}
                className="fixed inset-0 z-[90] flex items-center justify-center bg-black/72 p-4 backdrop-blur-[6px]"
                onClick={() => setCallModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.968, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.978, y: 8 }}
                  transition={modalPanelTransition}
                  className="glass-card relative w-full max-w-sm overflow-hidden rounded-[1.95rem] border border-white/10 bg-[linear-gradient(180deg,rgba(43,43,38,0.96),rgba(24,24,22,0.985))] p-5 shadow-[0_24px_72px_rgba(0,0,0,0.38)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,214,0,0.06),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_48%)]" />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="premium-label text-xs uppercase tracking-[0.22em] text-lime">Связь с клубом</p>
                        <h3 className="premium-display mt-2 text-xl font-semibold tracking-[-0.026em] text-white">Выберите номер для звонка</h3>
                      </div>
                      <ModalCloseButton onClick={() => setCallModal(false)} />
                    </div>
                    <div className="space-y-2.5">
                      {phones.map((phone) => (
                        <motion.a
                          key={phone.href}
                          href={phone.href}
                          whileHover={{ y: -1.5 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.24, ease: easeOut }}
                          className="group relative flex items-center justify-between overflow-hidden rounded-[1.1rem] border border-white/12 bg-white/[0.035] px-3.5 py-3.5 transition-[border-color,background-color,box-shadow,transform] duration-300 hover:border-lime/24 hover:bg-white/[0.05] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                        >
                          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent,rgba(255,255,255,0.04),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="premium-label relative text-sm text-soft/68">{phone.label}</span>
                          <span className="premium-display relative text-base font-semibold tracking-[-0.015em] text-white transition-colors duration-300 group-hover:text-soft">{phone.display}</span>
                        </motion.a>
                      ))}
                    </div>
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={lightboxOverlayTransition}
                className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden bg-black/72 p-3 backdrop-blur-[4px] md:p-6"
                onClick={closeLightbox}
              >
                <motion.div
                  initial={{ scale: 0.984, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.99, opacity: 0, y: 10 }}
                  transition={lightboxPanelTransition}
                  className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-7xl items-center justify-center overflow-hidden rounded-[1.95rem] border border-white/10 bg-charcoal/72 p-2.5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] md:max-h-[calc(100dvh-3rem)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lightboxMode === 'gallery' && clubImages.length > 1 && (
                    <>
                      <LightboxArrowButton direction="prev" onClick={prev} />
                      <LightboxArrowButton direction="next" onClick={next} />
                    </>
                  )}
                  <div className="absolute right-3 top-3 z-10">
                    <ModalCloseButton onClick={closeLightbox} />
                  </div>
                  <div
                    className="relative flex max-h-[calc(100dvh-5rem)] min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.4rem] md:max-h-[calc(100dvh-8rem)]"
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
                    {lightboxMode === 'schedule' && (
                      <>
                        <div className="pointer-events-none absolute inset-y-3 left-2 z-[1] w-5 rounded-[1rem] bg-gradient-to-r from-white/[0.08] via-white/[0.025] to-transparent md:inset-y-4 md:left-3 md:w-8" />
                        <div className="pointer-events-none absolute inset-y-3 right-2 z-[1] w-5 rounded-[1rem] bg-gradient-to-l from-white/[0.08] via-white/[0.025] to-transparent md:inset-y-4 md:right-3 md:w-8" />
                      </>
                    )}
                    <motion.img
                      key={currentPhoto}
                      src={currentPhoto}
                      alt={lightboxMode === 'schedule' ? 'Полное расписание клуба' : 'Фото клуба'}
                      className="max-h-[88vh] max-w-full object-contain transition-transform duration-200"
                      style={{ transform: `scale(${zoom})` }}
                      initial={{ opacity: 0, scale: 0.994 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={lightboxImageTransition}
                      onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
                    />
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
