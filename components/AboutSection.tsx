'use client';

import { motion } from 'framer-motion';

const perks = [
  'удобное расписание',
  'современные программы',
  'сильная атмосфера',
  'комфортное пространство',
  'подходит для начинающих и опытных',
  'выразительный интерьер',
  'пробное посещение'
];

export function AboutSection() {
  return (
    <section className="section-shell border-t border-white/10">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <h2 className="text-3xl font-semibold md:text-4xl">О клубе</h2>
        <p className="mt-5 max-w-4xl text-white/80">
          «Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс.
          У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная
          атмосфера.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-lime">Часы работы клуба</h3>
          <ul className="mt-4 space-y-2 text-white/85">
            <li>Пн – Чт: с 07:00 до 21:00</li>
            <li>Пт: с 07:00 до 20:45</li>
            <li>Сб – Вс: с 09:00 до 17:45</li>
          </ul>
          <p className="mt-4 rounded-xl border border-lime/40 bg-lime/10 p-3 text-sm font-semibold text-lime">
            КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {perks.map((perk) => (
            <div key={perk} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm capitalize">
              {perk}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
