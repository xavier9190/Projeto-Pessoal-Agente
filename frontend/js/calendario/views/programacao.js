// =============================================================================
// views/programacao.js — View de programação (lista de eventos por data)
// Sem dependências externas além dos dados passados ao renderizar.
// =============================================================================

function renderProgramacao() {
  const scheduleItems = [
    {
      date: '9 AGO., DOM.',
      events: [{ time: 'Dia inteiro', label: 'Dia dos Pais', dot: '#4caf50' }],
    },
    {
      date: '7 SET., SEG.',
      events: [{ time: 'Dia inteiro', label: 'Independência', dot: '#4caf50' }],
    },
    {
      date: '12 OUT., SEG.',
      events: [{ time: 'Dia inteiro', label: 'Nossa Senhora de Aparecida', dot: '#4caf50' }],
    },
    {
      date: '2 NOV., SEG.',
      events: [
        { time: 'Dia inteiro', label: 'Aniversário da Rafa', dot: '#4287f5' },
        { time: 'Dia inteiro', label: 'Finados',             dot: '#4caf50' },
      ],
    },
    {
      date: '15 NOV., DOM.',
      events: [{ time: 'Dia inteiro', label: 'Proclamação da República', dot: '#4caf50' }],
    },
    {
      date: '25 DEZ., QUI.',
      events: [{ time: 'Dia inteiro', label: 'Natal', dot: '#4caf50' }],
    },
  ];

  // Indicador de "agora" (hoje)
  const todayLine = `
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm flex-shrink-0">19</div>
      <div class="flex-1" style="height:2px;background:#e06060;position:relative;">
        <div style="position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:#e06060;"></div>
      </div>
    </div>`;

  const rows = scheduleItems.map(group => {
    const evRows = group.events.map(e => `
      <div class="flex items-center gap-6 py-2 border-b border-outline-variant/20 hover:bg-surface-container-highest/40 px-4 rounded-lg transition-colors cursor-pointer">
        <span class="text-on-surface-variant font-body-md text-sm w-24 flex-shrink-0">${e.time}</span>
        <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${e.dot};"></div>
        <span class="text-on-surface font-body-md text-sm">${e.label}</span>
      </div>`).join('');

    return `
      <div class="mb-6">
        <div class="font-label-md text-primary text-xs mb-2 px-1">${group.date}</div>
        ${evRows}
      </div>`;
  }).join('');

  return `
    <div class="w-full bg-surface-container-low rounded-2xl border border-outline-variant p-6" style="min-height:100%;">
      <div class="font-label-md text-on-surface-variant text-xs mb-2 px-1">19 JUL., DOM.</div>
      ${todayLine}
      ${rows}
    </div>`;
}
