import 'server-only';

import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export type ScheduleItem = {
  day: string;
  time: string;
  program: string;
  trainer: string;
  hall: string;
  comment?: string;
};

const fallbackSchedule: ScheduleItem[] = [
  {
    day: 'Понедельник',
    time: '08:00',
    program: 'Функциональный тренинг',
    trainer: 'Анна К.',
    hall: 'Зал 1',
    comment: 'Подходит для любого уровня'
  },
  {
    day: 'Понедельник',
    time: '19:00',
    program: 'ЗУМБА',
    trainer: 'Марина Л.',
    hall: 'Зал 2'
  },
  {
    day: 'Вторник',
    time: '18:30',
    program: 'АБТ',
    trainer: 'Игорь Д.',
    hall: 'Зал 1'
  },
  {
    day: 'Среда',
    time: '20:00',
    program: 'Степ 1',
    trainer: 'Ольга В.',
    hall: 'Зал 2'
  },
  {
    day: 'Четверг',
    time: '09:00',
    program: 'Фитбол',
    trainer: 'Елена П.',
    hall: 'Зал 1'
  },
  {
    day: 'Пятница',
    time: '18:00',
    program: 'КРУГОВАЯ',
    trainer: 'Артем Н.',
    hall: 'Зал 1'
  },
  {
    day: 'Суббота',
    time: '11:00',
    program: 'Смешанный тренинг',
    trainer: 'Юлия Р.',
    hall: 'Зал 2'
  },
  {
    day: 'Воскресенье',
    time: '12:30',
    program: '90/60/90',
    trainer: 'Татьяна М.',
    hall: 'Зал 1'
  }
];

const columnMap = {
  day: ['день недели', 'день', 'day'],
  time: ['время', 'time'],
  program: ['программа', 'занятие', 'program'],
  trainer: ['тренер', 'trainer'],
  hall: ['зал', 'hall'],
  comment: ['комментарий', 'примечание', 'comment']
};

const normalize = (value: string) => value.trim().toLowerCase();

function resolveColumnKey(headers: string[], candidates: string[]) {
  const normalizedHeaders = headers.map((header) => normalize(header));
  const index = normalizedHeaders.findIndex((header) =>
    candidates.map((candidate) => normalize(candidate)).includes(header)
  );
  return index >= 0 ? headers[index] : undefined;
}

function parseTimeValue(value: unknown): string {
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${String(date.H).padStart(2, '0')}:${String(date.M).padStart(2, '0')}`;
    }
  }
  return String(value ?? '').trim();
}

export function getScheduleData(): ScheduleItem[] {
  const schedulePath = path.join(process.cwd(), 'data', 'schedule.xlsx');

  if (!fs.existsSync(schedulePath)) {
    return fallbackSchedule;
  }

  try {
    const workbook = XLSX.readFile(schedulePath);
    const firstSheet = workbook.SheetNames[0];

    if (!firstSheet) {
      return fallbackSchedule;
    }

    const sheet = workbook.Sheets[firstSheet];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: ''
    });

    if (!rows.length) {
      return fallbackSchedule;
    }

    const headers = Object.keys(rows[0]);
    const dayKey = resolveColumnKey(headers, columnMap.day);
    const timeKey = resolveColumnKey(headers, columnMap.time);
    const programKey = resolveColumnKey(headers, columnMap.program);
    const trainerKey = resolveColumnKey(headers, columnMap.trainer);
    const hallKey = resolveColumnKey(headers, columnMap.hall);
    const commentKey = resolveColumnKey(headers, columnMap.comment);

    if (!dayKey || !timeKey || !programKey || !trainerKey || !hallKey) {
      return fallbackSchedule;
    }

    const parsed = rows
      .map((row) => ({
        day: String(row[dayKey] ?? '').trim(),
        time: parseTimeValue(row[timeKey]),
        program: String(row[programKey] ?? '').trim(),
        trainer: String(row[trainerKey] ?? '').trim(),
        hall: String(row[hallKey] ?? '').trim(),
        comment: commentKey ? String(row[commentKey] ?? '').trim() : ''
      }))
      .filter((item) => item.day && item.time && item.program);

    return parsed.length ? parsed : fallbackSchedule;
  } catch {
    return fallbackSchedule;
  }
}
