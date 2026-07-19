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
        <div style="text-align:center;padding:2px 0;font-size:11px;${
          isToday
            ? 'background:#ffffff;color:#303032;border-radius:50%;font-weight:700;'
            : 'color:#919095;cursor:pointer;'
        }">${d}</div>`;
    }

    return `
      <div>
        <h4 style="font-size:14px;font-weight:600;color:#e5e2e1;margin-bottom:10px;">${name}</h4>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:10px;color:rgba(145,144,149,0.6);margin-bottom:4px;gap:2px;">
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
