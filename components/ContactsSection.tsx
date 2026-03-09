'use client';

export function ContactsSection() {
  return (
    <section className="section-shell border-t border-white/10">
      <h2 className="text-3xl font-semibold md:text-4xl">Контакты</h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p><span className="text-white/60">Адрес:</span> г. Городск, ул. Спортивная, 12</p>
          <p><span className="text-white/60">Телефон:</span> <a href="tel:+79000000000" className="text-lime">+7 (900) 000-00-00</a></p>
          <p><span className="text-white/60">Мессенджеры:</span> Telegram, WhatsApp</p>
          <p><span className="text-white/60">Часы работы:</span> Пн–Чт 07:00–21:00, Пт 07:00–20:45, Сб–Вс 09:00–17:45</p>
          <button className="rounded-full border border-white/25 px-6 py-2 hover:border-lime hover:text-lime">Построить маршрут</button>
        </div>
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-charcoal/80 text-white/60">
          Карта-заглушка
        </div>
      </div>
    </section>
  );
}
