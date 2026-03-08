'use client';

import { useMemo, useState } from 'react';
import type { ScheduleItem } from '@/lib/schedule';

type Props = {
  items: ScheduleItem[];
};

const dayOrder = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
];

export function ScheduleSection({ items }: Props) {
  const availableDays = useMemo(() => {
    const days = [...new Set(items.map((item) => item.day))];
    return dayOrder.filter((day) => days.includes(day));
  }, [items]);

  const [activeDay, setActiveDay] = useState(availableDays[0] ?? 'Понедельник');

  const dayItems = useMemo(
    () =>
      items
        .filter((item) => item.day === activeDay)
        .sort((a, b) => a.time.localeCompare(b.time, 'ru')),
    [activeDay, items]
  );

  return (
    <section id="schedule" className="section">
      <div className="container">
        <h2>Расписание</h2>
        <p className="section-intro">Выберите день и планируйте тренировки в удобное время.</p>
        <div className="tabs" role="tablist" aria-label="Дни недели">
          {availableDays.map((day) => (
            <button
              key={day}
              className={`tab ${day === activeDay ? 'tab-active' : ''}`}
              onClick={() => setActiveDay(day)}
              role="tab"
              aria-selected={day === activeDay}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="schedule-grid">
          {dayItems.length > 0 ? (
            dayItems.map((item) => (
              <article key={`${item.day}-${item.time}-${item.program}`} className="schedule-card">
                <div>
                  <p className="schedule-time">{item.time}</p>
                  <h3>{item.program}</h3>
                </div>
                <p>{item.trainer}</p>
                <p>{item.hall}</p>
                {item.comment ? <p className="schedule-comment">{item.comment}</p> : null}
              </article>
            ))
          ) : (
            <p>На выбранный день занятия пока не добавлены.</p>
          )}
        </div>
      </div>
    </section>
  );
}
