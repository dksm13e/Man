import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { fallbackSchedule } from './content';
import { ScheduleItem } from './types';

type SheetRow = Record<string, string | number | undefined>;

const columnMap = {
  day: ['день недели', 'день', 'day'],
  time: ['время', 'time'],
  program: ['программа', 'занятие', 'program'],
  trainer: ['тренер', 'trainer'],
  hall: ['зал', 'hall'],
  comment: ['комментарий', 'comment']
};

const normalize = (v: string) => v.trim().toLowerCase();

const getValue = (row: SheetRow, keys: string[]): string => {
  const entries = Object.entries(row);
  for (const [rawKey, value] of entries) {
    if (keys.includes(normalize(rawKey))) {
      return String(value ?? '').trim();
    }
  }
  return '';
};

export async function getScheduleData(): Promise<ScheduleItem[]> {
  const filePath = path.join(process.cwd(), 'data', 'schedule.xlsx');

  if (!fs.existsSync(filePath)) {
    return fallbackSchedule;
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return fallbackSchedule;
    }

    const rows = XLSX.utils.sheet_to_json<SheetRow>(workbook.Sheets[firstSheetName]);

    const parsed = rows
      .map((row) => ({
        day: getValue(row, columnMap.day),
        time: getValue(row, columnMap.time),
        program: getValue(row, columnMap.program),
        trainer: getValue(row, columnMap.trainer),
        hall: getValue(row, columnMap.hall),
        comment: getValue(row, columnMap.comment)
      }))
      .filter((item) => item.day && item.time && item.program && item.trainer && item.hall)
      .map((item) => ({ ...item, comment: item.comment || undefined }));

    return parsed.length > 0 ? parsed : fallbackSchedule;
  } catch {
    return fallbackSchedule;
  }
}

export const scheduleColumnMappingHelp = {
  expectedColumns: ['день недели', 'время', 'программа', 'тренер', 'зал', 'комментарий'],
  filePath: '/data/schedule.xlsx'
};
