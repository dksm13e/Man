import { Hero } from '@/components/Hero';
import { ProgramsSection } from '@/components/ProgramsSection';
import { ScheduleSection } from '@/components/ScheduleSection';
import { FAQ } from '@/components/FAQ';
import { ContactForms } from '@/components/ContactForms';
import { advantages, galleryImages, navItems, tariffs, workHours } from '@/data/siteData';
import { getScheduleData } from '@/lib/schedule';

export default async function Page() {
  const schedule = await getScheduleData();

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-lime/20 bg-graphite/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#main" className="text-lg font-black text-lime">Энерджи — фитнес-клуб</a>
          <ul className="hidden gap-4 text-sm md:flex">
            {navItems.map((item) => (
              <li key={item.href}><a href={item.href} className="text-light/80 transition hover:text-lime">{item.label}</a></li>
            ))}
          </ul>
        </nav>
      </header>

      <Hero />

      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="section-title">О клубе</h2>
        <p className="section-subtitle">«Энерджи — фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия, удобное расписание и яркая спортивная атмосфера.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-lime/30 bg-charcoal/70 p-6">
            <h3 className="text-2xl font-bold">Часы работы</h3>
            <ul className="mt-3 space-y-1 text-light/85">
              <li>{workHours.week}</li>
              <li>{workHours.fri}</li>
              <li>{workHours.weekend}</li>
            </ul>
            <p className="mt-4 rounded-xl border border-lime/40 bg-graphite p-3 text-sm font-bold text-lime">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
          </article>
          <article className="rounded-2xl border border-lime/20 bg-charcoal/70 p-6">
            <h3 className="text-2xl font-bold">Преимущества</h3>
            <ul className="mt-3 grid gap-2 text-light/85 sm:grid-cols-2">
              {advantages.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <ProgramsSection />
      <ScheduleSection {...schedule} />

      <section id="tariffs" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="section-title">Тарифы</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {tariffs.map((tariff) => (
            <article key={tariff.name} className={`rounded-2xl border p-6 ${tariff.recommended ? 'border-lime bg-lime/10 shadow-lime' : 'border-lime/20 bg-charcoal/70'}`}>
              {tariff.recommended ? <p className="text-xs uppercase tracking-[0.2em] text-lime">Рекомендуем</p> : null}
              <h3 className="mt-2 text-2xl font-black">{tariff.name}</h3>
              <ul className="mt-4 space-y-2 text-light/85">{tariff.features.map((f) => <li key={f}>• {f}</li>)}</ul>
              <a href="#trial" className="mt-6 inline-block rounded-full bg-lime px-5 py-2 font-semibold text-graphite">Записаться</a>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="bg-charcoal/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="section-title">Галерея</h2>
          <p className="section-subtitle">Добавьте реальные фото в папку /public/images. Пока используются безопасные текстовые заглушки.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <article key={image} className="rounded-2xl border border-lime/20 bg-graphite p-4">
                <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-lime/30 bg-charcoal text-sm text-light/70">Слайд {index + 1}<br />{image}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="section-title">Контакты</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-lime/20 bg-charcoal/70 p-6 text-light/85">
            <p><span className="text-lime">Адрес:</span> г. Минск, ул. Спортивная, 12</p>
            <p className="mt-2"><span className="text-lime">Телефон:</span> +375 (29) 000-00-00</p>
            <p className="mt-2"><span className="text-lime">Мессенджеры:</span> Telegram / WhatsApp</p>
            <p className="mt-2"><span className="text-lime">Часы работы:</span><br />{workHours.week}<br />{workHours.fri}<br />{workHours.weekend}</p>
            <button className="mt-5 rounded-full border border-lime px-5 py-2 font-semibold text-lime">Построить маршрут</button>
          </article>
          <article className="rounded-2xl border border-lime/20 bg-graphite p-6">
            <div className="flex h-full min-h-56 items-center justify-center rounded-xl border border-dashed border-lime/30 bg-charcoal text-light/70">Карта-заглушка</div>
          </article>
        </div>
      </section>

      <FAQ />
      <ContactForms />
    </main>
  );
}
