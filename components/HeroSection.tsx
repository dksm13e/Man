'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-carbon bg-radial-energy">
      <div className="grid-lines absolute inset-0 opacity-30" />
      <motion.div
        className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-lime/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-0 h-72 w-72 rounded-full bg-neonLime/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="section-shell relative py-20 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-sm uppercase tracking-[0.35em] text-lime"
        >
          Современный городской фитнес
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="leading-none"
        >
          <span className="block text-[16vw] font-black uppercase tracking-[0.28em] text-softLight md:text-[10vw]">
            ЭНЕРДЖИ
          </span>
          <span className="mt-3 block text-xl font-medium lowercase tracking-[0.35em] text-white/70 md:text-3xl">
            фитнес-клуб
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 max-w-3xl space-y-5"
        >
          <h2 className="text-2xl font-semibold text-lime md:text-4xl">Энергия движения. Сила результата.</h2>
          <p className="text-base text-white/85 md:text-lg">
            Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех,
            кто ценит движение и результат.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a href="#schedule" className="energy-gradient rounded-full px-8 py-3 text-center font-semibold text-carbon shadow-glow">
            Смотреть расписание
          </a>
          <a href="tel:+79000000000" className="rounded-full border border-white/35 px-8 py-3 text-center font-semibold transition hover:border-lime hover:text-lime">
            Позвонить
          </a>
        </motion.div>
      </div>
    </section>
  );
}
