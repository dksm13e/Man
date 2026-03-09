'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { clubPhotos, phone, questions, scheduleCards, scheduleMeta, tariffs } from '@/data/site-data';
import { programCategories } from '@/data/programs-data';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const [openedProgram, setOpenedProgram] = useState('0-0');
  const allPrograms = useMemo(
    () =>
      programCategories.flatMap((category, catIndex) =>
        category.items.map((item, itemIndex) => ({
          id: `${catIndex}-${itemIndex}`,
          category: category.title,
          title: item[0],
          description: item[1]
        }))
      ),
    []
  );

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden border-b border-white/10 bg-hero-texture">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ x: [0, 40, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute left-[-10%] top-[15%] h-56 w-[55%] rotate-[-12deg] bg-lime/10 blur-3xl" />
          <div className="absolute bottom-[8%] right-[-5%] h-64 w-[45%] rotate-[18deg] bg-neon/10 blur-3xl" />
        </motion.div>
        <div className="section-shell relative z-10 py-16 sm:py-20 lg:py-28">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.14 } } }}>
            <motion.p variants={fadeInUp} className="mb-5 text-xs uppercase tracking-[0.4em] text-lime/90">городской фитнес нового уровня</motion.p>
            <motion.h1 variants={fadeInUp} className="font-black uppercase leading-[0.85] text-soft">
              <span className="block text-[18vw] tracking-[0.38em] sm:text-[12vw] lg:text-[10rem]">ЭНЕРДЖИ</span>
              <span className="mt-3 block text-xl font-semibold tracking-[0.25em] text-soft/85 sm:text-2xl">фитнес-клуб</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-8 max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">Энергия движения. Сила результата.</motion.p>
            <motion.p variants={fadeInUp} className="mt-4 max-w-2xl text-soft/75">
              Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <a href="#schedule" className="btn-primary">Смотреть расписание</a>
              <a href={phone.link} className="btn-secondary">Позвонить</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell pt-14">
        <h2 className="mb-6 text-sm uppercase tracking-[0.3em] text-lime">Атмосфера клуба</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex snap-x gap-5">
            {clubPhotos.map((photo, idx) => (
              <motion.div key={photo.src} className="relative h-64 min-w-[78%] snap-start overflow-hidden rounded-3xl border border-white/15 sm:min-w-[46%] lg:min-w-[32%]" whileHover={{ y: -6 }} transition={{ duration: 0.35 }}>
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.2em] text-soft/85">Кадр {idx + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="glass-panel p-6 sm:p-8">
          <h2 className="text-3xl font-bold">О клубе</h2>
          <p className="mt-4 text-soft/80">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
          <ul className="mt-6 grid gap-2 text-sm text-soft/80 sm:grid-cols-2">
            {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">• {item}</li>
            ))}
          </ul>
        </article>
        <article className="glass-panel p-6 sm:p-8">
          <h3 className="text-sm uppercase tracking-[0.22em] text-lime">Часы работы</h3>
          <ul className="mt-4 space-y-2 text-soft/85">
            <li>Пн – Чт: с 07:00 до 21:00</li>
            <li>Пт: с 07:00 до 20:45</li>
            <li>Сб – Вс: с 09:00 до 17:45</li>
          </ul>
          <p className="mt-6 rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-neon">
            Клиенты покидают клуб за 15 минут до закрытия
          </p>
        </article>
      </section>

      <section id="schedule" className="section-shell mt-16 grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-3xl font-bold">Расписание тренировок</h2>
          <p className="mt-3 text-soft/70">Раздел основан на актуальном фото расписания. Для удобства вынесли ключевые слоты в отдельные карточки.</p>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-lime/90">{scheduleMeta.updatedAt}</p>
          <div className="mt-6 grid gap-3">
            {scheduleCards.map((card) => (
              <motion.div key={card.day} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4" whileHover={{ y: -4 }}>
                <p className="text-sm uppercase tracking-[0.14em] text-lime">{card.day}</p>
                <p className="mt-1 text-lg font-semibold">{card.focus}</p>
                <p className="text-soft/70">{card.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div className="relative min-h-80 overflow-hidden rounded-3xl border border-white/15" whileHover={{ y: -5 }}>
          <Image src={scheduleMeta.image} alt="Фото расписания тренировок" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 to-transparent" />
          <p className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-carbon/70 px-4 py-2 text-xs uppercase tracking-[0.16em]">
            Фото расписания
          </p>
        </motion.div>
      </section>

      <section className="section-shell mt-16">
        <h2 className="text-3xl font-bold">Групповые программы</h2>
        <p className="mt-2 text-soft/70">Открыт только один пункт одновременно — удобно изучать программы по очереди.</p>
        <div className="mt-6 space-y-3">
          {allPrograms.map((program) => {
            const isOpen = openedProgram === program.id;
            return (
              <div key={program.id} className="glass-panel overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenedProgram(program.id)}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-lime/90">{program.category}</p>
                    <p className="mt-1 text-lg font-semibold">{program.title}</p>
                  </div>
                  <span className="text-2xl text-lime">{isOpen ? '−' : '+'}</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  className="overflow-hidden px-5"
                  transition={{ duration: 0.3 }}
                >
                  <p className="pb-4 text-soft/75">{program.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-shell mt-16">
        <h2 className="text-3xl font-bold">Тарифы</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tariffs.map((tariff) => (
            <motion.article
              key={tariff.name}
              className={`rounded-3xl border p-6 ${tariff.highlighted ? 'border-lime bg-lime/10 shadow-glow' : 'border-white/15 bg-white/[0.02]'}`}
              whileHover={{ y: -6 }}
            >
              <h3 className="text-2xl font-semibold">{tariff.name}</h3>
              <ul className="mt-4 space-y-2 text-soft/80">
                {tariff.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="glass-panel p-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime">Запись через звонок</p>
          <a href={phone.link} className="mt-3 block text-4xl font-black tracking-[0.08em] text-soft">{phone.display}</a>
          <a href={phone.link} className="btn-primary mt-6">Позвонить</a>
        </div>
      </section>

      <section className="section-shell mt-16 grid gap-6 lg:grid-cols-2">
        <article className="glass-panel p-6">
          <h2 className="text-3xl font-bold">Контакты</h2>
          <ul className="mt-4 space-y-2 text-soft/80">
            <li>Адрес: г. Ваш Город, ул. Спортивная, 10</li>
            <li>Телефон: {phone.display}</li>
            <li>Мессенджеры: Telegram / WhatsApp</li>
            <li>Часы работы: ежедневно по расписанию клуба</li>
          </ul>
          <a href="#" className="btn-secondary mt-5">Построить маршрут</a>
        </article>
        <article className="glass-panel grid min-h-64 place-items-center p-6 text-soft/65">
          <p>Карта-заглушка (вставьте iframe карты клуба)</p>
        </article>
      </section>

      <section className="section-shell mt-16">
        <h2 className="text-3xl font-bold">Частые вопросы</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {questions.map((q) => (
            <div key={q} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-soft/80">{q}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
