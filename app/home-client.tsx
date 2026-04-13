'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type TariffLine = { label: string; value: string };
type TariffQuickFormat = {
  title: string;
  subtitle: string;
  price: string;
  targetId: string;
};
type SubscriptionPlan = {
  name: string;
  summary: string;
  fromPrice: string;
  lines: TariffLine[];
  descriptor?: string;
  featured?: boolean;
  featuredBadge?: string;
  note?: string;
};
type PersonalTrainingPlan = {
  name: string;
  summary: string;
  fromPrice: string;
  master: string;
  trainer: string;
  group: 'individual' | 'group';
  note?: string;
};
type LightboxImageState = 'idle' | 'loading' | 'loaded' | 'error';
type GalleryImageLoadState = 'loading' | 'loaded' | 'error';
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
    title: 'Силовые и функциональные',
    items: ['90/60/90', 'БЕДРА', 'СИЛОВАЯ', 'ТАБАТА', 'СКУЛЬПТОР ТЕЛА', 'ТРХ', 'МСГ', 'ДЖАМПИНГ']
  },
  {
    title: 'Гибкость и восстановление',
    items: [
      'ЙОГА ГАМАК',
      'ФИТНЕС ЙОГА',
      'ХАТХА ЙОГА',
      'ЖЕНСКАЯ ЙОГА',
      'ПИЛАТЕС',
      'ПИЛАТЕС ПЛОСКАЯ ТАЛИЯ И КРАСИВАЯ СПИНА',
      'ПИЛАТЕС СТРОЙНЫЕ НОГИ И УПРУГИЕ ЯГОДИЦЫ',
      'ЗДОРОВАЯ СПИНА',
      'ЛФК',
      'СТРЕЙЧ',
      'РОЛЛ РЕЛАКС',
      'АКТИВНАЯ МЕДИТАЦИЯ'
    ]
  },
  {
    title: 'Танцевальные и кардио',
    items: ['ЗУМБА', 'ВОСТОЧНЫЙ ТАНЕЦ', 'ФИТБОЛ']
  }
];

const programDetails: Record<string, string> = {
  '90/60/90': 'Интенсивный формат с акцентом на талию, ягодицы и ноги: плотная работа в темпе, который заметно подтягивает силуэт.',
  БЕДРА: 'Силовой класс для нижней части тела с продуманной нагрузкой на бедра и ягодицы, чтобы укрепить мышечный корсет и рельеф.',
  СИЛОВАЯ: 'Базовая силовая тренировка на основные мышечные группы с контролем техники и равномерной прогрессией нагрузки.',
  ТАБАТА: 'Интервальный протокол коротких рабочих отрезков и восстановления, который развивает выносливость и ускоряет метаболический отклик.',
  'СКУЛЬПТОР ТЕЛА': 'Комплексная работа на все тело для визуально более четкого рельефа, тонуса мышц и устойчивой функциональной формы.',
  ТРХ: 'Функциональная тренировка на подвесных петлях для силы, стабилизации корпуса, баланса и координации движений.',
  МСГ: 'Силовой микс с акцентом на мышечную выносливость и технику, чтобы качественно проработать все ключевые зоны за занятие.',
  ДЖАМПИНГ: 'Кардио-тренировка на батутах с высокой вовлеченностью мышц и мягкой амортизацией, дающая мощный заряд энергии.',
  'ЙОГА ГАМАК': 'Практика в гамаке на вытяжение, мобильность и декомпрессию позвоночника с бережной нагрузкой на суставы.',
  'ФИТНЕС ЙОГА': 'Динамичный формат йоги, который сочетает гибкость, силу и контроль дыхания для сбалансированной тренировки.',
  'ХАТХА ЙОГА': 'Классическая практика с вниманием к асанам, дыханию и концентрации для глубокого восстановления и устойчивости тела.',
  'ЖЕНСКАЯ ЙОГА': 'Мягкий формат, ориентированный на женскую физиологию: мобильность, дыхание, расслабление и внутренний ресурс.',
  ПИЛАТЕС: 'Система точных движений для укрепления центра тела, осанки и безопасной стабильности позвоночника.',
  'ПИЛАТЕС ПЛОСКАЯ ТАЛИЯ И КРАСИВАЯ СПИНА': 'Специализированный пилатес-комплекс для талии, спины и глубоких мышц корпуса с акцентом на осанку.',
  'ПИЛАТЕС СТРОЙНЫЕ НОГИ И УПРУГИЕ ЯГОДИЦЫ': 'Пилатес-фокус на ноги и ягодицы: аккуратная техника и контролируемая амплитуда для упругого тонуса.',
  'ЗДОРОВАЯ СПИНА': 'Восстановительный класс для разгрузки и укрепления мышц спины, улучшения подвижности и профилактики дискомфорта.',
  ЛФК: 'Лечебно-профилактический формат с дозированной нагрузкой для безопасного укрепления опорно-двигательного аппарата.',
  СТРЕЙЧ: 'Последовательная работа над гибкостью, эластичностью мышц и подвижностью суставов в спокойном темпе.',
  'РОЛЛ РЕЛАКС': 'Миофасциальный релиз с роллом для снятия напряжения, улучшения восстановления и качества движений.',
  'АКТИВНАЯ МЕДИТАЦИЯ': 'Практика осознанного движения и дыхания для снижения стресса, перезагрузки внимания и восстановления ресурса.',
  ЗУМБА: 'Танцевальный кардио-формат с энергичной музыкой, который улучшает выносливость и помогает держать высокий эмоциональный тонус.',
  'ВОСТОЧНЫЙ ТАНЕЦ': 'Пластичный танцевальный класс на координацию, мобильность таза и выразительность движений.',
  ФИТБОЛ: 'Тренировка с мячом на стабилизацию, осанку и мышцы корпуса с бережной, но эффективной нагрузкой.'
};

const programCategoryHighlights: Record<string, string> = {
  'Силовые и функциональные': 'Собранные форматы для силы, выносливости и четкой техники: структурированная нагрузка и заметный тренировочный результат.',
  'Гибкость и восстановление': 'Практики для баланса, мобильности и восстановления: осознанное движение, стабильный кор и бережная работа с телом.',
  'Танцевальные и кардио': 'Динамичные классы с музыкальным ритмом, которые сочетают кардио-нагрузку, координацию и эмоциональный драйв.'
};

const programCategoryTags: Record<string, string[]> = {
  'Силовые и функциональные': ['Сила', 'Функциональность', 'Выносливость'],
  'Гибкость и восстановление': ['Баланс', 'Мобильность', 'Восстановление'],
  'Танцевальные и кардио': ['Кардио', 'Ритм', 'Пластика']
};

const clubHours = [
  { label: 'Пн – Чт', value: 'с 07:00 до 21:00' },
  { label: 'Пт', value: 'с 07:00 до 20:45' },
  { label: 'Сб – Вс', value: 'с 09:00 до 17:45' }
];

const heroTitleLetters = Array.from('ЭНЕРДЖИ');
const heroLetterSpacingAdjustments = ['0.024em', '0.01em', '0.012em', '0.022em', '0.008em', '0.024em', '0em'] as const;
const SCHEDULE_SPOTLIGHT_IMAGE_URL = 'https://i.ibb.co/VpN2kKxY/08-04.jpg';
const easeOut = [0.22, 1, 0.36, 1] as const;
const motionDurations = {
  micro: 0.22,
  quick: 0.26,
  standard: 0.34,
  revealItem: 0.66,
  revealCard: 0.72,
  revealSection: 0.82,
  overlay: 0.3,
  panel: 0.38,
  lightboxPanel: 0.4,
  lightboxImage: 0.42
} as const;
const interactiveTransition = { duration: motionDurations.quick, ease: easeOut } as const;
const sectionReveal = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.revealSection, ease: easeOut }
  }
} as const;
const staggerReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.085,
      delayChildren: 0.06
    }
  }
} as const;
const itemReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.revealItem, ease: easeOut }
  }
} as const;
const softPanelReveal = {
  hidden: { opacity: 0, y: 16, scale: 0.994 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionDurations.revealItem, ease: easeOut }
  }
} as const;
const modalOverlayTransition = { duration: motionDurations.overlay, ease: easeOut } as const;
const modalPanelTransition = { duration: motionDurations.panel, ease: easeOut } as const;
const lightboxOverlayTransition = { duration: motionDurations.standard, ease: easeOut } as const;
const lightboxPanelTransition = { duration: motionDurations.lightboxPanel, ease: easeOut } as const;
const lightboxImageTransition = { duration: motionDurations.lightboxImage, ease: easeOut } as const;
const GALLERY_CONTINUOUS_SPEED_DESKTOP_PX_PER_SEC = 36;
const GALLERY_CONTINUOUS_SPEED_MOBILE_PX_PER_SEC = 48;
const GALLERY_AUTOPLAY_USER_PAUSE_MS = 1700;
const GALLERY_AUTOPLAY_TOUCH_PAUSE_MS = 900;
const GALLERY_LOOP_RESET_DELAY_MS = 440;
const GALLERY_TAP_CANCEL_DISTANCE = 16;
const LIGHTBOX_ZOOM_EPSILON = 1.02;
const LIGHTBOX_MAX_ZOOM = 3;
const LIGHTBOX_SWIPE_THRESHOLD = 96;
const LIGHTBOX_SWIPE_AXIS_RATIO = 1.35;
const GALLERY_DEFAULT_FOCAL_POINT = { x: 50, y: 37 } as const;
const GALLERY_FOCAL_POINT_OVERRIDES: Record<number, { x: number; y: number }> = {
  0: { x: 50, y: 35 },
  1: { x: 50, y: 36 },
  2: { x: 51, y: 37 },
  3: { x: 49, y: 38 },
  4: { x: 50, y: 36 },
  5: { x: 50, y: 35 },
  6: { x: 50, y: 37 },
  7: { x: 50, y: 38 },
  8: { x: 49, y: 36 },
  9: { x: 51, y: 37 },
  10: { x: 50, y: 35 },
  11: { x: 50, y: 36 }
};
const ctaMotion = {
  whileHover: { y: -1.4, scale: 1.005 },
  whileTap: { scale: 0.987 }
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
      transition={interactiveTransition}
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
      transition={interactiveTransition}
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
      transition={interactiveTransition}
      className={`group absolute top-[calc(50%-1.55rem)] z-10 inline-flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full outline-none ${
        isPrev ? 'left-3 md:left-4' : 'right-3 md:right-4'
      }`}
      aria-label={isPrev ? 'Предыдущее фото' : 'Следующее фото'}
    >
      <span className="absolute inset-0 rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(22,22,20,0.94),rgba(14,14,12,0.9))] shadow-[0_18px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-all duration-300 group-hover:border-lime/30 group-hover:bg-[linear-gradient(180deg,rgba(29,29,26,0.94),rgba(18,18,15,0.9))] group-hover:shadow-[0_22px_42px_rgba(0,0,0,0.38)] group-focus-visible:border-lime/38" />
      <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(191,255,0,0.11),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="relative z-10 h-[15px] w-[15px] text-soft/95 transition-colors duration-300 group-hover:text-white">
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

function GalleryArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={interactiveTransition}
      className={`group absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-[linear-gradient(180deg,rgba(26,26,23,0.9),rgba(16,16,14,0.92))] text-soft/88 shadow-[0_14px_26px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-colors duration-300 hover:border-lime/30 hover:text-white md:inline-flex ${
        isPrev ? 'left-2.5' : 'right-2.5'
      }`}
      aria-label={isPrev ? 'Листать фото назад' : 'Листать фото вперёд'}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[13px] w-[13px]">
        <path
          d={isPrev ? 'M14.4 5.9L8.7 12l5.7 6.1' : 'M9.6 5.9l5.7 6.1-5.7 6.1'}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    </motion.button>
  );
}

