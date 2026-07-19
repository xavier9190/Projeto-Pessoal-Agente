// =============================================================================
// views/dia.js — View de um único dia (grade de horas)
// Depende de: HOURS, SAMPLE_EVENTS (definidos em calendario.js)
// =============================================================================

function renderDia() {
  const slots = HOURS.map((h, i) => `
    <div class="time-grid relative" style="height:48px;">
      <div class="time-label pt-1">${h}</div>
      <div style="border-bottom:1px solid rgba(71,70,74,0.3);position:relative;height:100%;">
        ${i === 1 ? `
          <div style="position:absolute;left:0;right:0;top:50%;height:2px;background:#e06060;">
            <div style="position:absolute;left:-5px;top:-4px;width:10px;height:10px;border-radius:50%;background:#e06060;"></div>
          </div>` : ''}
      </div>
    </div>
  `).join('');

  const dayEvents = SAMPLE_EVENTS
    .filter(e => e.day === 19)
    .map(e => `
      <div style="position:absolute;left:52px;right:0;top:${(e.hour - 1) * 48 + 4}px;" class="px-2">
        <div style="font-size:11px;background:rgba(200,198,201,0.15);border-left:2px solid #c8c6c9;padding:2px 8px;color:#c8c6c9;border-radius:2px;">${e.label}</div>
      </div>
    `).join('');

  return `
    <div class="w-full rounded-2xl border border-outline-variant overflow-hidden flex flex-col" style="min-height:100%;background:#1c1b1b;">
      <!-- Cabeçalho do dia -->
      <div style="display:grid;grid-template-columns:52px 1fr;border-bottom:1px solid rgba(71,70,74,0.6);background:#201f1f;">
        <div style="padding:12px 0;border-right:1px solid rgba(71,70,74,0.3);"></div>
        <div style="padding:12px 0;text-align:center;">
          <div style="font-size:10px;color:#919095;letter-spacing:0.05em;font-weight:500;margin-bottom:4px;">DOM</div>
          <div style="width:32px;height:32px;border-radius:50%;background:#ffffff;color:#303032;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">19</div>
        </div>
      </div>
      <!-- Grade de horas -->
      <div class="flex-1 overflow-y-auto relative" style="position:relative;">
        ${slots}
        ${dayEvents}
      </div>
    </div>`;
}
