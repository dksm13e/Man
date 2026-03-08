'use client';

import { useMemo, useState } from 'react';
import type { ScheduleItem } from '@/lib/schedule';

const weekOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const types = ['Все', 'Силовые программы', 'Аэробные программы', 'Танцевальные программы'];

export function ScheduleSection({ items, source, message }: { items: ScheduleItem[]; source: 'excel' | 'mock'; message?: string }) {
  const days = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.day)));
    return unique.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
  }, [items]);

  const [selectedDay, setSelectedDay] = useState(days[0] ?? 'Понедельник');
  const [selectedType, setSelectedType] = useState('Все');

  const filtered = useMemo(
    () =>
      items
        .filter((item) => item.day === selectedDay)
        .filter((item) => selectedType === 'Все' || item.type === selectedType)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [items, selectedDay, selectedType]
  );

  return (
    <section id="schedule" className="bg-charcoal/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="section-title">Расписание</h2>
        <p className="section-subtitle">Переключайтесь по дням недели и выбирайте тип программы.</p>
        <p className="mt-3 text-sm text-lime">Источник данных: {source === 'excel' ? 'Excel-файл /data/schedule.xlsx' : 'Демо-данные'}</p>
        {message && <p className="mt-2 rounded-xl border border-lime/30 bg-graphite/80 p-3 text-sm text-light/80">{message}</p>}

        <div className="mt-8 flex flex-wrap gap-2">
          {days.map((day) => (
            <button key={day} onClick={() => setSelectedDay(day)} className={`rounded-full px-4 py-2 text-sm font-medium ${selectedDay === day ? 'bg-lime text-graphite' : 'bg-graphite text-light'}`}>
              {day}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((type) => (
            <button key={type} onClick={() => setSelectedType(type)} className={`rounded-full border px-4 py-2 text-sm ${selectedType === type ? 'border-lime text-lime' : 'border-light/30 text-light/80'}`}>
              {type}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {filtered.length ? (
            filtered.map((item) => (
              <article key={`${item.day}-${item.time}-${item.program}`} className="rounded-2xl border border-lime/20 bg-graphite p-4 md:flex md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold text-lime">{item.time}</p>
                  <p className="text-xl font-semibold">{item.program}</p>
                  <p className="text-sm text-light/70">{item.type ?? 'Категория не указана'}</p>
                </div>
                <div className="mt-3 text-sm text-light/80 md:mt-0 md:text-right">
                  <p>Тренер: {item.trainer}</p>
                  <p>Зал: {item.hall}</p>
                  {item.comment ? <p>Комментарий: {item.comment}</p> : null}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-light/30 p-6 text-light/80">На выбранный день нет занятий по текущему фильтру.</p>
          )}
        </div>
      </div>
    </section>
  );
}