const clubCardColumns = ['30 дней', '3 месяца', '6 месяцев', '12 месяцев'];

const clubCardRows = [
  {
    name: 'Безлимитная клубная карта',
    note: 'Тренажерный зал',
    time: 'с 7:00 до 21:00',
    prices: ['Наличный расчёт — 3 150 ₽', 'Наличный расчёт — 7 450 ₽', 'Наличный расчёт — 13 100 ₽', 'Наличный расчёт — 23 100 ₽']
  },
  {
    name: 'Дневная безлимитная клубная карта',
    note: 'Тренажерный зал',
    time: 'с 7:00 до 17:00',
    prices: ['', '', '', '17 900 ₽']
  }
];

const tariffQuickFormats: TariffQuickFormat[] = [
  {
    title: 'Клубные карты',
    subtitle: 'Безлимитный формат на срок от 30 дней до 12 месяцев',
    price: 'от 3 150 ₽',
    targetId: 'tariff-club-cards'
  },
  {
    title: 'Абонементы на посещение',
    subtitle: 'Гибкие условия по времени, формату и категории клиента',
    price: 'от 1 500 ₽',
    targetId: 'tariff-subscriptions'
  },
  {
    title: 'Персональный тренинг',
    subtitle: 'Индивидуальные и парные форматы с тренером и мастер-тренером',
    price: 'от 600 ₽',
    targetId: 'tariff-personal-training'
  }
];

const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: 'Утренний абонемент',
    summary: 'с 7:00 до 13:00',
    fromPrice: '10 посещений — 1 900 ₽',
    lines: [{ label: '10 посещений / 1 месяц', value: '1 900 ₽' }]
  },
  {
    name: 'Спецтариф 14:00–16:00',
    summary: 'с 14:00 до 16:00',
    fromPrice: '1 500 ₽',
    lines: [{ label: '8 посещений / 1 месяц', value: '1 500 ₽' }],
    descriptor: 'Фиксированное окно посещения'
  },
  {
    name: 'Абонемент для школьников и студентов',
    summary: 'Льготный формат',
    fromPrice: 'от 2 210 ₽',
    lines: [
      { label: '8 посещений / 1 месяц', value: '2 210 ₽' },
      { label: '10 посещений / 1 месяц', value: '2 650 ₽' }
    ],
    descriptor: 'Для студентов и школьников'
  },
  {
    name: 'Универсальный абонемент',
    summary: 'с 7:30 до 21:00',
    fromPrice: 'от 2 750 ₽',
    lines: [
      { label: '8 посещений / 1 месяц', value: '2 750 ₽' },
      { label: '10 посещений / 1 месяц', value: '3 350 ₽' }
    ],
    featured: true,
    featuredBadge: 'Выбор клиентов'
  },
  {
    name: 'Пенсионный / корпоративный',
    summary: 'Специальные условия клуба',
    fromPrice: 'от 2 650 ₽',
    lines: [
      { label: '8 посещений / 1 месяц', value: '2 650 ₽' },
      { label: '10 посещений / 1 месяц', value: '3 250 ₽' }
    ]
  },
  {
    name: 'Абонемент выходного дня',
    summary: 'тренажерный зал, пятница–воскресенье',
    fromPrice: '1 700 ₽',
    lines: [{ label: '1 месяц', value: '1 700 ₽' }]
  },
  {
    name: 'Безлимитный месячный абонемент',
    summary: 'на месяц в тренажерный зал и групповые тренировки',
    fromPrice: '4 200 ₽',
    lines: [{ label: '1 месяц', value: '4 200 ₽' }]
  }
];

const oneTimeVisitPlan: SubscriptionPlan = {
  name: 'Разовое посещение',
  summary: 'Разовый вход в клуб',
  fromPrice: 'от 330 ₽',
  lines: [
    { label: 'Взрослые (с 7:30 до 22:00)', value: '430 ₽' },
    { label: 'Школьники, студенты (с 7:00 до 22:00)', value: '330 ₽' },
    { label: 'Инвалиды (с 7:30 до 22:00)', value: '380 ₽' },
    { label: 'Пенсионеры (с 7:30 до 22:00)', value: '380 ₽' }
  ],
  note: '* Разовое посещение действует в рамках указанного временного окна.'
};

const personalTrainingPlans: PersonalTrainingPlan[] = [
  {
    name: 'Разовая персональная тренировка',
    summary: 'Индивидуальная работа, 1 час',
    fromPrice: 'от 950 ₽',
    master: '1 000 ₽ / 1 050 ₽',
    trainer: '950 ₽',
    group: 'individual'
  },
  {
    name: 'Блок 5 тренировок',
    summary: 'Пакет с фиксированной стоимостью',
    fromPrice: 'от 4 500 ₽',
    master: '4 750 ₽ / 5 000 ₽',
    trainer: '4 500 ₽',
    group: 'individual'
  },
  {
    name: 'Блок 10 тренировок',
    summary: 'Максимально выгодный пакет',
    fromPrice: 'от 8 700 ₽',
    master: '9 300 ₽ / 9 700 ₽',
    trainer: '8 700 ₽',
    group: 'individual'
  },
  {
    name: 'Сплит на 2 человека',
    summary: 'Стоимость с каждого участника',
    fromPrice: '750 ₽ с каждого',
    master: '750 ₽ с каждого',
    trainer: '750 ₽ с каждого',
    group: 'group'
  },
  {
    name: 'Блок 10 сплитов',
    summary: 'Стоимость с каждого участника',
    fromPrice: '7 000 ₽ с каждого',
    master: '7 000 ₽ с каждого',
    trainer: '7 000 ₽ с каждого',
    group: 'group'
  },
  {
    name: 'Мини-группа',
    summary: 'Работа в мини-формате',
    fromPrice: '600 ₽ с каждого',
    master: '600 ₽ с каждого',
    trainer: '600 ₽ с каждого',
    group: 'group',
    note: 'Блок 10 тренировок — 5 500 ₽ с каждого'
  }
];

