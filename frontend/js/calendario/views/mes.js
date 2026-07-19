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
    cells += `<div class="month-cell" style="opacity:0.3;color:#919095;font-size:12px;">${d}</div>`;
  });

  // Dias do mês atual
  for (let d = 1; d <= totalDays; d++) {
    const isToday = d === 19;
    const events  = SAMPLE_EVENTS.filter(e => e.day === d);
    const evHtml  = events.map(e => `
      <div style="font-size:10px;background:rgba(255,255,255,0.08);border-left:2px solid #c8c6c9;padding:2px 6px;color:#c8c6c9;border-radius:2px;margin-top:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${e.label}</div>
    `).join('');

    const numStyle = isToday
      ? 'display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#ffffff;color:#303032;font-weight:700;font-size:12px;'
      : 'font-size:12px;color:#e5e2e1;';

    cells += `
      <div class="month-cell" style="${isToday ? 'background:rgba(255,255,255,0.03);' : ''}">
        <span style="${numStyle}">${d}</span>
        ${evHtml}
      </div>`;
  }

  // Dias do próximo mês (preenchimento)
  const remaining = (7 - ((firstDay + totalDays) % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    cells += `<div class="month-cell" style="opacity:0.3;color:#919095;font-size:12px;">${d} ago.</div>`;
  }

  const headers = WEEK_DAYS.map(d =>
    `<div style="padding:12px 0;text-align:center;border-right:1px solid rgba(71,70,74,0.3);font-size:12px;color:#919095;letter-spacing:0.05em;font-weight:500;">${d}</div>`
  ).join('');

  return `
    <div class="w-full rounded-2xl border border-outline-variant overflow-hidden flex flex-col" style="min-height:100%;background:#1c1b1b;">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid rgba(71,70,74,0.6);background:#201f1f;">${headers}</div>
      <div class="month-grid flex-1">${cells}</div>
    </div>`;
}
