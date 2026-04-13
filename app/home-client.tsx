'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type DaySchedule = { day: string; classes: string[] };
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
    featuredBadge: 'ПОПУЛЯРНЫЙ'
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

const scheduleByDay: DaySchedule[] = [
  { day: 'Пн', classes: ['07:30 - ФИТНЕС ЙОГА', '09:00 - ЗДОРОВАЯ СПИНА', '18:00 - СИЛОВАЯ', '19:00 - ЗУМБА'] },
  { day: 'Вт', classes: ['07:30 - ЛФК', '09:00 - ТРХ', '18:00 - ТАБАТА', '19:00 - ВОСТОЧНЫЙ ТАНЕЦ'] },
  { day: 'Ср', classes: ['07:30 - ХАТХА ЙОГА', '09:00 - ПИЛАТЕС', '18:00 - 90/60/90', '19:00 - ДЖАМПИНГ'] },
  { day: 'Чт', classes: ['07:30 - ЙОГА ГАМАК', '09:00 - СТРЕЙЧ', '18:00 - БЕДРА', '19:00 - ФИТБОЛ'] },
  {
    day: 'Пт',
    classes: [
      '07:30 - РОЛЛ РЕЛАКС',
      '09:00 - ПИЛАТЕС ПЛОСКАЯ ТАЛИЯ И КРАСИВАЯ СПИНА',
      '18:00 - СКУЛЬПТОР ТЕЛА',
      '19:00 - АКТИВНАЯ МЕДИТАЦИЯ'
    ]
  },
  { day: 'Сб', classes: ['10:00 - ЖЕНСКАЯ ЙОГА', '11:00 - ПИЛАТЕС СТРОЙНЫЕ НОГИ И УПРУГИЕ ЯГОДИЦЫ', '12:00 - МСГ'] },
  { day: 'Вс', classes: ['10:00 - ФИТНЕС ЙОГА', '11:00 - ТРХ', '12:00 - ЗУМБА'] }
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
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [pinchStart, setPinchStart] = useState<number | null>(null);
  const [swipeTriggered, setSwipeTriggered] = useState(false);
  const [lightboxImageState, setLightboxImageState] = useState<LightboxImageState>('idle');
  const [lightboxRetryAttempt, setLightboxRetryAttempt] = useState(0);
  const [lightboxOffset, setLightboxOffset] = useState({ x: 0, y: 0 });
  const [galleryReady, setGalleryReady] = useState(false);
  const [galleryPreloadError, setGalleryPreloadError] = useState(false);
  const [galleryImageStates, setGalleryImageStates] = useState<Record<number, GalleryImageLoadState>>({});
  const [galleryRetrySeed, setGalleryRetrySeed] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryTouchStartX, setGalleryTouchStartX] = useState<number | null>(null);
  const [galleryTouchStartY, setGalleryTouchStartY] = useState<number | null>(null);
  const [galleryHovering, setGalleryHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [programPanelOpen, setProgramPanelOpen] = useState(false);
  const [clubImages] = useState<string[]>(initialClubImages);
  const [scheduleImages] = useState<string[]>(initialScheduleImages.slice(0, 1));
  const [selectedProgram, setSelectedProgram] = useState(programCategories[0].items[0]);
  const lightboxOverlayPointerRef = useRef<{ x: number; y: number } | null>(null);
  const lightboxViewportRef = useRef<HTMLDivElement | null>(null);
  const lightboxPanStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const lightboxLastTapAtRef = useRef(0);
  const galleryWheelLockedRef = useRef(false);
  const galleryWheelReleaseTimeoutRef = useRef<number | null>(null);
  const galleryAutoplayPauseUntilRef = useRef(0);
  const galleryTouchMovedRef = useRef(false);
  const galleryOpenGuardUntilRef = useRef(0);

  const selectedDay = useMemo(() => scheduleByDay.find((d) => d.day === activeDay) ?? scheduleByDay[0], [activeDay]);
  const gallerySlides = useMemo(() => clubImages, [clubImages]);
  const galleryIsInteractive = galleryReady;
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
    setLightboxOffset({ x: 0, y: 0 });
    setTouchStartX(null);
    setTouchStartY(null);
    setPinchStart(null);
    setSwipeTriggered(false);
    lightboxPanStartRef.current = null;
    lightboxLastTapAtRef.current = 0;
    setLightboxImageState('idle');
    setLightboxRetryAttempt(0);
  };

  const clampLightboxOffset = (x: number, y: number, nextZoom: number) => {
    if (nextZoom <= 1.02) return { x: 0, y: 0 };

    const viewport = lightboxViewportRef.current;
    if (!viewport) return { x, y };

    const maxX = Math.max(0, (viewport.clientWidth * (nextZoom - 1)) / 2);
    const maxY = Math.max(0, (viewport.clientHeight * (nextZoom - 1)) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y))
    };
  };

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
  }, []);

  useEffect(() => {
    if (!currentPhoto) {
      setLightboxImageState('idle');
      setLightboxRetryAttempt(0);
      setLightboxOffset({ x: 0, y: 0 });
      return;
    }

    setLightboxImageState('loading');
    setLightboxRetryAttempt(0);
    setLightboxOffset({ x: 0, y: 0 });
  }, [currentPhoto]);

  useEffect(() => {
    if (!clubImages.length) {
      setGalleryReady(true);
      setGalleryPreloadError(false);
      setGalleryImageStates({});
      return;
    }

    let cancelled = false;
    const preloadCount = Math.min(3, clubImages.length);

    setGalleryReady(false);
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
      setGalleryReady(true);
      setGalleryPreloadError(loadedCount === 0);
    }, 9000);

    const preloaders = Array.from({ length: preloadCount }, (_, index) => {
      const preloader = new window.Image();
      preloader.decoding = 'async';
      preloader.onload = () => {
        if (cancelled) return;
        loadedCount += 1;
        setGalleryImageStates((prev) => (prev[index] === 'loaded' ? prev : { ...prev, [index]: 'loaded' }));
        resolvedCount += 1;
        if (resolvedCount >= preloadCount) {
          window.clearTimeout(preloadTimeout);
          setGalleryReady(true);
          setGalleryPreloadError(loadedCount === 0);
        }
      };
      preloader.onerror = () => {
        if (cancelled) return;
        setGalleryImageStates((prev) => (prev[index] === 'error' ? prev : { ...prev, [index]: 'error' }));
        resolvedCount += 1;
        if (resolvedCount >= preloadCount) {
          window.clearTimeout(preloadTimeout);
          setGalleryReady(true);
          setGalleryPreloadError(loadedCount === 0);
        }
      };
      const source = clubImages[index];
      const sourceWithSeed = `${source}${source.includes('?') ? '&' : '?'}g=${galleryRetrySeed}`;
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
  }, [clubImages, galleryRetrySeed]);

  useEffect(() => {
    setGalleryIndex((currentIndex) => {
      if (gallerySlides.length === 0) return 0;
      return Math.min(currentIndex, gallerySlides.length - 1);
    });
  }, [gallerySlides.length]);

  useEffect(() => {
    if (!galleryIsInteractive || gallerySlides.length < 2) return;
    if (currentPhoto !== null) return;

    const autoplayTimer = window.setInterval(() => {
      if (document.hidden) return;
      if (galleryHovering) return;
      if (Date.now() < galleryAutoplayPauseUntilRef.current) return;
      setGalleryIndex((currentIndex) => (currentIndex + 1) % gallerySlides.length);
    }, 3900);

    return () => {
      window.clearInterval(autoplayTimer);
    };
  }, [currentPhoto, galleryHovering, galleryIsInteractive, gallerySlides.length]);

  useEffect(
    () => () => {
      if (galleryWheelReleaseTimeoutRef.current !== null) {
        window.clearTimeout(galleryWheelReleaseTimeoutRef.current);
      }
    },
    []
  );

  const openGallery = (index: number) => {
    galleryAutoplayPauseUntilRef.current = Date.now() + 9000;
    setGalleryIndex(index);
    setLightboxMode('gallery');
    setLightboxIndex(index);
    setZoom(1);
    setLightboxOffset({ x: 0, y: 0 });
  };

  const pauseGalleryAutoplay = (durationMs = 6400) => {
    galleryAutoplayPauseUntilRef.current = Date.now() + durationMs;
  };

  const nextGallerySlide = () => {
    if (gallerySlides.length < 2) return;
    pauseGalleryAutoplay();
    setGalleryIndex((currentIndex) => (currentIndex + 1) % gallerySlides.length);
  };

  const prevGallerySlide = () => {
    if (gallerySlides.length < 2) return;
    pauseGalleryAutoplay();
    setGalleryIndex((currentIndex) => (currentIndex - 1 + gallerySlides.length) % gallerySlides.length);
  };

  const onGalleryTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return;
    pauseGalleryAutoplay();
    galleryTouchMovedRef.current = false;
    setGalleryTouchStartX(event.touches[0].clientX);
    setGalleryTouchStartY(event.touches[0].clientY);
  };

  const onGalleryTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1 || galleryTouchStartX === null || galleryTouchStartY === null) return;

    const deltaX = event.touches[0].clientX - galleryTouchStartX;
    const deltaY = event.touches[0].clientY - galleryTouchStartY;
    if (Math.abs(deltaX) > 12 || Math.abs(deltaY) > 12) {
      galleryTouchMovedRef.current = true;
    }
  };

  const onGalleryTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (gallerySlides.length < 2 || event.changedTouches.length !== 1 || galleryTouchStartX === null || galleryTouchStartY === null) {
      setGalleryTouchStartX(null);
      setGalleryTouchStartY(null);
      return;
    }

    const deltaX = event.changedTouches[0].clientX - galleryTouchStartX;
    const deltaY = event.changedTouches[0].clientY - galleryTouchStartY;
    const isIntentionalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 58;
    const isMeaningfulMove = galleryTouchMovedRef.current || Math.abs(deltaX) > 14 || Math.abs(deltaY) > 14;

    if (isIntentionalSwipe) {
      if (deltaX < 0) {
        nextGallerySlide();
      } else {
        prevGallerySlide();
      }
    }

    if (isMeaningfulMove) {
      galleryOpenGuardUntilRef.current = Date.now() + 320;
    }

    galleryTouchMovedRef.current = false;
    setGalleryTouchStartX(null);
    setGalleryTouchStartY(null);
  };

  const onGalleryWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (gallerySlides.length < 2) return;

    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.15 && Math.abs(event.deltaX) > 14;
    if (!horizontalIntent) return;

    event.preventDefault();
    if (galleryWheelLockedRef.current) return;

    pauseGalleryAutoplay(7200);
    galleryWheelLockedRef.current = true;
    if (event.deltaX > 0 || event.deltaY > 0) {
      nextGallerySlide();
    } else {
      prevGallerySlide();
    }

    if (galleryWheelReleaseTimeoutRef.current !== null) {
      window.clearTimeout(galleryWheelReleaseTimeoutRef.current);
    }

    galleryWheelReleaseTimeoutRef.current = window.setTimeout(() => {
      galleryWheelLockedRef.current = false;
      galleryWheelReleaseTimeoutRef.current = null;
    }, 330);
  };

  const openSchedule = () => {
    if (!scheduleImages.length) return;
    setLightboxMode('schedule');
    setLightboxIndex(0);
    setZoom(1);
    setLightboxOffset({ x: 0, y: 0 });
  };

  const closeProgramPanel = () => {
    setProgramPanelOpen(false);
  };

  const next = () => {
    if (lightboxMode !== 'gallery' || lightboxIndex === null || clubImages.length === 0) return;
    const nextIndex = (lightboxIndex + 1) % clubImages.length;
    setLightboxIndex(nextIndex);
    setGalleryIndex(nextIndex);
    setZoom(1);
    setLightboxOffset({ x: 0, y: 0 });
  };

  const prev = () => {
    if (lightboxMode !== 'gallery' || lightboxIndex === null || clubImages.length === 0) return;
    const prevIndex = (lightboxIndex - 1 + clubImages.length) % clubImages.length;
    setLightboxIndex(prevIndex);
    setGalleryIndex(prevIndex);
    setZoom(1);
    setLightboxOffset({ x: 0, y: 0 });
  };

  const openProgramPanel = (program: string) => {
    setSelectedProgram(program);
    setProgramPanelOpen(true);
  };

  const scrollToTariffSection = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const galleryTrackTranslate = gallerySlides.length > 0 ? (galleryIndex * 100) / gallerySlides.length : 0;
  const gallerySlideWidth = gallerySlides.length > 0 ? 100 / gallerySlides.length : 100;

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
          {gallerySlides.length > 0 ? (
            galleryIsInteractive ? (
              <div className="gallery-edge-shell">
                <div
                  className="gallery-carousel-viewport"
                  onWheel={onGalleryWheel}
                  onTouchStart={onGalleryTouchStart}
                  onTouchMove={onGalleryTouchMove}
                  onTouchEnd={onGalleryTouchEnd}
                  onTouchCancel={() => {
                    galleryTouchMovedRef.current = false;
                    setGalleryTouchStartX(null);
                    setGalleryTouchStartY(null);
                  }}
                  onPointerDown={() => {
                    pauseGalleryAutoplay(5600);
                  }}
                  onMouseEnter={() => {
                    setGalleryHovering(true);
                    pauseGalleryAutoplay(1800);
                  }}
                  onMouseLeave={() => {
                    setGalleryHovering(false);
                    pauseGalleryAutoplay(1200);
                  }}
                >
                  <div
                    className="gallery-carousel-track"
                    style={{ width: `${gallerySlides.length * 100}%`, transform: `translate3d(-${galleryTrackTranslate}%, 0, 0)` }}
                  >
                    {gallerySlides.map((src, i) => {
                      const baseIndex = i;
                      const imageState = galleryImageStates[baseIndex] ?? 'loading';
                      const isLoaded = imageState === 'loaded';
                      const isActiveSlide = i === galleryIndex;
                      const imageSourceWithSeed = `${src}${src.includes('?') ? '&' : '?'}g=${galleryRetrySeed}`;

                      return (
                        <div key={`${src}-${i}`} className="gallery-carousel-slide" style={{ width: `${gallerySlideWidth}%` }}>
                          <motion.button
                            type="button"
                            onClick={() => {
                              if (Date.now() < galleryOpenGuardUntilRef.current) return;
                              openGallery(baseIndex);
                            }}
                            aria-busy={!isLoaded}
                            whileHover={isLoaded ? { y: -4 } : undefined}
                            whileTap={isLoaded ? { scale: 0.996 } : undefined}
                            transition={{ duration: 0.3, ease: easeOut }}
                            className={`group relative h-[278px] w-full overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(45,44,39,0.72),rgba(23,22,19,0.96))] p-[1.5px] text-left shadow-[0_0_0_1px_rgba(29,28,24,0.78),0_18px_44px_rgba(0,0,0,0.18)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 md:h-[378px] ${
                              isLoaded ? '' : 'cursor-progress'
                            }`}
                          >
                            <div className="absolute inset-px rounded-[1.86rem] bg-[linear-gradient(180deg,rgba(24,23,20,0.74),rgba(14,14,12,0.9))]" />
                            <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-charcoal">
                              <motion.img
                                src={imageSourceWithSeed}
                                alt={`Атмосфера клуба — фото ${i + 1}`}
                                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
                                  isLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                loading={baseIndex < 3 ? 'eager' : 'lazy'}
                                animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? (isActiveSlide ? 1.032 : 1.01) : 1 }}
                                whileHover={isLoaded ? { scale: isActiveSlide ? 1.046 : 1.024 } : undefined}
                                transition={{ duration: shouldReduceMotion ? 0.01 : 0.62, ease: easeOut }}
                                onLoad={() => {
                                  setGalleryImageStates((prev) => (prev[baseIndex] === 'loaded' ? prev : { ...prev, [baseIndex]: 'loaded' }));
                                }}
                                onError={() => {
                                  setGalleryImageStates((prev) => (prev[baseIndex] === 'error' ? prev : { ...prev, [baseIndex]: 'error' }));
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
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {gallerySlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="gallery-carousel-control gallery-carousel-control-prev"
                      onClick={prevGallerySlide}
                      aria-label="Предыдущее фото"
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <button
                      type="button"
                      className="gallery-carousel-control gallery-carousel-control-next"
                      onClick={nextGallerySlide}
                      aria-label="Следующее фото"
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                    <div className="gallery-carousel-dots" aria-hidden="true">
                      {gallerySlides.map((_, dotIndex) => (
                        <span key={`gallery-dot-${dotIndex}`} className={`gallery-carousel-dot ${dotIndex === galleryIndex ? 'is-active' : ''}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="gallery-loading-shell rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.016))] px-2.5 pt-2.5 pb-3 md:px-3.5 md:pt-3 md:pb-3.5">
                <div className="flex overflow-hidden pb-2.5">
                  {[0].map((placeholderIndex) => (
                    <div
                      key={`gallery-loading-${placeholderIndex}`}
                      className="gallery-loading-card relative h-[278px] w-full flex-none overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(45,44,39,0.72),rgba(23,22,19,0.96))] p-[1.5px] md:h-[378px]"
                    >
                      <div className="absolute inset-px rounded-[1.86rem] bg-[linear-gradient(180deg,rgba(24,23,20,0.74),rgba(14,14,12,0.9))]" />
                      <div className="gallery-loading-shimmer absolute inset-[6px] rounded-[1.58rem]" />
                    </div>
                  ))}
                </div>
                <div className="px-1 pb-0.5 md:px-0">
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
              transition={{ duration: 0.62, delay: index * 0.04, ease: easeOut }}
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
            transition={{ duration: 0.76, ease: easeOut }}
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
            transition={{ duration: 0.76, delay: 0.05, ease: easeOut }}
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
                  } ${!plan.featuredBadge ? 'tariff-plan-card-muted' : ''} ${plan.featuredBadge ? 'tariff-plan-card-popular' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="tariff-plan-title premium-display text-[1rem] font-semibold tracking-[-0.016em] text-white">{plan.name}</h4>
                      {plan.featuredBadge && (
                        <span className="tariff-plan-badge tariff-plan-badge-popular premium-label mt-2 inline-flex rounded-full border border-lime/26 px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-lime/92">
                          {plan.featuredBadge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`tariff-plan-price tariff-plan-price-accent premium-display shrink-0 rounded-full border border-lime/30 bg-[linear-gradient(180deg,rgba(200,214,0,0.22),rgba(200,214,0,0.1))] px-3.5 py-1.5 text-[0.84rem] font-semibold text-lime/95 ${
                        plan.featuredBadge ? 'tariff-plan-price-popular' : ''
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
                        <span className="tariff-line-value tariff-price premium-display text-[1rem]">{line.value}</span>
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
            transition={{ duration: 0.76, delay: 0.1, ease: easeOut }}
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
            transition={{ duration: 0.22, ease: easeOut }}
          >
            Подобрать тариф
          </motion.button>
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
                  <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/14 bg-black/38 px-3 py-1.5">
                    <p className="premium-label text-[0.6rem] uppercase tracking-[0.16em] text-soft/84">
                      {lightboxMode === 'schedule'
                        ? 'Просмотр расписания'
                        : `Просмотр фото ${((lightboxIndex ?? 0) % Math.max(clubImages.length, 1)) + 1}/${Math.max(clubImages.length, 1)}`}
                    </p>
                  </div>
                  <div className="absolute right-3 top-3 z-10">
                    <ModalCloseButton onClick={closeLightbox} />
                  </div>
                  <div
                    ref={lightboxViewportRef}
                    className="relative flex max-h-[calc(100dvh-5rem)] min-h-0 w-full touch-none items-center justify-center overflow-hidden rounded-[1.4rem] md:max-h-[calc(100dvh-8rem)]"
                    onTouchStart={(e) => {
                      if (e.touches.length === 1) {
                        setTouchStartX(e.touches[0].clientX);
                        setTouchStartY(e.touches[0].clientY);
                        setSwipeTriggered(false);
                        if (zoom > 1.02) {
                          lightboxPanStartRef.current = {
                            x: e.touches[0].clientX,
                            y: e.touches[0].clientY,
                            originX: lightboxOffset.x,
                            originY: lightboxOffset.y
                          };
                        } else {
                          lightboxPanStartRef.current = null;
                        }
                      }
                      if (e.touches.length === 2) {
                        setPinchStart(Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY));
                        lightboxPanStartRef.current = null;
                      }
                    }}
                    onTouchMove={(e) => {
                      if (e.touches.length === 2 && pinchStart) {
                        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                        setZoom((z) => {
                          const nextZoom = Math.min(3, Math.max(1, z * (d / pinchStart)));
                          setLightboxOffset((offset) => clampLightboxOffset(offset.x, offset.y, nextZoom));
                          return nextZoom;
                        });
                        setPinchStart(d);
                        return;
                      }
                      if (e.touches.length === 1 && zoom > 1.02 && lightboxPanStartRef.current) {
                        const panStart = lightboxPanStartRef.current;
                        const nextX = panStart.originX + (e.touches[0].clientX - panStart.x);
                        const nextY = panStart.originY + (e.touches[0].clientY - panStart.y);
                        setLightboxOffset(clampLightboxOffset(nextX, nextY, zoom));
                        return;
                      }
                      if (
                        e.touches.length === 1 &&
                        touchStartX !== null &&
                        touchStartY !== null &&
                        !swipeTriggered &&
                        zoom <= 1.02 &&
                        lightboxMode === 'gallery'
                      ) {
                        const delta = e.touches[0].clientX - touchStartX;
                        const deltaY = e.touches[0].clientY - touchStartY;
                        const isIntentionalHorizontalSwipe = Math.abs(delta) > Math.abs(deltaY) * 1.35;

                        if (isIntentionalHorizontalSwipe && delta > 120) {
                          prev();
                          setSwipeTriggered(true);
                        } else if (isIntentionalHorizontalSwipe && delta < -120) {
                          next();
                          setSwipeTriggered(true);
                        }
                      }
                    }}
                    onTouchEnd={(e) => {
                      const now = Date.now();
                      if (e.changedTouches.length === 1 && !swipeTriggered && pinchStart === null) {
                        if (now - lightboxLastTapAtRef.current < 280) {
                          setZoom((z) => {
                            const nextZoom = z > 1.02 ? 1 : 2;
                            setLightboxOffset((offset) => clampLightboxOffset(offset.x, offset.y, nextZoom));
                            return nextZoom;
                          });
                          lightboxLastTapAtRef.current = 0;
                        } else {
                          lightboxLastTapAtRef.current = now;
                        }
                      }

                      lightboxPanStartRef.current = null;
                      setTouchStartX(null);
                      setTouchStartY(null);
                      setPinchStart(null);
                      setSwipeTriggered(false);
                      if (zoom < 1.03) {
                        setZoom(1);
                        setLightboxOffset({ x: 0, y: 0 });
                      } else {
                        setLightboxOffset((offset) => clampLightboxOffset(offset.x, offset.y, zoom));
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
                      onDoubleClick={() =>
                        setZoom((z) => {
                          const nextZoom = z > 1.02 ? 1 : 2;
                          setLightboxOffset((offset) => clampLightboxOffset(offset.x, offset.y, nextZoom));
                          return nextZoom;
                        })
                      }
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

