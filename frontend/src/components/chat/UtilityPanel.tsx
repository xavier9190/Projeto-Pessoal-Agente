const models = [
  { icon: 'neurology', name: 'GPT-4', active: true },
  { icon: 'psychology', name: 'Claude 3', active: false },
  { icon: 'model_training', name: 'Gemini', active: false },
  { icon: 'smart_toy', name: 'Llama 3', active: false },
]

export default function UtilityPanel() {
  return (
    <aside
      className="flex flex-col p-6 border-l border-outline-variant bg-surface/50"
      style={{ width: '320px', gap: '20px' }}
    >
      {/* Agendas Section */}
      <section className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-headline-md text-on-surface">Agendas</h3>
          <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold">
            HOJE
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
          {/* Event 1 */}
          <div className="p-4 glass-panel rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
            <p className="text-[12px] text-on-surface-variant mb-1 font-medium">11:00 - 12:00</p>
            <h4 className="text-on-surface font-semibold text-body-md group-hover:text-primary transition-colors">
              Reunião Semanal de Finanças
            </h4>
            {/* Stacked Avatars */}
            <div className="flex -space-x-2 mt-3">
              <div className="w-6 h-6 rounded-full border border-surface bg-surface-container-high flex items-center justify-center text-[8px] text-on-surface font-medium z-10">
                JA
              </div>
              <div className="w-6 h-6 rounded-full border border-surface bg-secondary-container flex items-center justify-center text-[8px] text-on-surface font-medium z-0">
                MK
              </div>
              <div className="w-6 h-6 rounded-full border border-surface bg-surface-container-highest flex items-center justify-center text-[8px] text-on-surface">
                +3
              </div>
            </div>
          </div>

          {/* Event 2 */}
          <div className="p-4 glass-panel rounded-2xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <p className="text-[12px] text-on-surface-variant mb-1 font-medium">14:30 - 15:30</p>
            <h4 className="text-on-surface font-semibold text-body-md">Review de Projeto IA</h4>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                location_on
              </span>
              Sala Virtual 04
            </div>
          </div>
        </div>
      </section>

      {/* Finanças Section */}
      <section className="shrink-0">
        <h3 className="text-headline-md text-on-surface mb-4">Finanças</h3>
        <div className="glass-panel rounded-2xl p-4 bg-gradient-to-br from-surface-container-low to-surface-container-high relative overflow-hidden">
          {/* Decorative background icon */}
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: '80px' }}>
              account_balance
            </span>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-body-md text-on-surface-variant">Saldo Previsto</span>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>
                trending_up
              </span>
            </div>
            <p className="text-2xl font-bold text-on-surface">R$ 48.290,00</p>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <p className="text-[11px] text-on-surface-variant">Meta mensal atingida em 70%</p>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="shrink-0 pt-4 border-t border-outline-variant">
        <p className="text-label-md text-on-surface-variant uppercase tracking-[0.15em] mb-4 opacity-70">
          modelos em uso
        </p>
        <div className="space-y-1">
          {models.map((model) => (
            <button
              key={model.name}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-container-highest transition-all group"
            >
              <div className={`flex items-center gap-3 ${model.active ? '' : 'opacity-60 group-hover:opacity-100'}`}>
                <span className={`material-symbols-outlined ${model.active ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontSize: '20px' }}>
                  {model.icon}
                </span>
                <span className="text-label-md text-on-surface">{model.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    model.active
                      ? 'bg-primary shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                      : 'bg-on-surface-variant opacity-40'
                  }`}
                />
                <span
                  className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ fontSize: '14px' }}
                >
                  close
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
