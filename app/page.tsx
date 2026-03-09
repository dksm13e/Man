'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { weeklySchedule } from '@/data/schedule';

const galleryImages = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=1400&q=80'
];

const categories = {
  'Силовые программы': [
    ['АБТ', 'Силовой класс для проработки всех групп мышц (работа с инвентарем), помогает развить мышечную силу, улучшает рельеф.'],
    ['90/60/90', 'Силовой урок направленный на развитие выносливости мышц живота, ягодиц, груди.'],
    ['АБЛ', 'Силовой урок для тренировки нижней части тела и брюшного пресса.'],
    ['БЕДРА “-”', 'Смешанный формат тренировки (1 часть – аэробная или танцевальная, 2 часть – силовая на ноги, бедра, ягодицы).'],
    ['СУПЕР ПРЕСС', 'Силовой урок для тренировки мышц брюшного пресса (работа с инвентарем).'],
    ['АНТИЦЕЛ. ТРЕНИНГ', 'Силовой урок для всех основных мышечных групп с акцентом на мышцы бедер, ягодиц и пресса.'],
    ['МОЩНЫЙ КЛАСС', 'Силовая программа на все группы мышц (работа с инвентарем).'],
    ['Функциональный тренинг', 'Силовая тренировка на движениях из жизни, задействует максимальное количество мышечных групп.'],
    ['СКУЛЬПТОР ТЕЛА', 'Низко-ударная тренировка со штангой для коррекции фигуры и укрепления мышц.'],
    ['СИЛОВАЯ С ПЕТЛЯМИ', 'Функциональная тренировка с подвесными петлями.'],
    ['ДЖАМПИНГ', 'Силовая + аэробная кардио-тренировка на специальных шестиугольных батутах.'],
    ['КРУГОВАЯ', 'Круговая тренировка с поочередным выполнением упражнений с минимальным отдыхом.']
  ],
  'Аэробные программы': [
    ['Смешанный тренинг', 'Включает различные танцевальные стили, базовую степ-аэробику и силовой класс.'],
    ['Фитбол', 'Урок с использованием специальных мячей для гибкости, координации и осанки.'],
    ['Степ 1', 'Урок для начинающих: степ-аэробика + силовая часть.']
  ],
  'Танцевальные программы': [['ЗУМБА', 'Танцевальная фитнес-программа, сочетающая аэробные упражнения и танцевальные элементы.']]
} as const;

