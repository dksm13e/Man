'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const faq = [
  { q: 'Есть ли пробное посещение?', a: 'Да, вы можете оформить пробную тренировку с тренером и пройти вводный инструктаж.' },
  { q: 'Нужна ли предварительная запись на групповые?', a: 'Да, запись открывается в приложении клуба за 48 часов до занятия.' },
  { q: 'Есть ли персональные тренировки?', a: 'Да, доступны пакеты 8/12/24 занятия с персональным планом прогресса.' }
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <h2 className="text-3xl font-semibold">Частые вопросы</h2>
      <div className="mt-5 space-y-3">
        {faq.map((item, idx) => (
          <div key={item.q} className="rounded-2xl border border-white/15 bg-white/[0.03]">
            <button className="w-full px-5 py-4 text-left" onClick={() => setOpen(open === idx ? null : idx)}>
              {item.q}
            </button>
            {open === idx && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="px-5 pb-4 text-white/70">
                {item.a}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
