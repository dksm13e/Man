import { FormsSection } from '@/components/FormsSection';
import { GallerySlider } from '@/components/GallerySlider';
import { HeroSection } from '@/components/HeroSection';
import { ProgramsSection } from '@/components/ProgramsSection';
import { Reveal } from '@/components/Reveal';
import { ScheduleSection } from '@/components/ScheduleSection';
import { getScheduleData } from '@/lib/schedule';

const benefits = [
  'удобное расписание',
  'современные программы',
  'сильная атмосфера',
  'комфортное пространство',
  'подходит для начинающих и опытных',
  'выразительный интерьер',
  'пробное посещение'
];

const prices = [
  {
    title: 'Старт',
    points: ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство']
  },
  {
    title: 'Стандарт',
    featured: true,
    points: ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись']
  },
  {
    title: 'Полный',
    points: ['расширенный доступ', 'максимум возможностей', 'выгодные условия']
  }
];

const faq = [
  'Нужна ли предварительная запись?',
  'Что взять с собой на тренировку?',
  'Есть ли пробное посещение?',
  'Как посмотреть расписание?',
  'Когда нужно покинуть клуб?',
  'Подходит ли клуб для новичков?'
];

export default function HomePage() {
  const schedule = getScheduleData();

  return (
    <main>
      <header className="topbar">
        <div className="container topbar-row">
          <a href="#glavnaya" className="logo">
            Энерджи фитнес-клуб
          </a>
          <nav>
            <a href="#about">О клубе</a>
            <a href="#programs">Групповые программы</a>
            <a href="#schedule">Расписание</a>
            <a href="#prices">Тарифы</a>
            <a href="#contacts">Контакты</a>
          </nav>
        </div>
      </header>

      <HeroSection />
      <GallerySlider />

      <section id="about" className="section">
        <div className="container">
          <Reveal>
            <h2>О клубе</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="section-intro">
              «Энерджи фитнес-клуб» — это пространство для тех, кто выбирает движение, силу, здоровье и
              стабильный прогресс. У нас сочетаются современный формат тренировок, групповые занятия,
              удобное расписание и яркая спортивная атмосфера.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="about-grid">
              <div className="about-card">
                <h3>Часы работы клуба</h3>
                <p>Пн – Чт: с 07:00 до 21:00</p>
                <p>Пт: с 07:00 до 20:45</p>
                <p>Сб – Вс: с 09:00 до 17:45</p>
                <p className="warning">КЛИЕНТЫ ПОКИДАЮТ КЛУБ ЗА 15 МИНУТ ДО ЗАКРЫТИЯ</p>
              </div>
              <ul className="about-card">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <ProgramsSection />
      <ScheduleSection items={schedule} />

      <section id="prices" className="section">
        <div className="container">
          <h2>Тарифы</h2>
          <div className="prices-grid">
            {prices.map((price) => (
              <article key={price.title} className={`price-card ${price.featured ? 'price-featured' : ''}`}>
                <h3>{price.title}</h3>
                <ul>
                  {price.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <a href="#trial" className="btn btn-secondary">
                  Выбрать
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container">
          <h2>Частые вопросы</h2>
          <div className="program-grid">
            {faq.map((question) => (
              <details key={question} className="program-card">
                <summary>{question}</summary>
                <p>Наш администратор подскажет детали и поможет подобрать удобный формат посещения.</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FormsSection />

      <section id="contacts" className="section">
        <div className="container contacts-grid">
          <div>
            <h2>Контакты</h2>
            <p>Адрес: ул. Центральная, 25, г. Демо</p>
            <p>Телефон: +7 (900) 123-45-67</p>
            <p>Мессенджеры: Telegram / WhatsApp</p>
            <p>Ежедневно по графику работы клуба</p>
            <a className="btn btn-primary" href="#">
              Построить маршрут
            </a>
          </div>
          <div className="map-placeholder">Карта появится здесь</div>
        </div>
      </section>
    </main>
  );
}
