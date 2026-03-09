'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-14 md:grid-cols-[1.1fr,0.9fr] md:px-8 md:pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80">
          Энерджи фитнес-клуб
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Тренируйся <span className="bg-gradient-to-r from-indigo-300 to-rose-300 bg-clip-text text-transparent">с энергией</span> каждый день
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/70 md:text-lg">
          Пространство для силовых тренировок, функциональных классов и персонального прогресса. Современное оборудование,
          команда тренеров и атмосфера, в которую хочется возвращаться.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-gradient-to-r from-accent to-magma px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:scale-[1.02]">
            Записаться на пробную тренировку
          </button>
          <a href="#schedule" className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10">
            Смотреть расписание
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur"
      >
        <div className="grid gap-4">
          {[
            ['1200 м²', 'пространства для тренировок'],
            ['35+', 'классов в неделю'],
            ['6:30–23:00', 'режим работы без выходных']
          ].map(([value, label]) => (
            <div key={value} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
