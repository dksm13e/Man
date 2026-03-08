const navItems = [
  ['Главная', 'index.html'],
  ['О клубе', 'o-klube.html'],
  ['Тарифы', 'tarify.html'],
  ['Зоны клуба', 'zony-kluba.html'],
  ['Групповые программы', 'gruppovye-programmy.html'],
  ['Персональные тренировки', 'personalnye-trenirovki.html'],
  ['Тренеры', 'trenery.html'],
  ['Расписание', 'raspisanie.html'],
  ['Акции', 'akcii.html'],
  ['Контакты', 'kontakty.html'],
  ['FAQ', 'faq.html']
];

function renderLayout() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const current = location.pathname.split('/').pop() || 'index.html';
  if (header) {
    header.innerHTML = `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html">Энерджи <span>— фитнес-клуб</span></a>
        <nav class="nav-links">
          ${navItems.map(([name, href]) => `<a href="${href}" ${current===href?'style="color:#C7D400"':''}>${name}</a>`).join('')}
        </nav>
      </div>
    </header>`;
  }
  if (footer) {
    footer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <p><strong>Энерджи — фитнес-клуб</strong> · ул. Северная, 18 · +7 (900) 000-00-00</p>
        <p>Пн–Пт: 07:00–23:00 · Сб–Вс: 09:00–22:00 · Парковка: есть</p>
      </div>
    </footer>`;
  }
  if (!document.querySelector('.float-cta')) {
    const f = document.createElement('div');
    f.className='float-cta';
    f.innerHTML='<a href="#lead-form" class="btn btn-primary">Записаться</a>';
    document.body.appendChild(f);
  }
}

function initScheduleFilter(){
  const form = document.getElementById('schedule-filter');
  if(!form) return;
  const rows = [...document.querySelectorAll('[data-day]')];
  const ids = ['day','direction','coach','time'];
  function apply(){
    const v = Object.fromEntries(ids.map(id=>[id, document.getElementById(id).value]));
    rows.forEach(row=>{
      const ok = ids.every(id => !v[id] || row.dataset[id]===v[id]);
      row.style.display = ok ? '' : 'none';
    });
  }
  ids.forEach(id=>document.getElementById(id).addEventListener('change',apply));
}

document.addEventListener('DOMContentLoaded',()=>{renderLayout();initScheduleFilter();});
