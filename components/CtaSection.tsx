'use client';

import { motion } from 'framer-motion';

export function CtaSection() {
  return (
    <section className="section-shell border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="energy-gradient rounded-3xl p-8 text-carbon md:p-10"
      >
        <p className="text-sm uppercase tracking-[0.28em]">Записаться в клуб</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">+7 (900) 000-00-00</h2>
        <p className="mt-3 max-w-2xl text-sm md:text-base">Основной сценарий — быстрый звонок администратору для записи и консультации.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="tel:+79000000000" className="rounded-full bg-carbon px-7 py-3 text-center font-semibold text-softLight">Позвонить</a>
          <a href="#" className="rounded-full border border-carbon/40 px-7 py-3 text-center font-semibold">Записаться на пробную тренировку</a>
        </div>
      </motion.div>
    </section>
  );
}
