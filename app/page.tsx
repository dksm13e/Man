'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { clubPhotos, scheduleByDay, scheduleImage } from '@/data/siteData';

const programGroups = [
  {
    category: 'Силовые программы',
    items: [
      ['АБТ', 'Силовой класс для проработки всех групп мышц (работа с инвентарем), помогает развить мышечную силу, улучшает рельеф.'],
      ['90/60/90', 'Силовой урок направленный на развитие выносливости мышц живота, ягодиц, груди.'],
      ['АБЛ', 'Силовой урок для тренировки нижней части тела и брюшного пресса.'],
      ['БЕДРА “-”', 'Смешанный формат тренировки (1 часть – аэробная или танцевальная, 2 часть – силовая на ноги, бедра, ягодицы).'],
      ['СУПЕР ПРЕСС', 'Силовой урок для тренировки мышц брюшного пресса (работа с инвентарем).'],
      ['АНТИЦЕЛ. ТРЕНИНГ', 'Силовой урок для всех основных мышечных групп с акцентом на мышцы бедер, ягодиц и пресса. Способствует уменьшению жировой прослойки и коррекции проблемных зон.'],
      ['МОЩНЫЙ КЛАСС', 'Силовая программа на все группы мышц (работа с инвентарем).'],
      ['Функциональный тренинг', 'Силовая тренировка, построенная на движениях из жизни, позволяет задействовать максимальное количество мышечных групп.'],
      ['СКУЛЬПТОР ТЕЛА', 'Целостная программа низко-ударной тренировки с использованием штанги, направлена на коррекцию фигуры и укрепление мышц. Рекомендована с 17 лет и при высоком уровне подготовленности.'],
      ['СИЛОВАЯ С ПЕТЛЯМИ', 'Функциональная тренировка с использованием подвесных петель. Развивает гибкость, координацию, равновесие.'],
      ['ДЖАМПИНГ', 'Силовая + аэробная кардио-тренировка на специальных шестиугольных батутах.'],
      ['КРУГОВАЯ', 'Круговая тренировка, поочередное выполнение нескольких упражнений по кругу за определенный промежуток времени с минимальным отдыхом.']
    ]
  },
  {
    category: 'Аэробные программы',
    items: [
      ['Смешанный тренинг', 'Включает различные танцевальные стили, базовую степ-аэробику и силовой класс.'],
      ['Фитбол', 'Урок с использованием специальных мячей. Направлен на развитие гибкости, координации и исправление осанки.'],
      ['Степ 1', 'Урок для начинающих, состоящий из двух частей: степ-аэробика и силовая часть.']
    ]
  },
  {
    category: 'Танцевальные программы',
    items: [['ЗУМБА', 'Танцевальная фитнес-программа, которая подойдет каждому. Сочетает аэробные упражнения и танцевальные элементы.']]
  }
] as const;

const faq = [
  ['Нужна ли предварительная запись?', 'Да, для первого посещения и пробной тренировки лучше заранее связаться с клубом по телефону, чтобы подобрать удобное время.'],
  ['Что взять с собой на тренировку?', 'Удобную спортивную форму, сменную обувь, полотенце и воду. Если нужна консультация по первому посещению, администратор подскажет все детали.'],
  ['Есть ли пробное посещение?', 'Да, можно записаться на пробное посещение и познакомиться с клубом, атмосферой и тренировочными зонами.'],
  ['Как посмотреть расписание?', 'Актуальное расписание доступно на сайте в специальном разделе, а также его можно уточнить по телефону клуба.'],
  ['Когда нужно покинуть клуб?', 'Клиенты покидают клуб за 15 минут до закрытия.'],
  ['Подходит ли клуб для новичков?', 'Да, клуб подходит как для начинающих, так и для тех, кто давно занимается. Можно подобрать комфортный формат тренировок под свой уровень.']
] as const;

const days = Object.keys(scheduleByDay) as Array<keyof typeof scheduleByDay>;

