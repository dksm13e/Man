'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

const days = [
  { id: 'Пн', title: 'Силовой микс', time: '07:30 • 18:30' },
  { id: 'Вт', title: 'Функциональный круг', time: '08:00 • 19:00' },
  { id: 'Ср', title: 'Мобилити + Core', time: '07:30 • 20:00' },
  { id: 'Чт', title: 'HIIT Interval', time: '08:30 • 19:30' },
  { id: 'Пт', title: 'Body Sculpt', time: '07:00 • 18:00' },
  { id: 'Сб', title: 'Energy Bootcamp', time: '10:00 • 12:00' }
];

const scheduleImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=80';

export function ScheduleSection() {
  const [active, setActive] = useState(days[0].id);
  const [open, setOpen] = useState(false);

  const selected = days.find((d) => d.id === active) ?? days[0];

  return (
    <section id="schedule" className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-[1.1fr,0.9fr] md:px-8">
      <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-white/50">Расписание</p>
        <h2 className="mt-2 text-3xl font-semibold">Тренировки по дням</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => setActive(day.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${active === day.id ? 'bg-white text-black' : 'border border-white/20 text-white/80 hover:bg-white/10'}`}
            >
              {day.id}
            </button>
          ))}
        </div>

        <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xl font-medium">{selected.title}</p>
          <p className="mt-2 text-white/70">Время: {selected.time}</p>
        </motion.div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.02] p-6 text-left"
      >
        <p className="text-sm uppercase tracking-[0.18em] text-white/50">Полная сетка</p>
        <p className="mt-2 text-2xl font-semibold">Открыть расписание на весь месяц</p>
        <p className="mt-3 text-white/70">Нажмите, чтобы сразу открыть полноразмерное фото расписания.</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm group-hover:bg-white/10">
          Открыть сейчас <ExternalLink className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 p-3 md:p-8" onClick={() => setOpen(false)}>
            <button className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 p-2" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
              <Image src={scheduleImage} alt="Полное расписание клуба" fill className="object-contain" sizes="100vw" priority />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
