export type ScheduleItem = {
  time: string;
  className: string;
  coach: string;
};

export type DaySchedule = {
  day: string;
  items: ScheduleItem[];
};

export const weeklySchedule: DaySchedule[] = [
  { day: 'Понедельник', items: [
    { time: '7:45', className: 'АБТ', coach: 'Диана' },
    { time: '8:30', className: 'ЙОГА ГАМАК', coach: 'Татьяна' },
    { time: '18:00', className: 'АКТИВНАЯ МЕДИТАЦИЯ', coach: 'Дарья' },
    { time: '18:00', className: 'ZUMBA', coach: 'Ольга А' },
    { time: '18:00', className: 'ТАБАТА', coach: 'Диана' },
    { time: '18:30', className: 'STRETCHING', coach: 'Татьяна' }
  ]},
  { day: 'Вторник', items: [
    { time: '9:00', className: 'BODY PUMP', coach: 'Люба' },
    { time: '17:30', className: 'ДЭТ', coach: 'Ирина Ф' },
    { time: '18:00', className: 'ХАТХА ЙОГА', coach: 'Ольга' },
    { time: '18:00', className: '90/60/90', coach: 'Диана' },
    { time: '19:00', className: 'JUMPING', coach: 'Диана' }
  ]},
  { day: 'Среда', items: [
    { time: '7:45', className: 'АБТ', coach: 'Диана' },
    { time: '12:00', className: 'ЙОГА ЛАНЧ', coach: 'Татьяна' },
    { time: '17:45', className: 'ЙОГА ГАМАК', coach: 'Татьяна' },
    { time: '18:00', className: 'ZUMBA', coach: 'Ольга А' },
    { time: '18:00', className: 'СИЛОВАЯ', coach: 'Диана' },
    { time: '19:00', className: 'ЗДОРОВАЯ СПИНА', coach: 'Ирина Ф' }
  ]},
  { day: 'Четверг', items: [
    { time: '9:00', className: 'BODY SCULPT', coach: 'Люба' },
    { time: '18:00', className: 'АКТИВНАЯ МЕДИТАЦИЯ', coach: 'Дарья' },
    { time: '18:00', className: 'BODY PUMP', coach: 'Люба' },
    { time: '18:00', className: 'ФИТНЕС ЙОГА', coach: 'Татьяна' },
    { time: '18:30', className: 'JUMPING', coach: 'Диана' },
    { time: '19:10', className: 'ФИТНЕС BELLYDANCE', coach: 'Лианара' }
  ]},
  { day: 'Пятница', items: [
    { time: '7:45', className: 'АБТ', coach: 'Диана' },
    { time: '12:00', className: 'ДЭТ', coach: 'Ирина Ф' },
    { time: '17:30', className: 'МСГ', coach: 'Ирина Ф' },
    { time: '18:00', className: '90/60/90', coach: 'Диана' },
    { time: '18:30', className: 'ЖЕНСКАЯ ЙОГА', coach: 'Татьяна' }
  ]},
  { day: 'Суббота', items: [
    { time: '10:00', className: 'TRX', coach: 'Ирина Ф' },
    { time: '11:00', className: 'ROLL RELAX', coach: 'Ирина Ф' }
  ]},
  { day: 'Воскресенье', items: [
    { time: '9:00', className: 'ФИТНЕС ЙОГА', coach: 'Татьяна' },
    { time: '10:00', className: 'БЕДРА', coach: 'Ирина Н' }
  ]}
];
