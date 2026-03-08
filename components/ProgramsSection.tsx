'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ProgramCategory, programs } from '@/data/siteData';

const categories: ProgramCategory[] = ['Силовые программы', 'Аэробные программы', 'Танцевальные программы'];

export function ProgramsSection() {
  const [active, setActive] = useState<ProgramCategory>('Силовые программы');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => programs.filter((item) => item.category === active), [active]);

  return (
    <section id="programs" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title">Групповые программы</h2>
      <p className="section-subtitle">Выберите категорию и откройте карточки программ с подробными описаниями.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button key={category} onClick={() => setActive(category)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${active === category ? 'bg-lime text-graphite' : 'bg-charcoal text-light hover:text-lime'}`}>
            {category}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const isOpen = expanded === item.title;
          return (
            <motion.article key={item.title} layout className="rounded-2xl border border-lime/20 bg-charcoal/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-light">{item.title}</h3>
                <button onClick={() => setExpanded(isOpen ? null : item.title)} className="text-sm font-semibold text-lime">
                  {isOpen ? 'Скрыть' : 'Подробнее'}
                </button>
              </div>
              {isOpen && <p className="mt-3 text-light/80">{item.description}</p>}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
