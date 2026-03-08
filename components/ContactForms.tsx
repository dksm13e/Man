'use client';

import { FormEvent, useState } from 'react';

type FormState = { name: string; phone: string; time: string; comment: string };

const empty: FormState = { name: '', phone: '', time: '', comment: '' };

function FormCard({ title }: { title: string }) {
  const [state, setState] = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.name.trim().length < 2 || state.phone.trim().length < 6 || !state.time.trim()) return;
    setSubmitted(true);
    setState(empty);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-lime/20 bg-charcoal/70 p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-4 grid gap-3">
        <input required minLength={2} value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Имя" className="rounded-xl border border-light/20 bg-graphite px-4 py-3 outline-none focus:border-lime" />
        <input required minLength={6} value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} placeholder="Телефон" className="rounded-xl border border-light/20 bg-graphite px-4 py-3 outline-none focus:border-lime" />
        <input required value={state.time} onChange={(e) => setState({ ...state, time: e.target.value })} placeholder="Удобное время для связи" className="rounded-xl border border-light/20 bg-graphite px-4 py-3 outline-none focus:border-lime" />
        <textarea value={state.comment} onChange={(e) => setState({ ...state, comment: e.target.value })} placeholder="Комментарий" className="min-h-24 rounded-xl border border-light/20 bg-graphite px-4 py-3 outline-none focus:border-lime" />
      </div>
      <button className="mt-4 rounded-full bg-lime px-5 py-2 font-semibold text-graphite">Отправить</button>
      {submitted ? <p className="mt-3 text-sm text-lime">Спасибо! Ваша заявка принята.</p> : null}
    </form>
  );
}

export function ContactForms() {
  return (
    <section id="trial" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title">Запись и консультация</h2>
      <p className="section-subtitle">Оставьте контакты — мы свяжемся с вами в удобное время.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <FormCard title="Запись на пробную тренировку" />
        <FormCard title="Заявка на консультацию" />
      </div>
    </section>
  );
}
