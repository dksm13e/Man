'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { faqItems, galleryImages, navItems, programs } from '@/lib/data';
import { ScheduleRow, weekdays } from '@/lib/schedule';

type Props = {
  scheduleRows: ScheduleRow[];
  scheduleSource: 'excel' | 'demo';
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SitePage({ scheduleRows, scheduleSource }: Props) {
  const [tab, setTab] = useState(Object.keys(programs)[0]);
  const [day, setDay] = useState(weekdays[0]);
  const [openQuestion, setOpenQuestion] = useState(0);

  const filteredSchedule = useMemo(
    () => scheduleRows.filter((item) => item.day.toLowerCase() === day.toLowerCase()).sort((a, b) => a.time.localeCompare(b.time)),
    [day, scheduleRows]
  );

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
  };

  return (
    <main className="pb-20">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-carbon/80 backdrop-blur">
        <nav className="section-wrap flex overflow-x-auto py-4 text-sm text-softlight/90">
          <div className="flex gap-5 whitespace-nowrap">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="transition hover:text-lime">
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section id="home" className="relative overflow-hidden soft-grid">
        <div className="section-wrap relative flex min-h-[86vh] flex-col justify-center py-16 md:py-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <p className="mb-4 inline-block border border-lime/50 px-3 py-1 text-xs uppercase tracking-[0.35em] text-lime">городской фитнес нового ритма</p>
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.12em' }}
              transition={{ duration: 1.1 }}
              className="text-[18vw] font-black uppercase leading-[0.86] text-white md:text-[11rem]"
            >
              ЭНЕРДЖИ
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="mt-2 text-2xl text-softlight/90 md:text-4xl">
              фитнес-клуб
            </motion.p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.25 }} className="mt-8 max-w-2xl space-y-5">
            <p className="text-2xl font-semibold text-softlight md:text-3xl">Энергия движения. Сила результата.</p>
            <p className="text-softlight/80">
              Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#trial" className="rounded-md bg-lime px-6 py-3 font-semibold text-carbon transition hover:bg-neonline">Записаться на пробную тренировку</a>
              <a href="#schedule" className="rounded-md border border-lime/50 px-6 py-3 font-semibold text-lime transition hover:bg-lime/10">Смотреть расписание</a>
            </div>
          </motion.div>

          <motion.div
            animate={{ x: [0, 20, 0], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            className="pointer-events-none absolute right-0 top-20 h-44 w-44 rounded-full bg-lime/25 blur-3xl"
          />
        </div>
      </section>

      <section id="gallery" className="py-16">
        <div className="section-wrap">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Галерея атмосферы клуба</h2>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {galleryImages.map((src, index) => (
              <motion.article
                key={src}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative h-72 min-w-[78%] snap-center overflow-hidden rounded-2xl border border-white/10 md:min-w-[38%]"
              >
                <Image src={src} alt={`Фото клуба ${index + 1}`} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 to-transparent" />
                <p className="absolute bottom-4 left-4 text-sm text-softlight/90">Кадр {index + 1}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-wrap grid gap-6 py-16 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-charcoal/50 p-6">
          <h2 className="text-3xl font-bold">О клубе</h2>
          <p className="mt-4 text-softlight/80">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
          <ul className="mt-5 grid gap-2 text-sm text-softlight/80 sm:grid-cols-2">
            {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((item) => (
              <li key={item} className="rounded-md border border-white/10 px-3 py-2">{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-lime/40 bg-lime/10 p-6">
          <h3 className="text-2xl font-bold text-lime">Часы работы клуба</h3>
          <ul className="mt-4 space-y-2 text-softlight">
            <li>Пн – Чт: с 07:00 до 21:00</li>
            <li>Пт: с 07:00 до 20:45</li>
            <li>Сб – Вс: с 09:00 до 17:45</li>
          </ul>
          <p className="mt-8 border border-lime/50 bg-carbon/70 p-4 text-sm font-semibold uppercase tracking-wider text-lime">Клиенты покидают клуб за 15 минут до закрытия</p>
        </article>
      </section>

      <section id="programs" className="section-wrap py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Групповые программы</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {Object.keys(programs).map((key) => (
            <button key={key} onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm transition ${tab === key ? 'bg-lime text-carbon' : 'border border-white/20 text-softlight hover:border-lime/60'}`}>
              {key}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="contents">
              {programs[tab as keyof typeof programs].map(([name, desc]) => (
                <article key={name} className="rounded-xl border border-white/10 bg-charcoal/40 p-4">
                  <h3 className="font-semibold text-lime">{name}</h3>
                  <p className="mt-2 text-sm text-softlight/80">{desc}</p>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="schedule" className="section-wrap py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold md:text-4xl">Расписание</h2>
          {scheduleSource === 'demo' ? <span className="rounded-md border border-lime/40 bg-lime/10 px-3 py-1 text-xs text-lime">Показано демо-расписание: добавьте файл data/schedule.xlsx</span> : null}
        </div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {weekdays.map((item) => (
            <button key={item} onClick={() => setDay(item)} className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${day === item ? 'bg-lime text-carbon' : 'border border-white/20 text-softlight/80'}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {filteredSchedule.length ? (
            filteredSchedule.map((row, index) => (
              <article key={`${row.time}-${index}`} className="rounded-xl border border-white/10 bg-charcoal/30 p-4">
                <p className="text-xl font-bold text-lime">{row.time}</p>
                <p className="mt-2 font-semibold">{row.program}</p>
                <p className="text-sm text-softlight/80">Тренер: {row.coach} · {row.hall}</p>
                {row.comment ? <p className="mt-2 text-xs text-softlight/60">{row.comment}</p> : null}
              </article>
            ))
          ) : (
            <p className="text-softlight/70">На выбранный день пока нет занятий.</p>
          )}
        </div>
      </section>

      <section id="pricing" className="section-wrap py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Тарифы</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['Старт', ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство']],
            ['Стандарт', ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись']],
            ['Полный', ['расширенный доступ', 'максимум возможностей', 'выгодные условия']]
          ].map(([title, features], idx) => (
            <article key={title} className={`rounded-2xl border p-5 ${idx === 1 ? 'border-lime bg-lime/10 shadow-lime' : 'border-white/10 bg-charcoal/40'}`}>
              {idx === 1 ? <p className="mb-2 inline-block rounded-full bg-lime px-2 py-1 text-xs font-bold text-carbon">Рекомендуем</p> : null}
              <h3 className="text-2xl font-bold">{title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-softlight/80">
                {(features as string[]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <a href="#trial" className="mt-5 inline-block rounded-md bg-white/10 px-4 py-2 text-sm transition hover:bg-lime hover:text-carbon">Кнопка записи</a>
            </article>
          ))}
        </div>
      </section>

      <section id="contacts" className="section-wrap grid gap-4 py-16 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-charcoal/40 p-6">
          <h2 className="text-3xl font-bold">Контакты</h2>
          <ul className="mt-4 space-y-2 text-softlight/80">
            <li>Адрес: г. Минск, проспект Победителей, 25</li>
            <li>Телефон: +375 (29) 123-45-67</li>
            <li>Мессенджеры: Telegram / Viber / WhatsApp</li>
            <li>Пн – Чт: с 07:00 до 21:00, Пт: с 07:00 до 20:45, Сб – Вс: с 09:00 до 17:45</li>
          </ul>
          <button className="mt-4 rounded-md bg-lime px-4 py-2 font-semibold text-carbon">Построить маршрут</button>
        </article>
        <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-charcoal to-carbon p-6">
          <p className="mb-2 text-sm text-softlight/70">Карта (заглушка)</p>
          <div className="h-60 rounded-xl border border-dashed border-lime/40 bg-carbon/70" />
        </article>
      </section>

      <section id="questions" className="section-wrap py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Частые вопросы</h2>
        <div className="mt-6 space-y-3">
          {faqItems.map(([q, a], index) => (
            <article key={q} className="rounded-xl border border-white/10 bg-charcoal/35">
              <button onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)} className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold">
                {q}
                <span>{openQuestion === index ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openQuestion === index ? (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-4 text-sm text-softlight/80">
                    {a}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </section>

      <section id="trial" className="section-wrap grid gap-4 py-16 lg:grid-cols-2">
        {[['Запись на пробную тренировку', 'Оставьте заявку, и мы подберем удобный формат тренировок.'], ['Заявка на консультацию', 'Ответим на вопросы по программам, расписанию и тарифам.']].map(([title, text]) => (
          <form key={title} onSubmit={submitForm} className="rounded-2xl border border-white/10 bg-charcoal/45 p-6">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-softlight/70">{text}</p>
            <div className="mt-4 space-y-3">
              <input required minLength={2} name="name" placeholder="Имя" className="w-full rounded-md border border-white/20 bg-carbon px-3 py-2" />
              <input required pattern="[0-9+()\-\s]{7,}" name="phone" placeholder="Телефон" className="w-full rounded-md border border-white/20 bg-carbon px-3 py-2" />
              <input required name="time" placeholder="Удобное время для связи" className="w-full rounded-md border border-white/20 bg-carbon px-3 py-2" />
              <textarea name="comment" placeholder="Комментарий" className="min-h-24 w-full rounded-md border border-white/20 bg-carbon px-3 py-2" />
              <button type="submit" className="w-full rounded-md bg-lime py-3 font-semibold text-carbon transition hover:bg-neonline">Отправить заявку</button>
            </div>
          </form>
        ))}
      </section>
    </main>
  );
}
