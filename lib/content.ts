import { ProgramCategory, ScheduleItem } from './types';

export const galleryImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1558611848-73f7eb4001ab?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1598268034871-0b0f7a89f8c4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1400&q=80'
];

export const fallbackSchedule: ScheduleItem[] = [
  { day: 'Понедельник', time: '08:00', program: 'Функциональный тренинг', trainer: 'Ирина Соколова', hall: 'Зал 1' },
  { day: 'Понедельник', time: '19:00', program: 'ЗУМБА', trainer: 'Мария Романова', hall: 'Зал 2', comment: 'Запись обязательна' },
  { day: 'Вторник', time: '09:00', program: 'АБТ', trainer: 'Олег Руднев', hall: 'Зал 1' },
  { day: 'Среда', time: '18:30', program: 'СКУЛЬПТОР ТЕЛА', trainer: 'Анна Кравцова', hall: 'Зал 1' },
  { day: 'Четверг', time: '20:00', program: 'Смешанный тренинг', trainer: 'Игорь Лавров', hall: 'Зал 2' },
  { day: 'Пятница', time: '18:00', program: 'КРУГОВАЯ', trainer: 'Виктор Погодин', hall: 'Зал 1' },
  { day: 'Суббота', time: '10:00', program: 'Степ 1', trainer: 'Дарья Нестерова', hall: 'Зал 2' },
  { day: 'Воскресенье', time: '11:00', program: 'Фитбол', trainer: 'Елена Гущина', hall: 'Зал 2' }
];

export const programs: ProgramCategory[] = [
  {
    id: 'power',
    title: 'Силовые программы',
    items: [
      { name: 'АБТ', description: 'Силовой класс для проработки всех групп мышц (работа с инвентарем), помогает развить мышечную силу, улучшает рельеф.' },
      { name: '90/60/90', description: 'Силовой урок направленный на развитие выносливости мышц живота, ягодиц, груди.' },
      { name: 'АБЛ', description: 'Силовой урок для тренировки нижней части тела и брюшного пресса.' },
      { name: 'БЕДРА “-”', description: 'Смешанный формат тренировки: 1 часть — аэробная или танцевальная, 2 часть — силовая на ноги, бедра, ягодицы.' },
      { name: 'СУПЕР ПРЕСС', description: 'Силовой урок для тренировки мышц брюшного пресса (работа с инвентарем).' },
      { name: 'АНТИЦЕЛ. ТРЕНИНГ', description: 'Силовой урок для всех основных мышечных групп с акцентом на мышцы бедер, ягодиц и пресса.' },
      { name: 'МОЩНЫЙ КЛАСС', description: 'Силовая программа на все группы мышц (работа с инвентарем).' },
      { name: 'Функциональный тренинг', description: 'Силовая тренировка, построенная на движениях из жизни, задействует максимальное количество мышечных групп.' },
      { name: 'СКУЛЬПТОР ТЕЛА', description: 'Низко-ударная тренировка с использованием штанги для коррекции фигуры и укрепления мышц.' },
      { name: 'СИЛОВАЯ С ПЕТЛЯМИ', description: 'Функциональная тренировка с использованием подвесных петель для гибкости и координации.' },
      { name: 'ДЖАМПИНГ', description: 'Силовая + аэробная кардио-тренировка на специальных шестиугольных батутах.' },
      { name: 'КРУГОВАЯ', description: 'Поочередное выполнение упражнений по кругу с минимальным отдыхом.' }
    ]
  },
  {
    id: 'aerobic',
    title: 'Аэробные программы',
    items: [
      { name: 'Смешанный тренинг', description: 'Включает различные танцевальные стили, базовую степ-аэробику и силовой класс.' },
      { name: 'Фитбол', description: 'Урок с использованием специальных мячей для гибкости, координации и осанки.' },
      { name: 'Степ 1', description: 'Урок для начинающих: степ-аэробика + силовая часть.' }
    ]
  },
  {
    id: 'dance',
    title: 'Танцевальные программы',
    items: [
      { name: 'ЗУМБА', description: 'Танцевальная фитнес-программа, которая подойдет каждому и сочетает аэробные упражнения и танцевальные элементы.' }
    ]
  }
];
