// =============================================================================
// views/semana.js — View de semana (grade 7 colunas com horas)
// Depende de: HOURS, WEEK_DAYS, SAMPLE_EVENTS (definidos em calendario.js)
// =============================================================================

function renderSemana() {
  const days = [19, 20, 21, 22, 23, 24, 25];

  const dayLabels = days.map((d, i) => {
    const isToday = d === 19;
    return `
      <div class="py-3 text-center border-r border-outline-variant/30">
        <div class="text-[10px] text-on-surface-variant font-label-md mb-1">${WEEK_DAYS[i]}</div>
        <div class="w-7 h-7 rounded-full ${isToday ? 'bg-primary text-on-primary' : ''} flex items-center justify-center ${isToday ? 'font-bold' : 'font-label-md'} mx-auto text-sm">${d}</div>
      </div>`;
  }).join('');

  const slots = HOURS.map((h, hi) => {
    const cols = days.map(d => {
      const ev = SAMPLE_EVENTS.find(e => e.day === d && e.hour === hi + 1);
      const evHtml = ev
        ? `<div class="text-[10px] bg-primary/20 border-l-2 border-primary px-1 py-0.5 text-primary rounded-sm truncate mt-1">${ev.label}</div>`
        : '';
      const timeLine = (hi === 1 && d === 19)
        ? `<div style="position:absolute;left:0;right:0;top:50%;height:2px;background:#e06060;"></div>`
        : '';
      return `
        <div class="border-r border-b border-outline-variant/30 relative" style="height:48px;">
          ${timeLine}
          ${evHtml}
        </div>`;
    }).join('');

    return `
      <div style="display:grid;grid-template-columns:52px repeat(7,1fr);height:48px;">
        <div class="time-label pt-1 border-b border-outline-variant/30">${h}</div>
        ${cols}
      </div>`;
  }).join('');

  return `
    <div class="w-full bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden flex flex-col" style="min-height:100%;">
      <!-- Cabeçalho dos dias -->
      <div style="display:grid;grid-template-columns:52px repeat(7,1fr);background:#201f1f;" class="border-b border-outline-variant">
        <div class="border-r border-outline-variant/30 py-3"></div>
        ${dayLabels}
      </div>
      <!-- Grade de horas -->
      <div class="flex-1 overflow-y-auto">${slots}</div>
    </div>`;
}
