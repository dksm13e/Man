import { Reveal } from './Reveal';

export function HeroSection() {
  return (
    <section id="glavnaya" className="hero">
      <div className="hero-glow" />
      <div className="hero-lines" />
      <div className="container hero-content">
        <Reveal>
          <p className="hero-kicker">Сильный городской фитнес-клуб</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="hero-title">
            <span>ЭНЕРДЖИ</span>
            <small>фитнес-клуб</small>
          </h1>
        </Reveal>
        <Reveal delay={220}>
          <p className="hero-subtitle">Энергия движения. Сила результата.</p>
        </Reveal>
        <Reveal delay={320}>
          <p className="hero-text">
            Современный фитнес-клуб с групповыми программами, удобным расписанием и сильной атмосферой
            для тех, кто ценит движение и результат.
          </p>
        </Reveal>
        <Reveal delay={420}>
          <div className="hero-actions">
            <a href="#trial" className="btn btn-primary">
              Записаться на пробную тренировку
            </a>
            <a href="#schedule" className="btn btn-secondary">
              Смотреть расписание
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
