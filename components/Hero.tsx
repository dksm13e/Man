'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { galleryImages } from '@/data/siteData';

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % galleryImages.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="main" className="relative overflow-hidden border-b border-lime/20">
      <div className="absolute inset-0 bg-sport-grid bg-[size:30px_30px] opacity-20" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-lime">Премиальный городской фитнес</p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Энерджи — фитнес-клуб</h1>
          <p className="mt-5 text-2xl font-semibold text-light">Энергия движения. Сила результата.</p>
          <p className="mt-4 max-w-xl text-light/80">Современный фитнес-клуб с групповыми программами, комфортной атмосферой и выразительным характером.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#trial" className="rounded-full bg-lime px-6 py-3 font-semibold text-graphite shadow-lime transition hover:bg-neonline">Записаться на пробную тренировку</a>
            <a href="#schedule" className="rounded-full border border-lime/60 px-6 py-3 font-semibold text-light transition hover:border-lime hover:text-lime">Смотреть расписание</a>
          </div>
        </div>

        <div className="relative h-[300px] overflow-hidden rounded-3xl border border-lime/30 bg-charcoal md:h-[420px]">
          {galleryImages.map((image, i) => (
            <motion.div
              key={image}
              className="absolute inset-0"
              animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.06 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex h-full items-end justify-start bg-gradient-to-br from-charcoal to-graphite p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-lime/80">Слайд {i + 1}</p>
                  <p className="mt-2 text-light/90">Добавьте фото: {image}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
