import fs from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';
import { scheduleMock } from '@/data/siteData';

export type ScheduleItem = {
  day: string;
  time: string;
  program: string;
  trainer: string;
  hall: string;
  comment?: string;
  type?: string;
};

const columnMap: Record<keyof ScheduleItem, string[]> = {
  day: ['день', 'день недели', 'day'],
  time: ['время', 'time'],
  program: ['программа', 'занятие', 'program'],
  trainer: ['тренер', 'trainer'],
  hall: ['зал', 'hall'],
  comment: ['комментарий', 'примечание', 'comment'],
  type: ['тип', 'категория', 'type']
};

const normalize = (value: string) => value.trim().toLowerCase();

const pickValue = (row: Record<string, unknown>, aliases: string[]) => {
  const entry = Object.entries(row).find(([key]) => aliases.includes(normalize(key)));
  return entry ? String(entry[1] ?? '').trim() : '';
};

export async function getScheduleData(): Promise<{ items: ScheduleItem[]; source: 'excel' | 'mock'; message?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'schedule.xlsx');
    await fs.access(filePath);

    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

    const items = rows
      .map((row) => ({
        day: pickValue(row, columnMap.day),
        time: pickValue(row, columnMap.time),
        program: pickValue(row, columnMap.program),
        trainer: pickValue(row, columnMap.trainer),
        hall: pickValue(row, columnMap.hall),
        comment: pickValue(row, columnMap.comment),
        type: pickValue(row, columnMap.type)
      }))
      .filter((item) => item.day && item.time && item.program)
      .sort((a, b) => a.time.localeCompare(b.time));

    if (!items.length) {
      return { items: scheduleMock, source: 'mock', message: 'Файл найден, но данные не распознаны. Используется демо-расписание.' };
    }

    return { items, source: 'excel' };
  } catch {
    return { items: scheduleMock, source: 'mock', message: 'Файл data/schedule.xlsx пока не добавлен. Показано демо-расписание.' };
  }
}