export default function Home() {
  const [activeDay, setActiveDay] = useState<(typeof days)[number]>('Понедельник');
  const [activeProgram, setActiveProgram] = useState<string | null>('АБТ');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showScheduleImage, setShowScheduleImage] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const groupedPrograms = useMemo(() => programGroups.flatMap((g) => g.items.map((i) => ({ category: g.category, name: i[0], text: i[1] }))), []);

  return (
    <main className="overflow-x-hidden pb-16">
      <section className="relative texture">
        <div className="section-shell relative py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-lime/80">Сарапул · Первомайская 34</p>
            <h1 className="font-black uppercase leading-[0.85] text-soft text-[clamp(2.5rem,10vw,8rem)] tracking-[0.28em]">ЭНЕРДЖИ</h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mt-2 text-xl md:text-3xl text-soft/90">фитнес-клуб</motion.p>
            <p className="mt-8 text-2xl font-semibold text-white">Энергия движения. Сила результата.</p>
            <p className="mt-4 max-w-2xl text-base text-soft/80 md:text-lg">Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой для тех, кто ценит движение и результат.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#schedule" className="rounded-full border border-lime/70 bg-lime/10 px-6 py-3 font-medium text-lime transition hover:-translate-y-0.5 hover:shadow-glow">Смотреть расписание</a>
              <a href="tel:+79000000000" className="rounded-full border border-white/25 px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10">Позвонить</a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell pt-14">
        <h2 className="mb-5 text-2xl font-semibold">Атмосфера клуба</h2>
        <div className="flex snap-x gap-4 overflow-x-auto pb-2">
          {clubPhotos.map((src, idx) => (
            <button key={src} onClick={() => setPhotoIdx(idx)} className={`relative h-56 min-w-[75%] snap-center overflow-hidden rounded-2xl border transition md:min-w-[48%] ${idx === photoIdx ? 'border-lime/70' : 'border-white/10'}`}>
              <Image src={src} alt={`Фото клуба ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-3xl font-semibold">Групповые программы</h2>
        <p className="mt-2 text-soft/75">Современный accordion UI: открыт только один пункт.</p>
        <div className="mt-6 space-y-3">
          {groupedPrograms.map((p) => {
            const open = activeProgram === p.name;
            return (
              <div key={p.name} className="card overflow-hidden">
                <button onClick={() => setActiveProgram(open ? null : p.name)} className="flex w-full items-center justify-between px-4 py-3 text-left md:px-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-lime/80">{p.category}</p>
                    <p className="font-medium text-white">{p.name}</p>
                  </div>
                  <span className="text-lime">{open ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 text-sm text-soft/80 md:px-5">
                      {p.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section id="schedule" className="section-shell pt-16">
        <h2 className="text-3xl font-semibold">Расписание</h2>
        <p className="mt-2 text-soft/75">Выберите день недели и посмотрите занятия. Фото расписания можно открыть в полном размере.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card p-4">
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button key={day} onClick={() => setActiveDay(day)} className={`rounded-full px-4 py-2 text-sm transition ${activeDay === day ? 'bg-lime text-carbon' : 'bg-white/10 text-soft hover:bg-white/20'}`}>
                  {day}
                </button>
              ))}
            </div>
            <ul className="mt-5 space-y-2">
              {scheduleByDay[activeDay].map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-soft/90">{item}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => setShowScheduleImage(true)} className="card relative min-h-80 overflow-hidden p-2 transition hover:-translate-y-1">
            <Image src={scheduleImage} alt="Фото расписания Энерджи фитнес-клуб" fill className="object-contain p-3" />
          </button>
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-3xl font-semibold">Тарифы</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['Старт', ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство']],
            ['Стандарт', ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись']],
            ['Полный', ['расширенный доступ', 'максимум возможностей', 'выгодные условия']]
          ].map(([title, items], idx) => (
            <article key={title as string} className={`card p-5 transition hover:-translate-y-1 ${idx === 1 ? 'border-lime/70 bg-lime/10' : ''}`}>
              <h3 className="text-xl font-semibold">{title as string}</h3>
              <ul className="mt-4 space-y-2 text-soft/85">
                {(items as string[]).map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-3xl font-semibold">О клубе</h2>
        <p className="mt-3 text-soft/85">«Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <p>Пн – Чт: с 07:00 до 21:00</p>
            <p>Пт: с 07:00 до 20:45</p>
            <p>Сб – Вс: с 09:00 до 17:45</p>
            <p className="mt-4 font-semibold text-lime">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
          </div>
          <ul className="card grid grid-cols-1 gap-2 p-4 text-soft/90 sm:grid-cols-2">
            {['удобное расписание', 'современные программы', 'сильная атмосфера', 'комфортное пространство', 'подходит для начинающих и опытных', 'выразительный интерьер', 'пробное посещение'].map((v) => (
              <li key={v}>• {v}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-3xl font-semibold">Частые вопросы</h2>
        <div className="mt-6 space-y-3">
          {faq.map(([q, a], idx) => {
            const open = activeFaq === idx;
            return (
              <div key={q} className="card overflow-hidden">
                <button onClick={() => setActiveFaq(open ? null : idx)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <span>{q}</span>
                  <span className="text-lime">{open ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4 text-soft/80">
                      {a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-shell pt-16">
        <h2 className="text-3xl font-semibold">Контакты</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <p className="text-lg">Сарапул, Первомайская 34</p>
            <a href="tel:+79000000000" className="mt-3 inline-block text-2xl font-semibold text-lime">+7 (900) 000-00-00</a>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="tel:+79000000000" className="rounded-full bg-lime px-5 py-2 font-semibold text-carbon">Позвонить</a>
              <a target="_blank" rel="noreferrer" href="https://yandex.ru/maps/?rtext=~Сарапул,+Первомайская+34" className="rounded-full border border-white/30 px-5 py-2">Построить маршрут</a>
            </div>
          </div>
          <a target="_blank" rel="noreferrer" href="https://yandex.ru/maps/?text=Сарапул,+Первомайская+34" className="card relative min-h-64 overflow-hidden">
            <Image src={clubPhotos[photoIdx]} alt="Клуб на карте" fill className="object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-lg">Открыть карту</div>
          </a>
        </div>
      </section>

      <AnimatePresence>
        {showScheduleImage && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowScheduleImage(false)} className="fixed inset-0 z-50 bg-black/85 p-4">
            <div className="relative mx-auto h-full w-full max-w-5xl">
              <Image src={scheduleImage} alt="Полное фото расписания" fill className="object-contain" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
