// =============================================================================
// views/mes.js — View de mês (grade clássica de calendário)
// Depende de: WEEK_DAYS, SAMPLE_EVENTS (definidos em calendario.js)
// =============================================================================

function renderMes() {
  // Julho 2026: começa domingo (0), tem 31 dias
  const firstDay    = 0;
  const totalDays   = 31;
  const prevDays    = [26, 27, 28, 29, 30]; // últimos dias de junho

  let cells = '';

  // Dias do mês anterior (preenchimento)
  prevDays.slice(0, firstDay).forEach(d => {
    cells += `<div class="month-cell opacity-30 text-on-surface-variant font-label-md text-xs">${d}</div>`;
  });

  // Dias do mês atual
  for (let d = 1; d <= totalDays; d++) {
    const isToday = d === 19;
    const events  = SAMPLE_EVENTS.filter(e => e.day === d);
    const evHtml  = events.map(e => `
      <div class="text-[10px] bg-primary/10 border-l-2 border-primary px-1.5 py-0.5 text-primary rounded-sm truncate mt-0.5">${e.label}</div>
    `).join('');

    cells += `
      <div class="month-cell ${isToday ? 'bg-primary/5' : ''} text-on-surface">
        <span class="font-label-md text-xs ${isToday ? 'bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center font-bold' : ''}">${d}</span>
        ${evHtml}
      </div>`;
  }

  // Dias do próximo mês (preenchimento)
  const remaining = (7 - ((firstDay + totalDays) % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    cells += `<div class="month-cell opacity-30 text-on-surface-variant font-label-md text-xs">${d} ago.</div>`;
  }

  const headers = WEEK_DAYS.map(d =>
    `<div class="py-3 text-center border-r border-outline-variant/30 font-label-md text-on-surface-variant text-xs">${d}</div>`
  ).join('');

  return `
    <div class="w-full bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden flex flex-col" style="min-height:100%;">
      <div class="grid grid-cols-7 border-b border-outline-variant bg-surface-container">${headers}</div>
      <div class="month-grid flex-1">${cells}</div>
    </div>`;
}
