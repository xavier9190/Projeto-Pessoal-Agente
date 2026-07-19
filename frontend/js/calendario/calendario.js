// =============================================================================
// calendario.js — Controller principal da página de Calendário
//
// Responsabilidades:
//   - Dados compartilhados (HOURS, WEEK_DAYS, MONTHS_PT, SAMPLE_EVENTS)
//   - Estado atual da view
//   - Controle do dropdown de seleção de view
//   - Atualização do header (título e subtítulo)
//   - Despacho para o renderer correto (renderDia/Semana/Mes/Ano/Programacao)
//
// Depende (devem ser carregados antes deste arquivo):
//   - views/dia.js
//   - views/semana.js
//   - views/mes.js
//   - views/ano.js
//   - views/programacao.js
// =============================================================================

// ── Dados compartilhados entre todas as views ─────────────────────────────
const HOURS = [
  '1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM',
  '8 AM','9 AM','10 AM','11 AM','12 PM',
  '1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM','11 PM',
];
const WEEK_DAYS = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
const MONTHS_PT = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

// Eventos de exemplo (Julho 2026) — substituir por dados reais da API futuramente
const SAMPLE_EVENTS = [
  { day: 19, hour:  9, label: 'Daily Standup',        color: 'primary'   },
  { day: 21, hour: 14, label: 'Review Mensal',         color: 'secondary' },
  { day: 22, hour: 10, label: 'Sincronização Design',  color: 'primary'   },
  { day: 25, hour: 16, label: 'Planejamento Q3',       color: 'secondary' },
];

// ── Estado ────────────────────────────────────────────────────────────────
let currentView = 'dia';

const VIEW_LABELS = {
  dia: 'Dia', semana: 'Semana', mes: 'Mês', ano: 'Ano', programacao: 'Programação',
};
const VIEW_SUBTITLES = {
  dia:         '19 de julho de 2026',
  semana:      'Julho de 2026',
  mes:         'Julho de 2026',
  ano:         '2026',
  programacao: 'Jul. 2026 – mar. 2027',
};

// ── Dropdown ──────────────────────────────────────────────────────────────
function toggleDropdown() {
  document.getElementById('view-dropdown').classList.toggle('hidden');
}

// Fecha dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('#view-selector-btn') && !e.target.closest('#view-dropdown')) {
    document.getElementById('view-dropdown').classList.add('hidden');
  }
});

// ── Troca de view ─────────────────────────────────────────────────────────
function setView(view) {
  currentView = view;

  // Atualiza label do botão e subtítulo do header
  document.getElementById('current-view-label').textContent = VIEW_LABELS[view];
  document.getElementById('header-subtitle').textContent    = VIEW_SUBTITLES[view];

  // Fecha dropdown
  document.getElementById('view-dropdown').classList.add('hidden');

  // Destaca opção ativa no dropdown
  document.querySelectorAll('.view-option').forEach(btn => {
    const isActive = btn.getAttribute('onclick').includes(`'${view}'`);
    btn.classList.toggle('text-primary',                isActive);
    btn.classList.toggle('bg-surface-container-highest', isActive);
  });

  renderView(view);
}

// ── Renderização ──────────────────────────────────────────────────────────
function renderView(view) {
  const section = document.getElementById('calendar-section');
  section.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'cal-view w-full h-full';

  switch (view) {
    case 'dia':         wrapper.innerHTML = renderDia();         break;
    case 'semana':      wrapper.innerHTML = renderSemana();      break;
    case 'mes':         wrapper.innerHTML = renderMes();         break;
    case 'ano':         wrapper.innerHTML = renderAno();         break;
    case 'programacao': wrapper.innerHTML = renderProgramacao(); break;
  }

  section.appendChild(wrapper);
}

// ── Inicialização ─────────────────────────────────────────────────────────
renderView('dia');
setView('dia');
