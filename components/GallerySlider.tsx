'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const images = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1593079831125-43c67f4f49f8?auto=format&fit=crop&w=1400&q=80'
];

export function GallerySlider() {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const total = useMemo(() => images.length, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3500);

    return () => clearInterval(timer);
  }, [total]);

  useEffect(() => {
    const target = cardRefs.current[active];
    target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <section id="gallery" className="section">
      <div className="container">
        <h2>Галерея клуба</h2>
        <p className="section-intro">Живые кадры тренировочного ритма, пространства и атмосферы Энерджи фитнес-клуба.</p>
      </div>
      <div className="slider-track" role="region" aria-label="Фотогалерея">
        {images.map((src, index) => (
          <div
            key={src}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`slide ${index === active ? 'slide-active' : ''}`}
            onMouseEnter={() => setActive(index)}
          >
            <Image src={src} alt={`Тренировка в клубе, кадр ${index + 1}`} fill sizes="(max-width: 768px) 80vw, 38vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
