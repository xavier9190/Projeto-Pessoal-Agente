// =============================================================================
// views/ano.js — View anual (12 mini-calendários em grade 4×3)
// Depende de: MONTHS_PT (definido em calendario.js)
// =============================================================================

function renderAno() {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // Dia da semana do dia 1º de cada mês em 2026 (0=Dom, 1=Seg, ...)
  const firstDays   = [3, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2];

  const months = MONTHS_PT.map((name, mi) => {
    const fd    = firstDays[mi];
    const total = daysInMonth[mi];
    let cells   = '';

    // Espaços vazios iniciais
    for (let p = 0; p < fd; p++) cells += `<div></div>`;

    // Dias do mês
    for (let d = 1; d <= total; d++) {
      const isToday = (mi === 6 && d === 19); // Julho/2026
      cells += `
        <div class="text-center py-0.5 text-[11px] ${
          isToday
            ? 'bg-primary text-on-primary rounded-full font-bold'
            : 'text-on-surface-variant hover:text-primary cursor-pointer'
        }">${d}</div>`;
    }

    return `
      <div>
        <h4 class="font-headline-md text-on-surface text-sm font-semibold mb-3">${name}</h4>
        <div class="grid grid-cols-7 text-center text-[10px] text-on-surface-variant/60 mb-1 gap-0.5">
          <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
        </div>
        <div class="mini-month-grid">${cells}</div>
      </div>`;
  }).join('');

  return `
    <div class="w-full">
      <div class="year-grid">${months}</div>
    </div>`;
}
