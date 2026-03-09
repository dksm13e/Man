export function ContactsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="grid gap-4 rounded-3xl border border-white/15 bg-white/[0.03] p-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-white/50">Адрес</p>
          <p className="mt-2 text-lg">г. Алматы, ул. Абая, 114</p>
        </div>
        <div>
          <p className="text-sm text-white/50">Телефон</p>
          <p className="mt-2 text-lg">+7 (777) 000-77-77</p>
        </div>
        <div>
          <p className="text-sm text-white/50">Часы работы</p>
          <p className="mt-2 text-lg">Ежедневно: 06:30–23:00</p>
        </div>
      </div>
    </section>
  );
}
