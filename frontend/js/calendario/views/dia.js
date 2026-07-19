// =============================================================================
// views/dia.js — View de um único dia (grade de horas)
// Depende de: HOURS, SAMPLE_EVENTS (definidos em calendario.js)
// =============================================================================

function renderDia() {
  const slots = HOURS.map((h, i) => `
    <div class="time-grid relative" style="height:48px;">
      <div class="time-label pt-1">${h}</div>
      <div class="border-b border-outline-variant/30 relative">
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
        <div class="text-[11px] bg-primary/20 border-l-2 border-primary px-2 py-1 text-primary rounded-sm">${e.label}</div>
      </div>
    `).join('');

  return `
    <div class="w-full bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden flex flex-col" style="min-height:100%;">
      <!-- Cabeçalho do dia -->
      <div class="grid border-b border-outline-variant" style="grid-template-columns:52px 1fr;background:#201f1f;">
        <div class="py-3 border-r border-outline-variant/30"></div>
        <div class="py-3 text-center">
          <div class="text-[10px] text-on-surface-variant font-label-md mb-1">DOM</div>
          <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold mx-auto text-sm">19</div>
        </div>
      </div>
      <!-- Grade de horas -->
      <div class="flex-1 overflow-y-auto relative" style="position:relative;">
        ${slots}
        ${dayEvents}
      </div>
    </div>`;
}
