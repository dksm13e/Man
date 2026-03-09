'use client';

const plans = [
  {
    name: 'Старт',
    features: ['доступ в клуб в базовом формате', 'групповые программы', 'пробное знакомство']
  },
  {
    name: 'Стандарт',
    featured: true,
    features: ['полный доступ в часы работы клуба', 'групповые программы', 'приоритетная запись']
  },
  {
    name: 'Полный',
    features: ['расширенный доступ', 'максимум возможностей', 'выгодные условия']
  }
];

export function PricingSection() {
  return (
    <section className="section-shell border-t border-white/10">
      <h2 className="text-3xl font-semibold md:text-4xl">Тарифы</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-3xl p-6 ${
              plan.featured ? 'energy-gradient text-carbon shadow-glow' : 'border border-white/10 bg-white/5'
            }`}
          >
            <h3 className="text-2xl font-semibold">{plan.name}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
