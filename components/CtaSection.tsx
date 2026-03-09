export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
      <div className="rounded-3xl border border-indigo-300/30 bg-gradient-to-r from-indigo-500/20 to-rose-500/20 p-8 text-center shadow-glow">
        <h2 className="text-3xl font-semibold">Готовы начать в Энерджи?</h2>
        <p className="mt-3 text-white/75">Оставьте заявку и получите консультацию по абонементам и целям тренировок в течение 15 минут.</p>
        <button className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">Оставить заявку</button>
      </div>
    </section>
  );
}
