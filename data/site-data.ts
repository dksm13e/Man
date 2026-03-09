export const phone = {
  display: '+7 (900) 000-00-00',
  link: 'tel:+79000000000'
};

export const clubPhotos = [
  { src: '/images/club/gym-1.svg', alt: 'Тренажёрный зал Энерджи' },
  { src: '/images/club/cardio-1.svg', alt: 'Кардио-зона клуба' },
  { src: '/images/club/group-1.svg', alt: 'Групповая тренировка' },
  { src: '/images/club/interior-1.svg', alt: 'Интерьер фитнес-клуба' },
  { src: '/images/club/atmosphere-1.svg', alt: 'Атмосфера в зале' }
];

export const scheduleMeta = {
  image: '/images/schedule/schedule-photo.svg',
  updatedAt: 'Актуально на текущую неделю'
};

export const scheduleCards = [
  { day: 'Понедельник', focus: 'Силовые + кардио', time: '07:30 — 20:00' },
  { day: 'Среда', focus: 'Функциональные и танцевальные', time: '08:00 — 20:15' },
  { day: 'Пятница', focus: 'Силовой микс', time: '07:30 — 19:45' },
  { day: 'Суббота', focus: 'Лёгкая аэробика и ZUMBA', time: '09:30 — 16:00' }
];

export const tariffs = [
  {
    name: 'Старт',
    features: ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство'],
    highlighted: false
  },
  {
    name: 'Стандарт',
    features: ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись'],
    highlighted: true
  },
  {
    name: 'Полный',
    features: ['расширенный доступ', 'максимум возможностей', 'выгодные условия'],
    highlighted: false
  }
];

export const questions = [
  'Нужна ли предварительная запись?',
  'Что взять с собой на тренировку?',
  'Есть ли пробное посещение?',
  'Как посмотреть расписание?',
  'Когда нужно покинуть клуб?',
  'Подходит ли клуб для новичков?'
];