export default function HomePage() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [category, setCategory] = useState<keyof typeof categories>('Силовые программы');
  const [openProgram, setOpenProgram] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setGalleryIndex((prev) => (prev + 1) % galleryImages.length), 4500);
    return () => clearInterval(t);
  }, []);

  const currentPrograms = useMemo(() => categories[category], [category]);

  return (
    <main className="overflow-x-hidden bg-carbon text-soft">
      <section className="wall-texture relative isolate min-h-screen px-4 py-20 md:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="inline-flex w-fit items-center rounded-full border border-lime/50 bg-lime/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-lime">Энерджи фитнес-клуб</div>
          <div className="space-y-3">
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-5xl font-black uppercase leading-[0.85] text-soft sm:text-7xl md:text-9xl">
              <span className="block tracking-[0.22em] [text-shadow:0_0_20px_rgba(216,230,0,0.2)]">Э Н Е Р Д Ж И</span>
              <span className="mt-4 block text-xl font-medium tracking-[0.2em] text-soft/80 md:text-3xl">фитнес-клуб</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-semibold text-lime md:text-3xl">Энергия движения. Сила результата.</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="max-w-2xl text-base leading-relaxed text-soft/85 md:text-lg">Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.</motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4">
            <a href="#schedule" className="rounded-xl border border-lime bg-lime px-6 py-3 font-semibold text-carbon transition-all duration-300 hover:-translate-y-0.5 hover:shadow-limeGlow">Смотреть расписание</a>
            <a href="tel:+79000000000" className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 font-semibold text-soft transition-all duration-300 hover:border-lime hover:text-lime">Позвонить</a>
          </motion.div>
        </motion.div>
      </section>

      <section id="gallery" className="px-4 py-16 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="section-title">Галерея клуба</h2>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-charcoal/40 px-3 py-8 md:px-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
              {galleryImages.map((src, i) => {
                const active = i === galleryIndex;
                return (
                  <motion.button key={src} onClick={() => setGalleryIndex(i)} className={`relative h-52 min-w-[72%] overflow-hidden rounded-2xl border md:h-80 md:min-w-[48%] ${active ? 'border-lime shadow-limeGlow' : 'border-white/15'}`} animate={{ scale: active ? 1 : 0.93, opacity: active ? 1 : 0.55 }} transition={{ duration: 0.45 }}>
                    <Image src={src} alt={`Зал клуба ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 80vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length)} className="rounded-lg border border-white/20 px-3 py-1 hover:border-lime">←</button>
              <button onClick={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)} className="rounded-lg border border-white/20 px-3 py-1 hover:border-lime">→</button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card-premium p-6">
            <h2 className="section-title">О клубе</h2>
            <p className="mt-4 text-soft/90">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс.</p>
            <ul className="mt-4 grid list-none gap-2 p-0 text-soft/85">
              {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <div className="card-premium p-6">
            <h3 className="text-2xl font-bold">Часы работы клуба</h3>
            <div className="mt-3 space-y-2 text-soft/90">
              <p>Пн – Чт: с 07:00 до 21:00</p><p>Пт: с 07:00 до 20:45</p><p>Сб – Вс: с 09:00 до 17:45</p>
            </div>
            <p className="mt-6 rounded-xl border border-lime/40 bg-lime/10 p-3 font-semibold text-lime">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Групповые программы</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(categories) as Array<keyof typeof categories>).map((cat) => (
              <button key={cat} onClick={() => { setCategory(cat); setOpenProgram(null); }} className={`rounded-xl border px-4 py-2 transition-all ${category === cat ? 'border-lime bg-lime text-carbon' : 'border-white/20 bg-white/5 hover:border-lime/70'}`}>{cat}</button>
            ))}
          </div>
          <div className="space-y-3">
            {currentPrograms.map(([title, desc]) => {
              const open = openProgram === title;
              return (
                <motion.div key={title} className="card-premium overflow-hidden" whileHover={{ borderColor: 'rgba(200,214,0,0.6)' }}>
                  <button className="flex w-full items-center justify-between px-5 py-4 text-left" onClick={() => setOpenProgram(open ? null : title)}>
                    <span className="font-semibold">{title}</span>
                    <span className="text-lime">{open ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-4 text-soft/80">
                        {desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="schedule" className="px-4 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Расписание</h2>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div className="card-premium p-5">
              <div className="flex flex-wrap gap-2">
                {weeklySchedule.map((day, idx) => (
                  <button key={day.day} onClick={() => setDayIndex(idx)} className={`rounded-lg px-3 py-2 text-sm transition-all ${dayIndex === idx ? 'bg-lime text-carbon' : 'bg-white/5 hover:bg-white/10'}`}>{day.day}</button>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[...weeklySchedule[dayIndex].items].sort((a, b) => a.time.localeCompare(b.time)).map((item) => (
                  <div key={`${item.time}-${item.className}-${item.coach}`} className="card-premium flex items-center justify-between p-3 hover:shadow-limeGlow">
                    <span className="text-lime">{item.time}</span>
                    <span className="font-medium">{item.className}</span>
                    <span className="text-soft/70">{item.coach}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-premium p-4">
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-soft/60">Фото расписания (источник)</p>
              <div className="relative h-80 overflow-hidden rounded-xl border border-white/10">
                <Image src="https://picsum.photos/900/1200" alt="Фото расписания фитнес-клуба" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 35vw" />
              </div>
              <p className="mt-3 text-sm text-soft/70">Данные в блоке слева вручную собраны по фото расписания и хранятся в локальном файле.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-10"><div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">{[['Старт','доступ в клуб в базовом формате','групповые программы','пробное знакомство'],['Стандарт','полный доступ в часы работы клуба','групповые программы','приоритетная запись'],['Полный','расширенный доступ','максимум возможностей','выгодные условия']].map((tariff,i)=><div key={tariff[0]} className={`card-premium p-6 ${i===1?'border-lime/60 shadow-limeGlow':''}`}><h3 className="text-2xl font-bold">{tariff[0]}</h3><ul className="mt-4 space-y-2 text-soft/85">{tariff.slice(1).map((f)=><li key={f}>• {f}</li>)}</ul></div>)}</div></section>

      <section className="px-4 py-16 md:px-10"><div className="mx-auto max-w-6xl rounded-3xl border border-lime/40 bg-gradient-to-br from-lime/20 to-transparent p-8"><h2 className="section-title">Готовы начать?</h2><p className="mt-3 text-soft/85">Основной сценарий — быстрый звонок в клуб.</p><a href="tel:+79000000000" className="mt-5 inline-block rounded-xl bg-lime px-6 py-3 font-bold text-carbon transition hover:shadow-limeGlow">Позвонить: +7 (900) 000-00-00</a><a href="tel:+79000000000" className="ml-3 mt-5 inline-block rounded-xl border border-white/20 px-6 py-3">Записаться на пробную тренировку</a></div></section>

      <section className="px-4 py-16 md:px-10"><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2"><div className="card-premium p-6"><h2 className="section-title">Контакты</h2><p className="mt-3">Адрес: г. Примерск, ул. Спортивная, 12</p><p>Телефон: +7 (900) 000-00-00</p><p>Мессенджеры: Telegram / WhatsApp</p><p>Часы работы: ежедневно по графику клуба</p><button className="mt-4 rounded-xl border border-lime px-4 py-2 hover:bg-lime hover:text-carbon">Построить маршрут</button></div><div className="card-premium p-6"><div className="h-full min-h-52 rounded-xl border border-dashed border-white/20 bg-black/20 p-4 text-soft/60">Карта-заглушка</div></div></div></section>

      <section className="px-4 pb-20 md:px-10"><div className="mx-auto max-w-4xl"><h2 className="section-title mb-6">Частые вопросы</h2>{[
        ['Нужна ли предварительная запись?', 'На популярные вечерние группы лучше записаться заранее по телефону.'],
        ['Что взять с собой на тренировку?', 'Спортивную форму, сменную обувь, воду и полотенце.'],
        ['Есть ли пробное посещение?', 'Да, можно записаться на пробное знакомство с клубом.'],
        ['Как посмотреть расписание?', 'В разделе «Расписание» выберите нужный день недели.'],
        ['Когда нужно покинуть клуб?', 'Клиенты покидают клуб за 15 минут до закрытия.'],
        ['Подходит ли клуб для новичков?', 'Да, есть программы для начинающих и опытных участников.']
      ].map(([q,a])=><details key={q} className="card-premium mb-3 p-4 open:border-lime/60"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-soft/80">{a}</p></details>)}</div></section>
    </main>
  );
}
