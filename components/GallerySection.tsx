'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = { images: string[] };

export function GallerySection({ images }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [images.length]);

  const prev = () => setActive((value) => (value - 1 + images.length) % images.length);
  const next = () => setActive((value) => (value + 1) % images.length);

  return (
    <section className="section-shell">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold md:text-4xl">Атмосфера клуба</h2>
        <p className="mt-3 max-w-2xl text-white/70">Пространство, где тренировки становятся привычкой, а движение — стилем жизни.</p>
      </motion.div>

      <div className="mt-10 overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: `calc(-${active} * (80% + 1rem))` }}
          transition={{ type: 'spring', stiffness: 90, damping: 22 }}
          drag="x"
          dragConstraints={{ left: -500, right: 500 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) next();
            if (info.offset.x > 100) prev();
          }}
        >
          {images.map((src, index) => (
            <article
              key={src}
              className={`relative h-64 min-w-[80%] overflow-hidden rounded-3xl border border-white/10 md:h-[380px] md:min-w-[58%] ${
                active === index ? 'scale-[1.01] shadow-glow' : 'opacity-70'
              } transition`}
            >
              <Image src={src} alt={`Галерея клуба ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 80vw, 58vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent" />
            </article>
          ))}
        </motion.div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={prev} className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-lime hover:text-lime">Назад</button>
        <button onClick={next} className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-lime hover:text-lime">Вперед</button>
      </div>
    </section>
  );
}
