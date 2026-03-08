import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';

export type ScheduleRow = {
  day: string;
  time: string;
  program: string;
  coach: string;
  hall: string;
  comment: string;
};

const demoSchedule: ScheduleRow[] = [
  { day: 'Понедельник', time: '08:00', program: 'Функциональный тренинг', coach: 'Анна', hall: 'Зал 1', comment: 'Средний уровень' },
  { day: 'Понедельник', time: '19:00', program: 'ЗУМБА', coach: 'Мария', hall: 'Зал 2', comment: 'Открытый класс' },
  { day: 'Вторник', time: '18:30', program: 'АБТ', coach: 'Илья', hall: 'Зал 1', comment: '' },
  { day: 'Среда', time: '20:00', program: 'КРУГОВАЯ', coach: 'Денис', hall: 'Зал 1', comment: 'Интенсив' },
  { day: 'Четверг', time: '09:00', program: 'Фитбол', coach: 'Екатерина', hall: 'Зал 2', comment: 'Для начинающих' },
  { day: 'Пятница', time: '19:30', program: 'СУПЕР ПРЕСС', coach: 'Ольга', hall: 'Зал 1', comment: '' },
  { day: 'Суббота', time: '11:00', program: 'Степ 1', coach: 'Виктория', hall: 'Зал 2', comment: '' },
  { day: 'Воскресенье', time: '12:00', program: 'Смешанный тренинг', coach: 'Егор', hall: 'Зал 1', comment: 'Легкий формат' }
];

const columnMap = {
  day: ['день недели', 'день', 'day'],
  time: ['время', 'time'],
  program: ['программа', 'занятие', 'program'],
  coach: ['тренер', 'coach'],
  hall: ['зал', 'hall'],
  comment: ['комментарий', 'comment']
};

const findValue = (row: Record<string, unknown>, aliases: string[]) => {
  const key = Object.keys(row).find((item) => aliases.includes(item.toLowerCase().trim()));
  return key ? String(row[key] ?? '').trim() : '';
};

export const loadSchedule = (): { rows: ScheduleRow[]; source: 'excel' | 'demo' } => {
  const filePath = path.join(process.cwd(), 'data', 'schedule.xlsx');

  if (!fs.existsSync(filePath)) {
    return { rows: demoSchedule, source: 'demo' };
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

    const rows = json
      .map((row) => ({
        day: findValue(row, columnMap.day),
        time: findValue(row, columnMap.time),
        program: findValue(row, columnMap.program),
        coach: findValue(row, columnMap.coach),
        hall: findValue(row, columnMap.hall),
        comment: findValue(row, columnMap.comment)
      }))
      .filter((row) => row.day && row.time && row.program)
      .sort((a, b) => a.time.localeCompare(b.time));

    if (!rows.length) {
      return { rows: demoSchedule, source: 'demo' };
    }

    return { rows, source: 'excel' };
  } catch {
    return { rows: demoSchedule, source: 'demo' };
  }
};

export const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
