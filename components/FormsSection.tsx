'use client';

import { FormEvent, useState } from 'react';

type FormState = { name: string; phone: string; time: string; comment: string };

const initialState: FormState = { name: '', phone: '', time: '', comment: '' };

function FormCard({ title }: { title: string }) {
  const [data, setData] = useState<FormState>(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = data.phone.replace(/\D/g, '');
    if (data.name.trim().length < 2) return setError('Укажите имя (минимум 2 символа).');
    if (digits.length < 10) return setError('Укажите корректный телефон.');
    if (!data.time.trim()) return setError('Выберите удобное время для связи.');

    setError('');
    setSuccess(true);
    setData(initialState);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{title}</h3>
      <input placeholder="Имя" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
      <input placeholder="Телефон" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
      <input
        placeholder="Удобное время для связи"
        value={data.time}
        onChange={(e) => setData({ ...data, time: e.target.value })}
      />
      <textarea
        placeholder="Комментарий"
        value={data.comment}
        onChange={(e) => setData({ ...data, comment: e.target.value })}
      />
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">Спасибо! Мы свяжемся с вами.</p> : null}
      <button className="btn btn-primary" type="submit">
        Отправить заявку
      </button>
    </form>
  );
}

export function FormsSection() {
  return (
    <section id="trial" className="section">
      <div className="container">
        <h2>Запись на пробное посещение</h2>
        <p className="section-intro">Оставьте заявку на пробную тренировку или консультацию, и мы подберем удобный формат.</p>
        <div className="forms-grid">
          <FormCard title="Запись на пробную тренировку" />
          <FormCard title="Заявка на консультацию" />
        </div>
      </div>
    </section>
  );
}
