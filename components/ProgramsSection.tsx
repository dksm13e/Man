'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProgramCategory } from '@/lib/types';

type Props = { categories: ProgramCategory[] };

export function ProgramsSection({ categories }: Props) {
  const [active, setActive] = useState(categories[0]?.id ?? '');
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section className="section-shell border-t border-white/10">
      <h2 className="text-3xl font-semibold md:text-4xl">Групповые программы</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActive(category.id)}
            className={`rounded-full px-5 py-2 text-sm transition ${
              active === category.id ? 'energy-gradient text-carbon' : 'border border-white/20 text-white/80 hover:border-lime'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        {current.items.map((item) => (
          <details key={item.name} className="group rounded-2xl border border-white/10 bg-white/5 p-5 open:border-lime/60">
            <summary className="cursor-pointer list-none font-semibold text-softLight">{item.name}</summary>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{item.description}</p>
          </details>
        ))}
      </motion.div>
    </section>
  );
}
