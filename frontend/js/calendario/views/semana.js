// =============================================================================
// views/semana.js — View de semana (grade 7 colunas com horas)
// Depende de: HOURS, WEEK_DAYS, SAMPLE_EVENTS (definidos em calendario.js)
// =============================================================================

function renderSemana() {
  const days = [19, 20, 21, 22, 23, 24, 25];

  const dayLabels = days.map((d, i) => {
    const isToday = d === 19;
    return `
      <div style="padding:12px 0;text-align:center;border-right:1px solid rgba(71,70,74,0.3);">
        <div style="font-size:10px;color:#919095;letter-spacing:0.05em;font-weight:500;margin-bottom:4px;">${WEEK_DAYS[i]}</div>
        <div style="width:28px;height:28px;border-radius:50%;${isToday ? 'background:#ffffff;color:#303032;font-weight:700;' : 'color:#e5e2e1;font-weight:500;'}display:inline-flex;align-items:center;justify-content:center;font-size:13px;">${d}</div>
      </div>`;
  }).join('');

  const slots = HOURS.map((h, hi) => {
    const cols = days.map(d => {
      const ev = SAMPLE_EVENTS.find(e => e.day === d && e.hour === hi + 1);
      const evHtml = ev
        ? `<div style="font-size:10px;background:rgba(200,198,201,0.12);border-left:2px solid #c8c6c9;padding:1px 4px;color:#c8c6c9;border-radius:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-top:4px;">${ev.label}</div>`
        : '';
      const timeLine = (hi === 1 && d === 19)
        ? `<div style="position:absolute;left:0;right:0;top:50%;height:2px;background:#e06060;"></div>`
        : '';
      return `
        <div style="border-right:1px solid rgba(71,70,74,0.3);border-bottom:1px solid rgba(71,70,74,0.3);position:relative;height:48px;">
          ${timeLine}
          ${evHtml}
        </div>`;
    }).join('');

    return `
      <div style="display:grid;grid-template-columns:52px repeat(7,1fr);height:48px;">
        <div class="time-label pt-1" style="border-bottom:1px solid rgba(71,70,74,0.3);">${h}</div>
        ${cols}
      </div>`;
  }).join('');

  return `
    <div class="w-full rounded-2xl border border-outline-variant overflow-hidden flex flex-col" style="min-height:100%;background:#1c1b1b;">
      <!-- Cabeçalho dos dias -->
      <div style="display:grid;grid-template-columns:52px repeat(7,1fr);background:#201f1f;border-bottom:1px solid rgba(71,70,74,0.6);">
        <div style="border-right:1px solid rgba(71,70,74,0.3);padding:12px 0;"></div>
        ${dayLabels}
      </div>
      <!-- Grade de horas -->
      <div class="flex-1 overflow-y-auto">${slots}</div>
    </div>`;
}
