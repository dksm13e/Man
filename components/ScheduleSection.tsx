'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ScheduleItem } from '@/lib/types';

type Props = { items: ScheduleItem[] };

const dayOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export function ScheduleSection({ items }: Props) {
  const days = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.day)));
    return dayOrder.filter((d) => unique.includes(d));
  }, [items]);

  const [activeDay, setActiveDay] = useState(days[0] ?? 'Понедельник');

  const dayItems = useMemo(
    () =>
      items
        .filter((item) => item.day === activeDay)
        .sort((a, b) => a.time.localeCompare(b.time, 'ru')),
    [items, activeDay]
  );

  return (
    <section id="schedule" className="section-shell border-t border-white/10">
      <h2 className="text-3xl font-semibold md:text-4xl">Расписание занятий</h2>
      <p className="mt-3 text-white/70">Выберите день и быстро найдите нужную программу.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeDay === day ? 'bg-lime text-carbon' : 'border border-white/20 text-white/80'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-3"
        >
          {dayItems.length > 0 ? (
            dayItems.map((item) => (
              <article key={`${item.day}-${item.time}-${item.program}`} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xl font-semibold text-lime">{item.time}</p>
                  <p className="text-sm text-white/60">{item.hall}</p>
                </div>
                <p className="mt-2 font-semibold">{item.program}</p>
                <p className="text-sm text-white/70">Тренер: {item.trainer}</p>
                {item.comment && <p className="mt-1 text-xs text-lime/90">{item.comment}</p>}
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-white/10 p-6 text-white/70">На выбранный день пока нет занятий.</p>
          )}
        </motion.div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-charcoal p-6">
          <div className="absolute inset-0 bg-radial-energy opacity-60" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.24em] text-lime">Визуальный блок</p>
            <h3 className="mt-3 text-2xl font-semibold">Тренируйтесь по удобному графику</h3>
            <p className="mt-3 text-sm text-white/75">
              Расписание обновляется из Excel файла на сервере. Если файла пока нет, используется безопасный демонстрационный
              вариант.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
