'use client';

import { useState } from 'react';
import { faq } from '@/data/siteData';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="section-title">FAQ</h2>
      <div className="mt-8 space-y-3">
        {faq.map((item, index) => (
          <article key={item.q} className="rounded-2xl border border-lime/20 bg-charcoal/80 p-5">
            <button className="flex w-full items-center justify-between text-left text-lg font-semibold" onClick={() => setOpen(open === index ? null : index)}>
              {item.q}
              <span className="text-lime">{open === index ? '−' : '+'}</span>
            </button>
            {open === index ? <p className="mt-3 text-light/80">{item.a}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
