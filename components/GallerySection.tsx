'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const photos = [
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1600&q=80'
];

function Lightbox({ index, onClose, onPrev, onNext }: { index: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  const onTouchEnd = (value: number) => {
    if (touchStart === null) return;
    const delta = value - touchStart;
    if (delta < -45) onNext();
    if (delta > 45) onPrev();
    setTouchStart(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-8"
        onClick={onClose}
      >
        <button className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 p-2" onClick={onClose} aria-label="Закрыть">
          <X className="h-5 w-5" />
        </button>
        <button className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 md:block" onClick={(e) => {e.stopPropagation(); onPrev();}} aria-label="Назад">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 md:block" onClick={(e) => {e.stopPropagation(); onNext();}} aria-label="Вперед">
          <ChevronRight className="h-6 w-6" />
        </button>

        <motion.div
          key={photos[index]}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative h-[82vh] w-full max-w-6xl"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => setTouchStart(e.changedTouches[0].clientX)}
          onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
        >
          <Image src={photos[index]} alt={`Интерьер клуба ${index + 1}`} fill className="object-contain" sizes="100vw" priority />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-4 py-2 text-sm text-white/90">
            {index + 1} / {photos.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function GallerySection() {
  const [active, setActive] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const cinematic = useMemo(() => {
    const result = [] as { idx: number; cls: string }[];
    for (let offset = -2; offset <= 2; offset += 1) {
      const idx = (active + offset + photos.length) % photos.length;
      const cls = offset === 0 ? 'scale-100 opacity-100' : Math.abs(offset) === 1 ? 'scale-95 opacity-80' : 'scale-90 opacity-55';
      result.push({ idx, cls });
    }
    return result;
  }, [active]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/50">Фотогалерея</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Cinematic-лента клуба</h2>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] p-3 md:p-5">
        <div className="flex gap-3 overflow-hidden md:gap-4">
          {cinematic.map((item) => (
            <button
              key={`${item.idx}-${active}`}
              onClick={() => {
                setActive(item.idx);
                setLightboxIndex(item.idx);
              }}
              className={`relative h-52 flex-1 overflow-hidden rounded-2xl transition duration-300 md:h-80 ${item.cls}`}
            >
              <Image src={photos[item.idx]} alt={`Фото ${item.idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 40vw, 20vw" />
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => setActive((p) => (p - 1 + photos.length) % photos.length)} className="rounded-full border border-white/20 p-2"><ChevronLeft /></button>
          <button onClick={() => setActive((p) => (p + 1) % photos.length)} className="rounded-full border border-white/20 p-2"><ChevronRight /></button>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((p) => (p === null ? 0 : (p - 1 + photos.length) % photos.length))}
          onNext={() => setLightboxIndex((p) => (p === null ? 0 : (p + 1) % photos.length))}
        />
      )}
    </section>
  );
}