const personalTrainingIndividualPlans = personalTrainingPlans.filter((plan) => plan.group === 'individual');
const personalTrainingGroupPlans = personalTrainingPlans.filter((plan) => plan.group === 'group');

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
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [callModal, setCallModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxMode, setLightboxMode] = useState<'gallery' | 'schedule' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxImageState, setLightboxImageState] = useState<LightboxImageState>('idle');
  const [lightboxRetryAttempt, setLightboxRetryAttempt] = useState(0);
  const [lightboxOffset, setLightboxOffset] = useState({ x: 0, y: 0 });
  const [galleryPreloadError, setGalleryPreloadError] = useState(false);
  const [galleryImageStates, setGalleryImageStates] = useState<Record<number, GalleryImageLoadState>>({});
  const [galleryRetrySeed, setGalleryRetrySeed] = useState(0);
  const [schedulePreviewLoaded, setSchedulePreviewLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [programPanelOpen, setProgramPanelOpen] = useState(false);
  const [clubImages] = useState<string[]>(initialClubImages);
  const [scheduleImages] = useState<string[]>(() => [
    SCHEDULE_SPOTLIGHT_IMAGE_URL,
    ...initialScheduleImages.filter((source) => source !== SCHEDULE_SPOTLIGHT_IMAGE_URL)
  ]);
  const [selectedProgram, setSelectedProgram] = useState(programCategories[0].items[0]);
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const gallerySlideRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const galleryAutoplayResumeAtRef = useRef(0);
  const galleryLastFrameTimeRef = useRef<number | null>(null);
  const galleryVirtualScrollRef = useRef(0);
  const galleryIsInteractingRef = useRef(false);
  const galleryActiveIndexRef = useRef(0);
  const galleryPhysicalIndexRef = useRef(0);
  const galleryLoopResetTimerRef = useRef<number | null>(null);
  const galleryTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const galleryPointerStartRef = useRef<{ pointerId: number; x: number; y: number; renderIndex: number; moved: boolean } | null>(null);
  const galleryIgnoreClickIndexRef = useRef<number | null>(null);
  const programChipPointerStartRef = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null);
  const programChipIgnoreClickRef = useRef(false);
  const lightboxOverlayPointerRef = useRef<{ x: number; y: number } | null>(null);
  const lightboxViewportRef = useRef<HTMLDivElement | null>(null);
  const lightboxPanStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const lightboxTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lightboxPinchDistanceRef = useRef<number | null>(null);
  const lightboxSwipeTriggeredRef = useRef(false);
  const lightboxMousePanRef = useRef<{ pointerId: number; x: number; y: number; originX: number; originY: number } | null>(null);
  const lightboxLastTapAtRef = useRef(0);
  const lightboxOffsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);

  const gallerySlides = useMemo(() => clubImages, [clubImages]);
  const galleryLoopedSlides = useMemo(() => {
    if (gallerySlides.length <= 1) {
      return gallerySlides.map((src, renderIndex) => ({ src, logicalIndex: renderIndex, renderIndex }));
    }
    const rendered = [...gallerySlides, ...gallerySlides, ...gallerySlides];
    return rendered.map((src, renderIndex) => ({
      src,
      logicalIndex: renderIndex % gallerySlides.length,
      renderIndex
    }));
  }, [gallerySlides]);
  const galleryIsInteractive = gallerySlides.length > 0;
  const galleryPriorityIndexes = useMemo(() => {
    if (gallerySlides.length === 0) return [] as number[];
    const priorityOrder = [0, 1, 2, gallerySlides.length - 1, 3];
    const deduped = new Set<number>();
    priorityOrder.forEach((index) => {
      if (index >= 0 && index < gallerySlides.length) deduped.add(index);
    });
    return Array.from(deduped);
  }, [gallerySlides.length]);
  const galleryPriorityIndexSet = useMemo(() => new Set(galleryPriorityIndexes), [galleryPriorityIndexes]);
  const galleryFocalPoints = useMemo(
    () =>
      gallerySlides.map((_, logicalIndex) => {
        const override = GALLERY_FOCAL_POINT_OVERRIDES[logicalIndex];
        return override ?? GALLERY_DEFAULT_FOCAL_POINT;
      }),
    [gallerySlides]
  );
  const lightboxImages = lightboxMode === 'schedule' ? scheduleImages : clubImages;
  const currentPhoto = lightboxMode ? lightboxImages[lightboxIndex ?? 0] : null;
  const isAnyOverlayOpen = mounted && (callModal || programPanelOpen || currentPhoto !== null);
  const selectedProgramCategory =
    programCategories.find((category) => category.items.includes(selectedProgram))?.title ?? programCategories[0].title;
  const selectedProgramTags = programCategoryTags[selectedProgramCategory] ?? ['Энергия', 'Фокус', 'Групповой формат'];
  const selectedProgramHighlight =
    programCategoryHighlights[selectedProgramCategory] ?? 'Групповая тренировка с уверенным ритмом, продуманной подачей и вниманием к качеству движения.';
  const normalizeGalleryIndex = useCallback(
    (index: number) => {
      if (gallerySlides.length === 0) return 0;
      return ((index % gallerySlides.length) + gallerySlides.length) % gallerySlides.length;
    },
    [gallerySlides.length]
  );
  const pauseGalleryAutoplay = useCallback((durationMs = GALLERY_AUTOPLAY_USER_PAUSE_MS) => {
    galleryLastFrameTimeRef.current = null;
    galleryAutoplayResumeAtRef.current = window.performance.now() + durationMs;
  }, []);
  const clearGalleryLoopResetTimer = useCallback(() => {
    if (galleryLoopResetTimerRef.current !== null) {
      window.clearTimeout(galleryLoopResetTimerRef.current);
      galleryLoopResetTimerRef.current = null;
    }
  }, []);
  const normalizeGalleryPhysicalIndex = useCallback(
    (index: number) => {
      if (gallerySlides.length <= 1) return 0;
      return ((index % galleryLoopedSlides.length) + galleryLoopedSlides.length) % galleryLoopedSlides.length;
    },
    [galleryLoopedSlides.length, gallerySlides.length]
  );
  const movePhysicalIndexToMiddleRange = useCallback(
    (index: number) => {
      if (gallerySlides.length <= 1) return 0;
      const baseCount = gallerySlides.length;
      const middleStart = baseCount;
      const middleEnd = baseCount * 2 - 1;
      let normalized = normalizeGalleryPhysicalIndex(index);

      while (normalized < middleStart) normalized += baseCount;
      while (normalized > middleEnd) normalized -= baseCount;

      return normalized;
    },
    [gallerySlides.length, normalizeGalleryPhysicalIndex]
  );
  const syncGalleryVirtualPosition = useCallback(
    (viewport: HTMLDivElement) => {
      if (gallerySlides.length < 2) return 0;
      const segmentWidth = viewport.scrollWidth / 3;
      if (!segmentWidth) return 0;

      if (viewport.scrollLeft < segmentWidth) {
        viewport.scrollLeft += segmentWidth;
      } else if (viewport.scrollLeft >= segmentWidth * 2) {
        viewport.scrollLeft -= segmentWidth;
      }

      galleryVirtualScrollRef.current = viewport.scrollLeft;
      return segmentWidth;
    },
    [gallerySlides.length]
  );
  const syncGalleryStateFromPhysicalIndex = useCallback(
    (physicalIndex: number) => {
      if (gallerySlides.length === 0) {
        setActiveGalleryIndex(0);
        galleryActiveIndexRef.current = 0;
        galleryPhysicalIndexRef.current = 0;
        return 0;
      }
      const normalizedPhysical = gallerySlides.length > 1 ? movePhysicalIndexToMiddleRange(physicalIndex) : 0;
      const logicalIndex = normalizeGalleryIndex(normalizedPhysical);
      setActiveGalleryIndex((prev) => (prev === logicalIndex ? prev : logicalIndex));
      galleryActiveIndexRef.current = logicalIndex;
      galleryPhysicalIndexRef.current = normalizedPhysical;
      return normalizedPhysical;
    },
    [gallerySlides.length, movePhysicalIndexToMiddleRange, normalizeGalleryIndex]
  );
  const resolveClosestGalleryPhysicalIndex = useCallback(() => {
    if (galleryLoopedSlides.length === 0) return 0;
    const viewport = galleryViewportRef.current;
    if (!viewport) return 0;

    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    let closestIndex = galleryPhysicalIndexRef.current;
    let minDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < galleryLoopedSlides.length; index += 1) {
      const slide = gallerySlideRefs.current[index];
      if (!slide) continue;
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    }

    return normalizeGalleryPhysicalIndex(closestIndex);
  }, [galleryLoopedSlides.length, normalizeGalleryPhysicalIndex]);
  const scrollGalleryToPhysicalIndex = useCallback(
    (physicalIndex: number, behavior: ScrollBehavior = 'smooth') => {
      if (galleryLoopedSlides.length === 0) return;
      const normalizedPhysicalIndex = normalizeGalleryPhysicalIndex(physicalIndex);
      const slide = gallerySlideRefs.current[normalizedPhysicalIndex];
      if (!slide) return;
      slide.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
      const nextPhysicalIndex =
        gallerySlides.length > 1 && behavior === 'auto' ? movePhysicalIndexToMiddleRange(normalizedPhysicalIndex) : normalizedPhysicalIndex;
      const logicalIndex = normalizeGalleryIndex(nextPhysicalIndex);
      setActiveGalleryIndex((prev) => (prev === logicalIndex ? prev : logicalIndex));
      galleryActiveIndexRef.current = logicalIndex;
      galleryPhysicalIndexRef.current = nextPhysicalIndex;
    },
    [galleryLoopedSlides.length, gallerySlides.length, movePhysicalIndexToMiddleRange, normalizeGalleryIndex, normalizeGalleryPhysicalIndex]
  );
  const stepGalleryBy = useCallback(
    (delta: number, pauseMs: number, behavior: ScrollBehavior = 'smooth') => {
      if (gallerySlides.length < 2) return;

      clearGalleryLoopResetTimer();
      if (pauseMs > 0) pauseGalleryAutoplay(pauseMs);

      const baseCount = gallerySlides.length;
      const currentPhysicalIndex = movePhysicalIndexToMiddleRange(galleryPhysicalIndexRef.current || baseCount);
      const nextPhysicalIndex = currentPhysicalIndex + delta;

      scrollGalleryToPhysicalIndex(nextPhysicalIndex, behavior);

      if (nextPhysicalIndex >= baseCount * 2) {
        galleryLoopResetTimerRef.current = window.setTimeout(() => {
          scrollGalleryToPhysicalIndex(nextPhysicalIndex - baseCount, 'auto');
          galleryLoopResetTimerRef.current = null;
        }, GALLERY_LOOP_RESET_DELAY_MS);
      } else if (nextPhysicalIndex < baseCount) {
        galleryLoopResetTimerRef.current = window.setTimeout(() => {
          scrollGalleryToPhysicalIndex(nextPhysicalIndex + baseCount, 'auto');
          galleryLoopResetTimerRef.current = null;
        }, GALLERY_LOOP_RESET_DELAY_MS);
      }
    },
    [clearGalleryLoopResetTimer, gallerySlides.length, movePhysicalIndexToMiddleRange, pauseGalleryAutoplay, scrollGalleryToPhysicalIndex]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    lightboxOffsetRef.current = lightboxOffset;
  }, [lightboxOffset]);

  useEffect(() => {
    galleryActiveIndexRef.current = activeGalleryIndex;
  }, [activeGalleryIndex]);

  useEffect(() => {
    if (!mounted) return;

    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousRootOverflow = root.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehaviorY;
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    const shouldLockScroll = callModal || currentPhoto !== null || (programPanelOpen && !isMobileViewport);

    if (shouldLockScroll) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      root.style.overflow = 'hidden';
      root.style.overscrollBehaviorY = 'none';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehaviorY = previousRootOverscroll;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehaviorY = previousRootOverscroll;
    };
  }, [callModal, currentPhoto, mounted, programPanelOpen]);

  useEffect(() => {
    gallerySlideRefs.current = gallerySlideRefs.current.slice(0, galleryLoopedSlides.length);
    clearGalleryLoopResetTimer();
    if (gallerySlides.length === 0 || !galleryIsInteractive) {
      setActiveGalleryIndex(0);
      galleryActiveIndexRef.current = 0;
      galleryPhysicalIndexRef.current = 0;
      return;
    }

    const initialLogicalIndex = normalizeGalleryIndex(galleryActiveIndexRef.current);
    const initialPhysicalIndex = gallerySlides.length > 1 ? gallerySlides.length + initialLogicalIndex : 0;
    const rafId = window.requestAnimationFrame(() => {
      scrollGalleryToPhysicalIndex(initialPhysicalIndex, 'auto');
      const viewport = galleryViewportRef.current;
      if (viewport) {
        syncGalleryVirtualPosition(viewport);
      }
      galleryLastFrameTimeRef.current = null;
      pauseGalleryAutoplay(520);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      clearGalleryLoopResetTimer();
    };
  }, [
    clearGalleryLoopResetTimer,
    galleryIsInteractive,
    galleryLoopedSlides.length,
    gallerySlides.length,
    normalizeGalleryIndex,
    pauseGalleryAutoplay,
    scrollGalleryToPhysicalIndex,
    syncGalleryVirtualPosition
  ]);

  useEffect(() => {
    if (!galleryIsInteractive || galleryLoopedSlides.length < 1) return;
    const viewport = galleryViewportRef.current;
    if (!viewport) return;

    let rafId: number | null = null;
    const syncActiveSlide = () => {
      rafId = null;
      syncGalleryVirtualPosition(viewport);
      const closestPhysicalIndex = resolveClosestGalleryPhysicalIndex();
      syncGalleryStateFromPhysicalIndex(closestPhysicalIndex);
    };

    syncActiveSlide();

    const onScroll = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(syncActiveSlide);
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [galleryIsInteractive, galleryLoopedSlides.length, resolveClosestGalleryPhysicalIndex, syncGalleryStateFromPhysicalIndex, syncGalleryVirtualPosition]);

  useEffect(() => {
    if (!galleryIsInteractive || gallerySlides.length < 2) return;
    const viewport = galleryViewportRef.current;
    if (!viewport) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    let rafId: number | null = null;

    const tick = (now: number) => {
      const activeViewport = galleryViewportRef.current;
      if (!activeViewport) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      syncGalleryVirtualPosition(activeViewport);

      if (isAnyOverlayOpen || now < galleryAutoplayResumeAtRef.current) {
        galleryLastFrameTimeRef.current = now;
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const prevTime = galleryLastFrameTimeRef.current;
      galleryLastFrameTimeRef.current = now;
      if (prevTime !== null) {
        const elapsedSeconds = Math.min(0.05, (now - prevTime) / 1000);
        const speed = mobileQuery.matches ? GALLERY_CONTINUOUS_SPEED_MOBILE_PX_PER_SEC : GALLERY_CONTINUOUS_SPEED_DESKTOP_PX_PER_SEC;
        activeViewport.scrollLeft += speed * elapsedSeconds;
        syncGalleryVirtualPosition(activeViewport);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    galleryLastFrameTimeRef.current = null;
    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      galleryLastFrameTimeRef.current = null;
      clearGalleryLoopResetTimer();
    };
  }, [clearGalleryLoopResetTimer, galleryIsInteractive, gallerySlides.length, isAnyOverlayOpen, syncGalleryVirtualPosition]);

  const closeLightbox = useCallback(() => {
    clearGalleryLoopResetTimer();
    galleryIsInteractingRef.current = false;
    galleryTouchStartRef.current = null;
    setLightboxMode(null);
    setLightboxIndex(null);
    setZoom(1);
    zoomRef.current = 1;
    setLightboxOffset({ x: 0, y: 0 });
    lightboxOffsetRef.current = { x: 0, y: 0 };
    lightboxPanStartRef.current = null;
    lightboxTouchStartRef.current = null;
    lightboxPinchDistanceRef.current = null;
    lightboxSwipeTriggeredRef.current = false;
    lightboxMousePanRef.current = null;
    lightboxLastTapAtRef.current = 0;
    setLightboxImageState('idle');
    setLightboxRetryAttempt(0);
  }, [clearGalleryLoopResetTimer]);

  const clampLightboxOffset = useCallback((x: number, y: number, nextZoom: number) => {
    if (nextZoom <= LIGHTBOX_ZOOM_EPSILON) return { x: 0, y: 0 };

    const viewport = lightboxViewportRef.current;
    if (!viewport) return { x, y };

    const maxX = Math.max(0, (viewport.clientWidth * (nextZoom - 1)) / 2);
    const maxY = Math.max(0, (viewport.clientHeight * (nextZoom - 1)) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y))
    };
  }, []);

  const resolveZoomFocalPoint = useCallback((clientX: number, clientY: number) => {
    const viewport = lightboxViewportRef.current;
    if (!viewport) return { x: 0, y: 0 };
    const rect = viewport.getBoundingClientRect();
    return {
      x: clientX - (rect.left + rect.width / 2),
      y: clientY - (rect.top + rect.height / 2)
    };
  }, []);

  const applyLightboxZoom = useCallback(
    (rawNextZoom: number, focalClientPoint?: { x: number; y: number }) => {
      const nextZoom = Math.min(LIGHTBOX_MAX_ZOOM, Math.max(1, rawNextZoom));
      const prevZoom = zoomRef.current;
      let nextOffset = lightboxOffsetRef.current;

      if (focalClientPoint && prevZoom > 0.001 && Math.abs(nextZoom - prevZoom) > 0.001) {
        const focal = resolveZoomFocalPoint(focalClientPoint.x, focalClientPoint.y);
        const zoomRatio = nextZoom / prevZoom;
        nextOffset = {
          x: focal.x - (focal.x - nextOffset.x) * zoomRatio,
          y: focal.y - (focal.y - nextOffset.y) * zoomRatio
        };
      }

      nextOffset = clampLightboxOffset(nextOffset.x, nextOffset.y, nextZoom);

      zoomRef.current = nextZoom;
      lightboxOffsetRef.current = nextOffset;
      setZoom(nextZoom);
      setLightboxOffset(nextOffset);
    },
    [clampLightboxOffset, resolveZoomFocalPoint]
  );

  const retryCurrentPhoto = () => {
    if (!currentPhoto) return;
    setLightboxImageState('loading');
    setLightboxRetryAttempt((attempt) => attempt + 1);
  };

  const retryGalleryLoad = () => {
    setGalleryRetrySeed((seed) => seed + 1);
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
  }, [closeLightbox]);

  useEffect(() => {
    if (!currentPhoto) {
      setLightboxImageState('idle');
      setLightboxRetryAttempt(0);
      setLightboxOffset({ x: 0, y: 0 });
      lightboxOffsetRef.current = { x: 0, y: 0 };
      setZoom(1);
      zoomRef.current = 1;
      return;
    }

    setLightboxImageState('loading');
    setLightboxRetryAttempt(0);
    setLightboxOffset({ x: 0, y: 0 });
    lightboxOffsetRef.current = { x: 0, y: 0 };
    setZoom(1);
    zoomRef.current = 1;
  }, [currentPhoto]);

  useEffect(() => {
    if (!mounted) return;
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const update = () => {
      const isMobileViewport = mobileQuery.matches || (coarsePointerQuery.matches && window.innerWidth <= 900);
      if (!isMobileViewport) {
        setShowScrollTop(false);
        return;
      }
      const threshold = Math.max(140, Math.min(240, window.innerHeight * 0.32));
      setShowScrollTop(window.scrollY > threshold);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [mounted]);

  useEffect(() => {
    if (!clubImages.length) {
      setGalleryPreloadError(false);
      setGalleryImageStates({});
      return;
    }

    let cancelled = false;
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    const preloadCount = Math.min(isMobileViewport ? 4 : 7, clubImages.length);
    const preloadTargets = galleryPriorityIndexes
      .concat(clubImages.map((_, index) => index).filter((index) => !galleryPriorityIndexSet.has(index)))
      .slice(0, preloadCount);

    setGalleryPreloadError(false);
    setGalleryImageStates(() => {
      const next: Record<number, GalleryImageLoadState> = {};
      for (let index = 0; index < clubImages.length; index += 1) {
        next[index] = 'loading';
      }
      return next;
    });

    let resolvedCount = 0;
    let loadedCount = 0;
    const preloadTimeout = window.setTimeout(() => {
      if (cancelled) return;
      setGalleryPreloadError(loadedCount === 0);
    }, 1800);

    const preloaders = preloadTargets.map((logicalIndex) => {
      const preloader = new window.Image();
      preloader.decoding = 'async';
      preloader.onload = () => {
        if (cancelled) return;
        loadedCount += 1;
        setGalleryImageStates((prev) => (prev[logicalIndex] === 'loaded' ? prev : { ...prev, [logicalIndex]: 'loaded' }));
        resolvedCount += 1;
        if (resolvedCount >= preloadTargets.length) {
          window.clearTimeout(preloadTimeout);
          setGalleryPreloadError(loadedCount === 0);
        }
      };
      preloader.onerror = () => {
        if (cancelled) return;
        setGalleryImageStates((prev) => (prev[logicalIndex] === 'error' ? prev : { ...prev, [logicalIndex]: 'error' }));
        resolvedCount += 1;
        if (resolvedCount >= preloadTargets.length) {
          window.clearTimeout(preloadTimeout);
          setGalleryPreloadError(loadedCount === 0);
        }
      };
      const source = clubImages[logicalIndex];
      const sourceWithSeed = galleryRetrySeed > 0 ? `${source}${source.includes('?') ? '&' : '?'}g=${galleryRetrySeed}` : source;
      preloader.src = sourceWithSeed;
      return preloader;
    });

    return () => {
      cancelled = true;
      window.clearTimeout(preloadTimeout);
      preloaders.forEach((preloader) => {
        preloader.onload = null;
        preloader.onerror = null;
      });
    };
  }, [clubImages, galleryPriorityIndexSet, galleryPriorityIndexes, galleryRetrySeed]);

  const openGallery = (index: number) => {
    const normalizedIndex = normalizeGalleryIndex(index);
    clearGalleryLoopResetTimer();
    galleryIsInteractingRef.current = false;
    galleryTouchStartRef.current = null;
    pauseGalleryAutoplay(GALLERY_AUTOPLAY_USER_PAUSE_MS);
    setActiveGalleryIndex(normalizedIndex);
    galleryActiveIndexRef.current = normalizedIndex;
    setLightboxMode('gallery');
    setLightboxIndex(normalizedIndex);
    setZoom(1);
    zoomRef.current = 1;
    setLightboxOffset({ x: 0, y: 0 });
    lightboxOffsetRef.current = { x: 0, y: 0 };
    lightboxPanStartRef.current = null;
    lightboxTouchStartRef.current = null;
    lightboxPinchDistanceRef.current = null;
    lightboxSwipeTriggeredRef.current = false;
  };

  const scrollPageToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSchedule = () => {
    if (!scheduleImages.length) return;
    clearGalleryLoopResetTimer();
    galleryIsInteractingRef.current = false;
    galleryTouchStartRef.current = null;
    setLightboxMode('schedule');
    setLightboxIndex(0);
    setZoom(1);
    zoomRef.current = 1;
    setLightboxOffset({ x: 0, y: 0 });
    lightboxOffsetRef.current = { x: 0, y: 0 };
    lightboxPanStartRef.current = null;
    lightboxTouchStartRef.current = null;
    lightboxPinchDistanceRef.current = null;
    lightboxSwipeTriggeredRef.current = false;
  };
  const goGalleryNext = useCallback(() => {
    stepGalleryBy(1, GALLERY_AUTOPLAY_USER_PAUSE_MS, 'smooth');
  }, [stepGalleryBy]);
  const goGalleryPrev = useCallback(() => {
    stepGalleryBy(-1, GALLERY_AUTOPLAY_USER_PAUSE_MS, 'smooth');
  }, [stepGalleryBy]);

  const closeProgramPanel = () => {
    setProgramPanelOpen(false);
  };

  const next = () => {
    if (lightboxMode !== 'gallery' || clubImages.length === 0) return;
    setLightboxIndex((currentIndex) => ((currentIndex ?? 0) + 1) % clubImages.length);
    setZoom(1);
    zoomRef.current = 1;
    setLightboxOffset({ x: 0, y: 0 });
    lightboxOffsetRef.current = { x: 0, y: 0 };
    lightboxPanStartRef.current = null;
    lightboxTouchStartRef.current = null;
    lightboxPinchDistanceRef.current = null;
    lightboxSwipeTriggeredRef.current = false;
  };

  const prev = () => {
    if (lightboxMode !== 'gallery' || clubImages.length === 0) return;
    setLightboxIndex((currentIndex) => ((currentIndex ?? 0) - 1 + clubImages.length) % clubImages.length);
    setZoom(1);
    zoomRef.current = 1;
    setLightboxOffset({ x: 0, y: 0 });
    lightboxOffsetRef.current = { x: 0, y: 0 };
    lightboxPanStartRef.current = null;
    lightboxTouchStartRef.current = null;
    lightboxPinchDistanceRef.current = null;
    lightboxSwipeTriggeredRef.current = false;
  };

  const openProgramPanel = (program: string) => {
    setSelectedProgram(program);
    setProgramPanelOpen(true);
  };

  const scrollToTariffSection = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    transition={{ duration: motionDurations.revealCard, delay: 0.24 + index * 0.06, ease: easeOut }}
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
                transition={{ duration: motionDurations.revealItem, delay: 0.5, ease: easeOut }}
                className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-18 origin-left bg-gradient-to-r from-lime/66 via-lime/14 to-transparent md:w-24"
              />
              <motion.span
                initial={{ opacity: 0, y: 24, filter: 'blur(9px)', clipPath: 'inset(0 0 100% 0)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: motionDurations.revealItem, delay: 0.44, ease: easeOut }}
                className="block bg-[linear-gradient(96deg,#ffffff_0%,#f7f7f3_32%,#eef0dd_68%,#f3f3ef_100%)] bg-clip-text text-transparent"
              >
                Энергия движения. Сила результата
              </motion.span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: motionDurations.revealCard, delay: 0.62, ease: easeOut }}
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
                transition={interactiveTransition}
              >
                Смотреть расписание
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setCallModal(true)}
                className="ghost-button premium-transition"
                {...ctaMotion}
                transition={interactiveTransition}
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
          {gallerySlides.length > 0 ? (
            galleryIsInteractive ? (
              <div className="gallery-edge-shell">
                <motion.div
                  ref={galleryViewportRef}
                  className="-mx-4 flex gap-[0.55rem] overflow-x-auto overflow-y-hidden px-4 pb-4 scrollbar-hidden md:gap-[0.68rem]"
                  variants={staggerReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  onWheel={() => {
                    clearGalleryLoopResetTimer();
                    pauseGalleryAutoplay(GALLERY_AUTOPLAY_USER_PAUSE_MS);
                  }}
                  onTouchStart={(event) => {
                    clearGalleryLoopResetTimer();
                    pauseGalleryAutoplay(GALLERY_AUTOPLAY_TOUCH_PAUSE_MS);
                    galleryIsInteractingRef.current = true;
                    if (event.touches.length !== 1) {
                      galleryTouchStartRef.current = null;
                      return;
                    }
                    const touch = event.touches[0];
                    galleryTouchStartRef.current = {
                      x: touch.clientX,
                      y: touch.clientY
                    };
                  }}
                  onTouchEnd={() => {
                    galleryTouchStartRef.current = null;
                    galleryIsInteractingRef.current = false;
                  }}
                  onTouchCancel={() => {
                    galleryTouchStartRef.current = null;
                    galleryIsInteractingRef.current = false;
                  }}
                  onPointerDown={(event) => {
                    clearGalleryLoopResetTimer();
                    if (event.pointerType === 'touch') {
                      galleryIsInteractingRef.current = true;
                      pauseGalleryAutoplay(GALLERY_AUTOPLAY_TOUCH_PAUSE_MS);
                    } else if (event.pointerType === 'mouse' && event.buttons === 1) {
                      galleryIsInteractingRef.current = true;
                      pauseGalleryAutoplay(GALLERY_AUTOPLAY_USER_PAUSE_MS);
                    }
                  }}
                  onPointerUp={() => {
                    galleryIsInteractingRef.current = false;
                  }}
                  onPointerCancel={() => {
                    galleryIsInteractingRef.current = false;
                  }}
                >
                  {galleryLoopedSlides.map(({ src, logicalIndex, renderIndex }) => {
                    const imageState = galleryImageStates[logicalIndex] ?? 'loading';
                    const isLoaded = imageState === 'loaded';
                    const imageSourceWithSeed = galleryRetrySeed > 0 ? `${src}${src.includes('?') ? '&' : '?'}g=${galleryRetrySeed}` : src;
                    const isPrimaryRender = gallerySlides.length > 1 ? renderIndex >= gallerySlides.length && renderIndex < gallerySlides.length * 2 : renderIndex === 0;
                    const shouldPrioritizeLoad = isPrimaryRender && galleryPriorityIndexSet.has(logicalIndex);
                    const isCenterRenderSlide =
                      gallerySlides.length > 1
                        ? renderIndex >= gallerySlides.length - 1 && renderIndex <= gallerySlides.length + 1
                        : renderIndex === 0;
                    const shouldEagerLoad = shouldPrioritizeLoad || isCenterRenderSlide;
                    const isActiveRenderSlide = gallerySlides.length > 1
                      ? renderIndex === galleryPhysicalIndexRef.current
                      : logicalIndex === activeGalleryIndex;
                    const focalPoint = galleryFocalPoints[logicalIndex] ?? GALLERY_DEFAULT_FOCAL_POINT;

                    return (
                      <button
                        key={`${src}-${renderIndex}`}
                        ref={(node) => {
                          gallerySlideRefs.current[renderIndex] = node;
                        }}
                        type="button"
                        onClick={(event) => {
                          if (galleryIgnoreClickIndexRef.current === renderIndex) {
                            galleryIgnoreClickIndexRef.current = null;
                            event.preventDefault();
                            return;
                          }
                          openGallery(logicalIndex);
                        }}
                        onPointerDown={(event) => {
                          clearGalleryLoopResetTimer();
                          galleryIsInteractingRef.current = true;
                          galleryPointerStartRef.current = {
                            pointerId: event.pointerId,
                            x: event.clientX,
                            y: event.clientY,
                            renderIndex,
                            moved: false
                          };
                          if (event.pointerType === 'touch') {
                            pauseGalleryAutoplay(GALLERY_AUTOPLAY_TOUCH_PAUSE_MS);
                          } else {
                            pauseGalleryAutoplay(GALLERY_AUTOPLAY_USER_PAUSE_MS);
                          }
                        }}
                        onPointerMove={(event) => {
                          const pointerStart = galleryPointerStartRef.current;
                          if (!pointerStart || pointerStart.pointerId !== event.pointerId || pointerStart.renderIndex !== renderIndex) return;
                          const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
                          if (distance > GALLERY_TAP_CANCEL_DISTANCE) {
                            pointerStart.moved = true;
                            galleryIgnoreClickIndexRef.current = renderIndex;
                          }
                        }}
                        onPointerUp={(event) => {
                          const pointerStart = galleryPointerStartRef.current;
                          if (pointerStart && pointerStart.pointerId === event.pointerId && pointerStart.renderIndex === renderIndex && pointerStart.moved) {
                            galleryIgnoreClickIndexRef.current = renderIndex;
                          }
                          galleryPointerStartRef.current = null;
                          galleryIsInteractingRef.current = false;
                        }}
                        onPointerCancel={() => {
                          galleryPointerStartRef.current = null;
                          galleryIsInteractingRef.current = false;
                        }}
                        aria-busy={!isLoaded}
                        aria-current={isActiveRenderSlide}
                        className={`gallery-slide group relative h-[278px] min-w-[86%] flex-none overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(45,44,39,0.72),rgba(23,22,19,0.96))] p-[1.5px] text-left shadow-[0_0_0_1px_rgba(29,28,24,0.78),0_18px_44px_rgba(0,0,0,0.18)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 md:h-[378px] md:min-w-[48%] ${
                          isLoaded ? 'gallery-slide-loaded' : 'cursor-progress'
                        }`}
                      >
                        <div className="absolute inset-px rounded-[1.86rem] bg-[linear-gradient(180deg,rgba(24,23,20,0.74),rgba(14,14,12,0.9))]" />
                        <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-charcoal">
                          {/* eslint-disable-next-line @next/next/no-img-element -- Native img keeps looped rail interaction smoother with continuous autoplay. */}
                          <img
                            src={imageSourceWithSeed}
                            alt={`Атмосфера клуба — фото ${logicalIndex + 1}`}
                            className={`gallery-card-image absolute inset-0 h-full w-full object-cover object-center ${isLoaded ? 'is-loaded' : ''}`}
                            style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%`, transformOrigin: `${focalPoint.x}% ${focalPoint.y}%` }}
                            loading={shouldEagerLoad ? 'eager' : 'lazy'}
                            fetchPriority={shouldPrioritizeLoad ? 'high' : 'auto'}
                            decoding="async"
                            onLoad={() => {
                              setGalleryImageStates((prev) => (prev[logicalIndex] === 'loaded' ? prev : { ...prev, [logicalIndex]: 'loaded' }));
                            }}
                            onError={() => {
                              setGalleryImageStates((prev) => (prev[logicalIndex] === 'error' ? prev : { ...prev, [logicalIndex]: 'error' }));
                            }}
                          />
                          {imageState === 'loading' && (
                            <div className="gallery-card-state gallery-card-state-loading absolute inset-0" />
                          )}
                          {imageState === 'error' && (
                            <div className="gallery-card-state gallery-card-state-error absolute inset-0 flex items-center justify-center px-4">
                              <div className="text-center">
                                <p className="premium-body text-[0.82rem] text-soft/78">Не удалось загрузить фото</p>
                                <p className="premium-body mt-1.5 text-[0.72rem] text-soft/62">Нажмите, чтобы открыть просмотр</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/0 opacity-78 transition-opacity duration-400 group-hover:opacity-86" />
                          <div className="absolute inset-0 rounded-[1.65rem] shadow-[inset_0_0_0_1px_rgba(60,58,52,0.18)]" />
                          <div className="pointer-events-none absolute inset-[1px] rounded-[1.58rem] bg-[radial-gradient(circle_at_18%_22%,rgba(200,214,0,0.01),transparent_18%)] opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.12]" />
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
                {gallerySlides.length > 1 && (
                  <>
                    <GalleryArrowButton direction="prev" onClick={goGalleryPrev} />
                    <GalleryArrowButton direction="next" onClick={goGalleryNext} />
                  </>
                )}
              </div>
            ) : (
              <div className="gallery-loading-shell rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.016))] px-2.5 pt-2.5 pb-3 md:px-3.5 md:pt-3 md:pb-3.5">
                <div className="-mx-4 flex gap-[0.55rem] overflow-hidden px-4 pb-2.5 md:gap-[0.68rem]">
                  {[0, 1].map((placeholderIndex) => (
                    <div
                      key={`gallery-loading-${placeholderIndex}`}
                      className="gallery-loading-card relative h-[278px] min-w-[86%] flex-none overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(45,44,39,0.72),rgba(23,22,19,0.96))] p-[1.5px] md:h-[378px] md:min-w-[48%]"
                    >
                      <div className="absolute inset-px rounded-[1.86rem] bg-[linear-gradient(180deg,rgba(24,23,20,0.74),rgba(14,14,12,0.9))]" />
                      <div className="gallery-loading-shimmer absolute inset-[6px] rounded-[1.58rem]" />
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-0.5">
                  <p className="premium-body text-[0.83rem] text-soft/74">
                    {galleryPreloadError ? 'Не удалось загрузить фотографии. Попробуйте ещё раз.' : 'Загружаем фотографии клуба…'}
                  </p>
                  {galleryPreloadError && (
                    <button
                      type="button"
                      onClick={retryGalleryLoad}
                      className="ghost-button mt-3 px-4 py-2 text-[0.76rem] font-medium"
                    >
                      Повторить загрузку
                    </button>
                  )}
                </div>
              </div>
            )
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
              transition={{ duration: motionDurations.revealCard, delay: categoryIndex * 0.05, ease: easeOut }}
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
                    onClick={(event) => {
                      if (programChipIgnoreClickRef.current) {
                        programChipIgnoreClickRef.current = false;
                        event.preventDefault();
                        return;
                      }
                      openProgramPanel(item);
                    }}
                    onPointerDown={(event) => {
                      if (event.pointerType !== 'touch') {
                        programChipPointerStartRef.current = null;
                        return;
                      }
                      programChipIgnoreClickRef.current = false;
                      programChipPointerStartRef.current = {
                        pointerId: event.pointerId,
                        x: event.clientX,
                        y: event.clientY,
                        moved: false
                      };
                    }}
                    onPointerMove={(event) => {
                      const pointerStart = programChipPointerStartRef.current;
                      if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
                      const deltaX = Math.abs(event.clientX - pointerStart.x);
                      const deltaY = Math.abs(event.clientY - pointerStart.y);
                      if (deltaY > GALLERY_TAP_CANCEL_DISTANCE || deltaX > GALLERY_TAP_CANCEL_DISTANCE) {
                        pointerStart.moved = true;
                        programChipIgnoreClickRef.current = true;
                      }
                    }}
                    onPointerUp={(event) => {
                      const pointerStart = programChipPointerStartRef.current;
                      if (pointerStart && pointerStart.pointerId === event.pointerId) {
                        if (!pointerStart.moved) {
                          openProgramPanel(item);
                        }
                        programChipIgnoreClickRef.current = true;
                      }
                      programChipPointerStartRef.current = null;
                    }}
                    onPointerCancel={() => {
                      programChipPointerStartRef.current = null;
                      programChipIgnoreClickRef.current = true;
                    }}
                    className={`program-card-chip premium-chip touch-pan-y rounded-full border px-3.5 py-[0.58rem] text-[0.72rem] font-medium transition ${
                      selectedProgram === item && programPanelOpen
                        ? 'program-card-chip-active'
                        : 'hover:border-lime/28 hover:bg-white/[0.06] hover:text-white'
                    }`}
                    whileHover={{ y: -0.5 }}
                    whileTap={{ scale: 0.985 }}
                    transition={interactiveTransition}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
        <motion.h2 variants={itemReveal} className="premium-display text-[2rem] font-semibold tracking-[-0.034em] text-white md:text-[2.3rem]">
          Клубные карты и персональный тренинг
        </motion.h2>
        <p className="tariff-section-subtitle premium-body mt-3 max-w-[44rem] text-[0.98rem] text-soft/80 md:text-[1.02rem]">
          Выберите формат тренировок, который подходит именно вам — от свободного посещения клуба до индивидуального сопровождения с тренером.
        </p>

        <div className="tariff-quick-grid mt-8 grid gap-4 md:mt-9 md:grid-cols-3">
          {tariffQuickFormats.map((format, index) => (
            <motion.button
              key={format.title}
              type="button"
              onClick={() => scrollToTariffSection(format.targetId)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2.5 }}
              whileTap={{ scale: 0.992 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: motionDurations.revealItem, delay: index * 0.04, ease: easeOut }}
              className="tariff-quick-card tariff-quick-card-action rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-[1.1rem] py-[1.08rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/35 md:px-[1.2rem] md:py-[1.16rem]"
            >
              <p className="tariff-quick-title premium-display text-[1.02rem] font-semibold text-white">{format.title}</p>
              <p className="tariff-quick-copy premium-body mt-1.5 text-[0.84rem] text-soft/76">{format.subtitle}</p>
              <p className="tariff-quick-price premium-display mt-3.5 text-[1.03rem] font-semibold text-lime/94">{format.price}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-11 space-y-7 md:mt-12 md:space-y-8">
          <motion.article
            id="tariff-club-cards"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: motionDurations.revealCard, ease: easeOut }}
            className="tariff-card tariff-card-standard rounded-[2rem] p-[1.45rem] shadow-card premium-transition md:p-[1.85rem]"
          >
            <p className="tariff-kicker premium-label text-[0.62rem] uppercase tracking-[0.3em] text-lime/85 md:text-[0.66rem]">Действующие тарифы клуба ENERGY с 12.01.2026</p>
            <h3 className="tariff-title premium-display mt-3 text-[1.34rem] font-semibold text-lime/94 md:text-[1.5rem]">Клубные карты</h3>
            <p className="tariff-meta-line premium-chip mt-2 text-[0.77rem] text-soft/68 md:text-[0.79rem]">Выберите срок действия клубной карты</p>
            <div className="mt-5 overflow-x-auto">
              <table className="pricing-table min-w-[760px]">
                <thead>
                  <tr>
                    <th>Формат клубной карты</th>
                    {clubCardColumns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clubCardRows.map((row) => (
                    <tr key={`${row.name}-${row.time}`}>
                      <td>
                        <p className="font-medium leading-[1.4] text-[#f0eee2]">{row.name}</p>
                        <p className="mt-1 leading-relaxed text-soft/72">{row.note}</p>
                        <p className="mt-1 leading-relaxed text-soft/64">{row.time}</p>
                      </td>
                      {row.prices.map((price, index) => (
                        <td key={`${row.time}-${clubCardColumns[index]}`} className="tariff-price">{price}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.article>

          <motion.article
            id="tariff-subscriptions"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: motionDurations.revealCard, delay: 0.05, ease: easeOut }}
            className="tariff-card tariff-card-standard rounded-[2rem] p-[1.45rem] shadow-card premium-transition md:p-[1.85rem]"
          >
            <h3 className="tariff-title premium-display text-[1.34rem] font-semibold text-lime/94 md:text-[1.5rem]">Абонементы на посещение</h3>
            <p className="tariff-meta-line premium-chip mt-2 text-[0.77rem] text-soft/68 md:text-[0.79rem]">Выберите формат посещения и подходящий тариф</p>
            <div className="tariff-plan-grid mt-5 grid gap-5 md:grid-cols-2 md:[grid-auto-rows:1fr]">
              {subscriptionPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`tariff-plan-card flex h-full flex-col rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-[1.06rem] md:p-[1.22rem] ${
                    plan.featured || plan.featuredBadge ? 'tariff-plan-card-featured' : ''
                  } ${!plan.featuredBadge ? 'tariff-plan-card-muted' : ''} ${plan.featuredBadge ? 'tariff-plan-card-popular tariff-plan-card-primary' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="tariff-plan-title premium-display text-[1rem] font-semibold tracking-[-0.016em] text-white">{plan.name}</h4>
                      {plan.featuredBadge && (
                        <span className="tariff-plan-badge tariff-plan-badge-popular premium-label mt-2.5 inline-flex items-center rounded-[0.78rem] border px-3 py-1.5 text-[0.67rem] font-semibold uppercase tracking-[0.17em]">
                          {plan.featuredBadge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`tariff-plan-price premium-display shrink-0 rounded-full px-3.5 py-1.5 text-[0.84rem] font-semibold ${
                        plan.featuredBadge ? 'tariff-plan-price-accent tariff-plan-price-popular' : 'tariff-plan-price-secondary'
                      }`}
                    >
                      {plan.fromPrice}
                    </span>
                  </div>
                  <p className="tariff-plan-summary premium-body mt-2.5 text-[0.9rem] text-soft/84">{plan.summary}</p>
                  {plan.descriptor && <p className="tariff-plan-note premium-body mt-1.5 text-[0.78rem] text-soft/62">{plan.descriptor}</p>}
                  <div className="mt-3.5 flex-1 space-y-3">
                    {plan.lines.map((line) => (
                      <div key={`${plan.name}-${line.label}`} className="tariff-plan-line flex items-start justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                        <span className="tariff-line-label premium-body text-[0.84rem] text-soft/78">{line.label}</span>
                        <span className={`tariff-line-value tariff-price premium-display text-[1rem] ${plan.featuredBadge ? 'tariff-line-value-popular' : ''}`}>{line.value}</span>
                      </div>
                    ))}
                  </div>
                  {plan.note && <p className="premium-body mt-3 text-[0.76rem] text-soft/66">{plan.note}</p>}
                </article>
              ))}
            </div>

            <div className="tariff-one-time-block mt-5 rounded-[1.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-[1.08rem] md:p-[1.3rem]">
              <div className="flex items-start justify-between gap-3">
                <h4 className="premium-display text-[1.04rem] font-semibold tracking-[-0.016em] text-white">{oneTimeVisitPlan.name}</h4>
                <span className="tariff-plan-price tariff-plan-price-accent premium-display shrink-0 rounded-full border border-lime/30 bg-[linear-gradient(180deg,rgba(200,214,0,0.22),rgba(200,214,0,0.1))] px-3.5 py-1.5 text-[0.84rem] font-semibold text-lime/95">
                  {oneTimeVisitPlan.fromPrice}
                </span>
              </div>
              <p className="premium-body mt-2.5 text-[0.9rem] text-soft/84">{oneTimeVisitPlan.summary}</p>
              <div className="mt-3.5 space-y-3">
                {oneTimeVisitPlan.lines.map((line) => (
                  <div key={`one-time-${line.label}`} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                    <span className="tariff-line-label premium-body text-[0.84rem] text-soft/78">{line.label}</span>
                    <span className="tariff-line-value tariff-price premium-display text-[1rem]">{line.value}</span>
                  </div>
                ))}
              </div>
              {oneTimeVisitPlan.note && <p className="premium-body mt-3.5 text-[0.76rem] text-soft/68">{oneTimeVisitPlan.note}</p>}
            </div>
          </motion.article>

          <motion.article
            id="tariff-personal-training"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: motionDurations.revealCard, delay: 0.1, ease: easeOut }}
            className="tariff-card tariff-card-featured rounded-[2rem] p-[1.45rem] shadow-card premium-transition md:p-[1.85rem]"
          >
            <p className="tariff-kicker premium-label text-[0.62rem] uppercase tracking-[0.3em] text-lime/85 md:text-[0.66rem]">Действующие тарифы персонального тренинга клуба ENERGY с 12.01.2026</p>
            <h3 className="tariff-title premium-display mt-3 text-[1.34rem] font-semibold text-lime/94 md:text-[1.5rem]">Персональный тренинг</h3>
            <p className="tariff-subtitle premium-display mt-1.5 text-[1.04rem] font-medium text-[#f5f2e9] md:text-[1.08rem]">Выберите формат персональных тренировок</p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="tariff-group-title premium-label text-[0.67rem] uppercase tracking-[0.19em] text-lime/88">Индивидуальные форматы</p>
                <div className="tariff-personal-grid mt-3 grid gap-5 md:grid-cols-2 md:[grid-auto-rows:1fr]">
                  {personalTrainingIndividualPlans.map((plan) => (
                    <article key={plan.name} className="tariff-personal-card flex h-full flex-col rounded-[1.3rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.022))] p-[1.06rem] md:p-[1.22rem]">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="premium-display text-[1rem] font-semibold tracking-[-0.016em] text-white">{plan.name}</h4>
                        <span className="tariff-plan-price tariff-plan-price-accent premium-display shrink-0 rounded-full border border-lime/30 bg-[linear-gradient(180deg,rgba(200,214,0,0.22),rgba(200,214,0,0.1))] px-3.5 py-1.5 text-[0.84rem] font-semibold text-lime/95">
                          {plan.fromPrice}
                        </span>
                      </div>
                      <p className="premium-body mt-2.5 text-[0.9rem] text-soft/84">{plan.summary}</p>
                      <div className="mt-3.5 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5">
                          <span className="tariff-line-label premium-body text-[0.84rem] text-soft/80">Мастер-тренер</span>
                          <span className="tariff-line-value tariff-price premium-display text-[1rem]">{plan.master}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="tariff-line-label premium-body text-[0.84rem] text-soft/80">Тренер</span>
                          <span className="tariff-line-value tariff-price premium-display text-[1rem]">{plan.trainer}</span>
                        </div>
                      </div>
                      {plan.note && <p className="premium-body mt-3.5 text-[0.79rem] text-soft/70">{plan.note}</p>}
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <p className="tariff-group-title premium-label text-[0.67rem] uppercase tracking-[0.19em] text-lime/88">Форматы с несколькими участниками</p>
                <div className="tariff-personal-grid mt-3 grid gap-5 md:grid-cols-2 md:[grid-auto-rows:1fr]">
                  {personalTrainingGroupPlans.map((plan) => (
                    <article key={plan.name} className="tariff-personal-card flex h-full flex-col rounded-[1.3rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.022))] p-[1.06rem] md:p-[1.22rem]">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="premium-display text-[1rem] font-semibold tracking-[-0.016em] text-white">{plan.name}</h4>
                        <span className="tariff-plan-price tariff-plan-price-accent premium-display shrink-0 rounded-full border border-lime/30 bg-[linear-gradient(180deg,rgba(200,214,0,0.22),rgba(200,214,0,0.1))] px-3.5 py-1.5 text-[0.84rem] font-semibold text-lime/95">
                          {plan.fromPrice}
                        </span>
                      </div>
                      <p className="premium-body mt-2.5 text-[0.9rem] text-soft/84">{plan.summary}</p>
                      <div className="mt-3.5 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5">
                          <span className="tariff-line-label premium-body text-[0.84rem] text-soft/80">Мастер-тренер</span>
                          <span className="tariff-line-value tariff-price premium-display text-[1rem]">{plan.master}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="tariff-line-label premium-body text-[0.84rem] text-soft/80">Тренер</span>
                          <span className="tariff-line-value tariff-price premium-display text-[1rem]">{plan.trainer}</span>
                        </div>
                      </div>
                      {plan.note && <p className="premium-body mt-3.5 text-[0.79rem] text-soft/70">{plan.note}</p>}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="tariff-personal-extra mt-6 rounded-[1.2rem] border border-lime/20 bg-[linear-gradient(180deg,rgba(200,214,0,0.13),rgba(200,214,0,0.06))] px-[1.1rem] py-[0.95rem] md:px-[1.25rem] md:py-[1.05rem]">
              <p className="premium-label text-[0.66rem] uppercase tracking-[0.2em] text-lime/90">Клубная карта для персонального формата</p>
              <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
                <p className="premium-body text-[0.84rem] text-soft/86">1 570 ₽ клубная карта</p>
                <p className="premium-body text-[0.84rem] text-soft/86">1 200 ₽ клубная карта (дети)</p>
              </div>
            </div>
            <p className="premium-body mt-5 text-[0.82rem] leading-relaxed text-soft/74 md:text-[0.84rem]">* Продолжительность персональной тренировки — 1 час. Для более длительного пребывания в клубе требуется клубная карта.</p>
          </motion.article>
        </div>

        <div className="mt-10 flex justify-center md:mt-11">
          <motion.button
            type="button"
            onClick={() => setCallModal(true)}
            className="brand-button tariff-cta-button premium-transition"
            {...ctaMotion}
            transition={interactiveTransition}
          >
            Подобрать тариф
          </motion.button>
        </div>
      </motion.section>

      <motion.section id="schedule" className="section-shell section-accent pt-16" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <motion.article
          role="button"
          tabIndex={0}
          onClick={openSchedule}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openSchedule();
            }
          }}
          variants={softPanelReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          whileHover={{ y: -3, scale: 1.003 }}
          whileTap={{ scale: 0.992 }}
          transition={interactiveTransition}
          className="schedule-spotlight schedule-spotlight-entry glass-card relative mt-8 block w-full overflow-hidden rounded-[2rem] border border-white/10 p-[1.35rem] text-left shadow-card outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/35 md:mt-9 md:p-[1.6rem]"
          aria-label="Открыть полное расписание тренировок"
        >
          <span aria-hidden="true" className="schedule-spotlight-backdrop" />
          <span aria-hidden="true" className="schedule-spotlight-sheen" />
          <div className="schedule-spotlight-layout">
            <div className="schedule-spotlight-content">
              <p className="schedule-spotlight-kicker premium-label text-[0.64rem] uppercase tracking-[0.25em] text-lime/84">Групповые занятия</p>
              <h2 className="schedule-spotlight-title premium-display mt-3 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">Расписание тренировок</h2>
              <p className="schedule-spotlight-subtitle premium-body mt-2 text-[0.96rem] text-soft/78 md:text-[1.01rem]">Актуально на неделю</p>
              <p className="schedule-spotlight-description premium-body mt-4 text-[0.9rem] text-soft/72 md:text-[0.95rem]">
                Актуальное расписание всех групповых направлений клуба в одном просмотре.
              </p>
              <div className="schedule-spotlight-actions mt-6 flex flex-wrap items-center gap-3.5">
                <span className="schedule-spotlight-cta premium-transition inline-flex items-center gap-2.5 rounded-full px-4.5 py-2.5 text-white">
                  <span aria-hidden="true" className="schedule-spotlight-cta-dot" />
                  <span className="premium-display text-[0.8rem] font-medium tracking-[0.03em] text-soft/92">Открыть расписание</span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
                    <path d="M6.5 10H13.5M10.5 7L13.5 10L10.5 13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="schedule-spotlight-note premium-label text-[0.62rem] uppercase tracking-[0.18em] text-soft/58">Обновляется еженедельно</span>
              </div>
            </div>

            <div className="schedule-spotlight-preview-shell">
              <div className="schedule-spotlight-preview-frame">
                <span aria-hidden="true" className="schedule-spotlight-preview-topline">
                  <span className="schedule-spotlight-preview-led" />
                  <span className="schedule-spotlight-preview-led schedule-spotlight-preview-led-muted" />
                </span>
                <Image
                  src={SCHEDULE_SPOTLIGHT_IMAGE_URL}
                  alt="Актуальное расписание клуба"
                  fill
                  sizes="(max-width: 768px) 100vw, 46vw"
                  priority
                  className={`schedule-spotlight-preview-image ${schedulePreviewLoaded ? 'is-loaded' : ''}`}
                  onLoad={() => setSchedulePreviewLoaded(true)}
                />
                <div aria-hidden="true" className="schedule-spotlight-preview-overlay">
                  <span className="schedule-spotlight-preview-orb" />
                  <span className="schedule-spotlight-preview-badge premium-label text-[0.58rem] uppercase tracking-[0.16em] text-soft/74">
                    Актуальное
                  </span>
                  <span className="schedule-spotlight-preview-trigger">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
                      <path d="M6.5 10H13.5M10.5 7L13.5 10L10.5 13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
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
              transition={{ duration: motionDurations.revealItem, delay: index * 0.03, ease: easeOut }}
              className="faq-item glass-card rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.038),rgba(255,255,255,0.02))]"
            >
              <button className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left md:px-5.5 md:py-5" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span className="faq-question premium-display text-[1rem] font-medium tracking-[-0.018em] md:text-[1.04rem]">{entry.q}</span>
                <motion.span
                  animate={{ scale: activeFaq === index ? 1.02 : 1 }}
                  transition={{ duration: motionDurations.standard, ease: easeOut }}
                  className="faq-indicator inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="faq-indicator-mark h-[1rem] w-[1rem]">
                    <path d="M5.25 10H14.75" />
                    <motion.path
                      d="M10 5.25V14.75"
                      animate={{ opacity: activeFaq === index ? 0 : 1, scaleY: activeFaq === index ? 0.7 : 1 }}
                      transition={{ duration: motionDurations.micro, ease: easeOut }}
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
                transition={{ duration: motionDurations.standard, ease: easeOut }}
                className="faq-answer-wrap grid"
              >
                <div className="overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{
                      y: activeFaq === index ? 0 : -8,
                      opacity: activeFaq === index ? 1 : 0
                    }}
                    transition={{ duration: motionDurations.standard, ease: easeOut }}
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
                    transition={interactiveTransition}
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
                  transition={interactiveTransition}
                >
                  Построить маршрут
                </motion.a>
                <motion.button
                  type="button"
                  onClick={() => setCallModal(true)}
                  className="ghost-button premium-transition"
                  {...ctaMotion}
                  transition={interactiveTransition}
                >
                  Позвонить
                </motion.button>
                <motion.a
                  href="https://vk.com/fitnesenergysarapul"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="ENERGY во ВКонтакте"
                  className="social-icon-button"
                  whileHover={{ y: -1.2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={interactiveTransition}
                >
                  <svg aria-hidden="true" viewBox="0 0 13 13" className="h-[1.02rem] w-[1.02rem] fill-current">
                    <path d="M.063 3.34C.165 8.222 2.606 11.153 6.887 11.153h.242V8.36c1.57.157 2.756 1.305 3.232 2.793h2.219c-.61-2.224-2.213-3.454-3.214-3.927 1.001-.578 2.4-1.986 2.737-3.886H10.087c-.439 1.54-1.727 2.95-2.958 3.08V3.34H5.111v5.392c-1.246-.31-2.832-1.827-2.903-5.392H.063z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/fitness__energy_18?igsh=ZXVxcWFsMnhqdWs5"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="ENERGY в Instagram"
                  className="social-icon-button"
                  whileHover={{ y: -1.2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={interactiveTransition}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.02rem] w-[1.02rem]" fill="none">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
                  </svg>
                </motion.a>
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
          <AnimatePresence>
            {showScrollTop && !isAnyOverlayOpen && (
              <motion.button
                type="button"
                onClick={scrollPageToTop}
                className="scroll-top-fab fixed bottom-[calc(5.45rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[121] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 text-soft shadow-[0_16px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden"
                aria-label="Прокрутить наверх"
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                whileTap={{ scale: 0.94 }}
                transition={interactiveTransition}
              >
                <span aria-hidden="true" className="scroll-top-fab-glow" />
                <svg aria-hidden="true" viewBox="0 0 20 20" className="relative h-[0.96rem] w-[0.96rem]">
                  <path d="M10 14.5V5.5M6.6 8.9L10 5.5L13.4 8.9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>,
          document.body
        )}

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
            transition={interactiveTransition}
          >
            <span className="pointer-events-none absolute inset-[1px] rounded-full border border-white/35 opacity-50" />
            <svg aria-hidden="true" viewBox="0 0 24 24" className="relative h-[1.42rem] w-[1.42rem]" fill="none">
              <defs>
                <linearGradient id="mobile-call-highlight" x1="7.2" y1="6.1" x2="16.6" y2="16.9" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#F7F7F2" stopOpacity="0.88" />
                  <stop offset="0.58" stopColor="#F7F7F2" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#F7F7F2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M9.06 4.55c0.56-0.32 1.18-0.17 1.52 0.33l1.08 1.62c0.29 0.44 0.28 1.02-0.02 1.45l-0.68 0.96c-0.15 0.22-0.18 0.49-0.08 0.73c0.58 1.37 1.62 2.65 3.06 3.82c0.22 0.17 0.51 0.2 0.75 0.06l1.12-0.62c0.46-0.25 1.01-0.2 1.42 0.12l1.45 1.13c0.47 0.37 0.59 1.02 0.28 1.54c-0.49 0.83-1.34 1.45-2.31 1.46c-1.62 0.03-3.76-0.88-6.02-3.14c-2.27-2.27-3.19-4.44-3.16-6.07c0.02-0.97 0.65-1.8 1.59-2.39Z"
                fill="#25231F"
              />
              <path
                d="M10.17 6.26l0.88 1.29c0.11 0.16 0.11 0.38 0 0.54l-0.53 0.75c-0.26 0.37-0.31 0.84-0.11 1.25c0.67 1.41 1.76 2.74 3.26 3.92c0.4 0.32 0.93 0.37 1.37 0.13l0.85-0.47c0.17-0.1 0.39-0.08 0.55 0.04l1.17 0.9"
                stroke="url(#mobile-call-highlight)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.05"
              />
              <path
                d="M9.56 5.42c0.18-0.11 0.4-0.06 0.52 0.12l0.52 0.77"
                stroke="#F7F7F2"
                strokeLinecap="round"
                strokeWidth="0.72"
                opacity="0.65"
              />
            </svg>
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
                transition={{ duration: motionDurations.overlay, ease: easeOut }}
                className="fixed inset-0 z-[88] flex items-start justify-center bg-black/58 p-4 backdrop-blur-[8px] md:items-center"
                onClick={closeProgramPanel}
              >
                <motion.aside
                  initial={{ opacity: 0, y: 24, scale: 0.982 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.988 }}
                  transition={{ duration: motionDurations.panel, ease: easeOut }}
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
                        transition={{ duration: motionDurations.standard, ease: easeOut }}
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
                          transition={interactiveTransition}
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
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) {
                    lightboxOverlayPointerRef.current = { x: event.clientX, y: event.clientY };
                  } else {
                    lightboxOverlayPointerRef.current = null;
                  }
                }}
                onPointerUp={(event) => {
                  const pointerStart = lightboxOverlayPointerRef.current;
                  lightboxOverlayPointerRef.current = null;

                  if (!pointerStart || event.target !== event.currentTarget) return;

                  const deltaX = Math.abs(event.clientX - pointerStart.x);
                  const deltaY = Math.abs(event.clientY - pointerStart.y);

                  if (deltaX < 10 && deltaY < 10) {
                    closeLightbox();
                  }
                }}
                onPointerCancel={() => {
                  lightboxOverlayPointerRef.current = null;
                }}
              >
                <motion.div
                  initial={{ scale: 0.984, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.99, opacity: 0, y: 10 }}
                  transition={lightboxPanelTransition}
                  className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-7xl items-center justify-center overflow-hidden rounded-[1.95rem] border border-white/10 bg-charcoal/72 p-2.5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] md:max-h-[calc(100dvh-3rem)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lightboxMode === 'gallery' && clubImages.length > 1 && lightboxImageState === 'loaded' && (
                    <>
                      <LightboxArrowButton direction="prev" onClick={prev} />
                      <LightboxArrowButton direction="next" onClick={next} />
                    </>
                  )}
                  <div className="absolute right-3 top-3 z-10">
                    <ModalCloseButton onClick={closeLightbox} />
                  </div>
                  <div
                    ref={lightboxViewportRef}
                    className={`relative flex max-h-[calc(100dvh-5rem)] min-h-0 w-full touch-none items-center justify-center overflow-hidden rounded-[1.4rem] md:max-h-[calc(100dvh-8rem)] ${
                      zoom > LIGHTBOX_ZOOM_EPSILON ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                    onTouchStart={(e) => {
                      if (e.touches.length === 1) {
                        const touch = e.touches[0];
                        lightboxTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
                        lightboxSwipeTriggeredRef.current = false;
                        if (zoomRef.current > LIGHTBOX_ZOOM_EPSILON) {
                          lightboxPanStartRef.current = {
                            x: touch.clientX,
                            y: touch.clientY,
                            originX: lightboxOffset.x,
                            originY: lightboxOffset.y
                          };
                        } else {
                          lightboxPanStartRef.current = null;
                        }
                      }
                      if (e.touches.length === 2) {
                        lightboxPinchDistanceRef.current = Math.hypot(
                          e.touches[0].clientX - e.touches[1].clientX,
                          e.touches[0].clientY - e.touches[1].clientY
                        );
                        lightboxTouchStartRef.current = null;
                        lightboxSwipeTriggeredRef.current = false;
                        lightboxPanStartRef.current = null;
                      }
                    }}
                    onTouchMove={(e) => {
                      if (e.touches.length === 2 && lightboxPinchDistanceRef.current) {
                        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                        const pinchDistance = lightboxPinchDistanceRef.current;
                        const midpoint = {
                          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
                        };
                        const nextZoom = Math.min(LIGHTBOX_MAX_ZOOM, Math.max(1, zoomRef.current * (d / pinchDistance)));
                        applyLightboxZoom(nextZoom, midpoint);
                        lightboxPinchDistanceRef.current = d;
                        return;
                      }
                      if (e.touches.length === 1 && zoomRef.current > LIGHTBOX_ZOOM_EPSILON && lightboxPanStartRef.current) {
                        const panStart = lightboxPanStartRef.current;
                        const nextX = panStart.originX + (e.touches[0].clientX - panStart.x);
                        const nextY = panStart.originY + (e.touches[0].clientY - panStart.y);
                        const nextOffset = clampLightboxOffset(nextX, nextY, zoomRef.current);
                        lightboxOffsetRef.current = nextOffset;
                        setLightboxOffset(nextOffset);
                        return;
                      }
                      if (
                        e.touches.length === 1 &&
                        lightboxTouchStartRef.current &&
                        !lightboxSwipeTriggeredRef.current &&
                        zoomRef.current <= LIGHTBOX_ZOOM_EPSILON &&
                        lightboxMode === 'gallery'
                      ) {
                        const delta = e.touches[0].clientX - lightboxTouchStartRef.current.x;
                        const deltaY = e.touches[0].clientY - lightboxTouchStartRef.current.y;
                        const isIntentionalHorizontalSwipe = Math.abs(delta) > Math.abs(deltaY) * LIGHTBOX_SWIPE_AXIS_RATIO;

                        if (isIntentionalHorizontalSwipe && delta > LIGHTBOX_SWIPE_THRESHOLD) {
                          prev();
                          lightboxSwipeTriggeredRef.current = true;
                          pauseGalleryAutoplay(GALLERY_AUTOPLAY_TOUCH_PAUSE_MS);
                        } else if (isIntentionalHorizontalSwipe && delta < -LIGHTBOX_SWIPE_THRESHOLD) {
                          next();
                          lightboxSwipeTriggeredRef.current = true;
                          pauseGalleryAutoplay(GALLERY_AUTOPLAY_TOUCH_PAUSE_MS);
                        }
                      }
                    }}
                    onTouchEnd={(e) => {
                      const now = Date.now();
                      if (e.changedTouches.length === 1 && !lightboxSwipeTriggeredRef.current && lightboxPinchDistanceRef.current === null) {
                        const touch = e.changedTouches[0];
                        if (now - lightboxLastTapAtRef.current < 280) {
                          const nextZoom = zoomRef.current > LIGHTBOX_ZOOM_EPSILON ? 1 : 2;
                          applyLightboxZoom(nextZoom, nextZoom > 1 ? { x: touch.clientX, y: touch.clientY } : undefined);
                          lightboxLastTapAtRef.current = 0;
                        } else {
                          lightboxLastTapAtRef.current = now;
                        }
                      }

                      lightboxPanStartRef.current = null;
                      lightboxTouchStartRef.current = null;
                      lightboxPinchDistanceRef.current = null;
                      lightboxSwipeTriggeredRef.current = false;
                      if (zoomRef.current < 1.03) {
                        setZoom(1);
                        zoomRef.current = 1;
                        setLightboxOffset({ x: 0, y: 0 });
                        lightboxOffsetRef.current = { x: 0, y: 0 };
                      } else {
                        setLightboxOffset((offset) => {
                          const nextOffset = clampLightboxOffset(offset.x, offset.y, zoomRef.current);
                          lightboxOffsetRef.current = nextOffset;
                          return nextOffset;
                        });
                      }
                    }}
                    onTouchCancel={() => {
                      lightboxPanStartRef.current = null;
                      lightboxTouchStartRef.current = null;
                      lightboxPinchDistanceRef.current = null;
                      lightboxSwipeTriggeredRef.current = false;
                    }}
                    onPointerDown={(event) => {
                      if (event.pointerType !== 'mouse' || event.button !== 0 || zoomRef.current <= LIGHTBOX_ZOOM_EPSILON) return;
                      lightboxMousePanRef.current = {
                        pointerId: event.pointerId,
                        x: event.clientX,
                        y: event.clientY,
                        originX: lightboxOffset.x,
                        originY: lightboxOffset.y
                      };
                      try {
                        event.currentTarget.setPointerCapture(event.pointerId);
                      } catch {
                        /* no-op */
                      }
                    }}
                    onPointerMove={(event) => {
                      const mousePan = lightboxMousePanRef.current;
                      if (!mousePan || mousePan.pointerId !== event.pointerId) return;
                      const nextX = mousePan.originX + (event.clientX - mousePan.x);
                      const nextY = mousePan.originY + (event.clientY - mousePan.y);
                      const nextOffset = clampLightboxOffset(nextX, nextY, zoomRef.current);
                      lightboxOffsetRef.current = nextOffset;
                      setLightboxOffset(nextOffset);
                    }}
                    onPointerUp={(event) => {
                      const mousePan = lightboxMousePanRef.current;
                      if (!mousePan || mousePan.pointerId !== event.pointerId) return;
                      lightboxMousePanRef.current = null;
                      try {
                        event.currentTarget.releasePointerCapture(event.pointerId);
                      } catch {
                        /* no-op */
                      }
                    }}
                    onPointerCancel={(event) => {
                      lightboxMousePanRef.current = null;
                      try {
                        event.currentTarget.releasePointerCapture(event.pointerId);
                      } catch {
                        /* no-op */
                      }
                    }}
                  >
                    <motion.img
                      key={`${currentPhoto}-${lightboxRetryAttempt}`}
                      src={currentPhoto}
                      alt={lightboxMode === 'schedule' ? 'Полное расписание клуба' : 'Фото клуба'}
                      className={`max-h-[88vh] max-w-full object-contain transition-all duration-220 ${
                        lightboxImageState === 'loaded' ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transform: `translate3d(${lightboxOffset.x}px, ${lightboxOffset.y}px, 0) scale(${zoom})` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={lightboxImageTransition}
                      onLoad={() => setLightboxImageState('loaded')}
                      onError={() => setLightboxImageState('error')}
                      onDoubleClick={(event) => {
                        const nextZoom = zoomRef.current > LIGHTBOX_ZOOM_EPSILON ? 1 : 2;
                        applyLightboxZoom(nextZoom, nextZoom > 1 ? { x: event.clientX, y: event.clientY } : undefined);
                      }}
                    />
                    {lightboxImageState === 'loading' && (
                      <div className="absolute inset-0 z-[2] flex items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(200,214,0,0.12),rgba(16,16,14,0.74)_62%)]">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/24 border-t-lime/80" />
                          <p className="premium-body text-[0.85rem] text-soft/80">Загружаем изображение…</p>
                        </div>
                      </div>
                    )}
                    {lightboxImageState === 'error' && (
                      <div className="absolute inset-0 z-[3] flex items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(200,214,0,0.08),rgba(14,14,12,0.8)_62%)] px-5">
                        <div className="w-full max-w-md rounded-2xl border border-white/12 bg-black/42 p-5 text-center">
                          <p className="premium-display text-[1rem] font-semibold text-white">Не удалось загрузить изображение</p>
                          <p className="premium-body mt-2 text-[0.84rem] text-soft/74">Проверьте соединение и попробуйте ещё раз.</p>
                          <button
                            type="button"
                            onClick={retryCurrentPhoto}
                            className="brand-button mt-4 px-5 py-2.5 text-[0.78rem] font-semibold"
                          >
                            Повторить
                          </button>
                        </div>
                      </div>
                    )}
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

