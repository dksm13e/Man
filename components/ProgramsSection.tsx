'use client';

import { useState } from 'react';

type Category = 'Силовые программы' | 'Аэробные программы' | 'Танцевальные программы';

const programs: Record<Category, Array<{ name: string; description: string }>> = {
  'Силовые программы': [
    { name: 'АБТ', description: 'Силовой класс для проработки всех групп мышц с инвентарем.' },
    { name: '90/60/90', description: 'Развитие выносливости мышц живота, ягодиц и груди.' },
    { name: 'АБЛ', description: 'Тренировка нижней части тела и брюшного пресса.' },
    { name: 'БЕДРА “-”', description: 'Смешанный формат: аэробная или танцевальная часть + силовой блок.' },
    { name: 'СУПЕР ПРЕСС', description: 'Силовой урок на мышцы пресса с инвентарем.' },
    { name: 'АНТИЦЕЛ. ТРЕНИНГ', description: 'Комплекс с акцентом на бедра, ягодицы и пресс.' },
    { name: 'МОЩНЫЙ КЛАСС', description: 'Силовая программа на все группы мышц с инвентарем.' },
    { name: 'Функциональный тренинг', description: 'Движения из жизни для включения максимума мышечных групп.' },
    { name: 'СКУЛЬПТОР ТЕЛА', description: 'Низко-ударная программа со штангой для коррекции фигуры.' },
    { name: 'СИЛОВАЯ С ПЕТЛЯМИ', description: 'Функциональная работа с подвесными петлями.' },
    { name: 'ДЖАМПИНГ', description: 'Силовая + аэробная кардио-тренировка на батутах.' },
    { name: 'КРУГОВАЯ', description: 'Поочередное выполнение упражнений по кругу с минимальным отдыхом.' }
  ],
  'Аэробные программы': [
    { name: 'Смешанный тренинг', description: 'Танцевальные стили, степ-аэробика и силовой блок.' },
    { name: 'Фитбол', description: 'Тренировка со специальными мячами для гибкости и осанки.' },
    { name: 'Степ 1', description: 'Формат для начинающих: степ-аэробика + силовая часть.' }
  ],
  'Танцевальные программы': [
    { name: 'ЗУМБА', description: 'Танцевальная фитнес-программа с аэробными упражнениями.' }
  ]
};

export function ProgramsSection() {
  const categories = Object.keys(programs) as Category[];
  const [active, setActive] = useState<Category>(categories[0]);

  return (
    <section id="programs" className="section">
      <div className="container">
        <h2>Групповые программы</h2>
        <p className="section-intro">Подберите формат тренировок под ваш темп, задачу и уровень подготовки.</p>

        <div className="tabs">
          {categories.map((category) => (
            <button key={category} className={`tab ${active === category ? 'tab-active' : ''}`} onClick={() => setActive(category)}>
              {category}
            </button>
          ))}
        </div>

        <div className="program-grid">
          {programs[active].map((program) => (
            <details key={program.name} className="program-card">
              <summary>{program.name}</summary>
              <p>{program.description}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
