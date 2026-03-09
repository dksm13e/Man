'use client';

const items = [
  ['Нужна ли предварительная запись?', 'Да, на популярные занятия рекомендуем записываться заранее.'],
  ['Что взять с собой на тренировку?', 'Спортивную форму, чистую обувь, полотенце и бутылку воды.'],
  ['Есть ли пробное посещение?', 'Да, доступно пробное посещение и знакомство с клубом.'],
  ['Как посмотреть расписание?', 'В разделе «Расписание занятий» — данные обновляются автоматически.'],
  ['Когда нужно покинуть клуб?', 'Клиенты покидают клуб за 15 минут до закрытия.'],
  ['Подходит ли клуб для новичков?', 'Да, программы подходят для начинающих и опытных участников.']
];

export function FaqSection() {
  return (
    <section className="section-shell border-t border-white/10">
      <h2 className="text-3xl font-semibold md:text-4xl">Частые вопросы</h2>
      <div className="mt-8 space-y-3">
        {items.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-3 text-sm text-white/75">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
