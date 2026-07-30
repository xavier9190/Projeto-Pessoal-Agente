import MiniCalendar from './MiniCalendar'
import { upcomingEvents } from '@/data/calendario'

export default function CalendarSidePanel() {
  return (
    <aside
      className="flex flex-col border-l border-outline-variant bg-surface-container-low"
      style={{ width: '320px' }}
    >
      {/* Mini Calendar Section */}
      <div className="p-6 border-b border-outline-variant">
        <MiniCalendar date={new Date(2026, 6, 19)} /> {/* Hardcoded to July 2026 to match design */}
      </div>

      {/* Upcoming Events Section */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
        <h3 className="text-body-md font-semibold text-on-surface mb-4">Próximos Eventos</h3>
        <div className="space-y-3">
          {upcomingEvents.map((ev) => (
            <div
              key={ev.id}
              className="glass-panel rounded-2xl p-4 hover:border-outline transition-colors cursor-pointer"
            >
              <p className="text-[12px] text-on-surface-variant mb-1 font-medium">{ev.time}</p>
              <h4 className="text-body-md font-semibold text-on-surface">{ev.title}</h4>
              <div className="flex -space-x-2 mt-3">
                {ev.avatars.map((initials, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] text-on-surface font-medium z-10"
                  >
                    {initials}
                  </div>
                ))}
                {ev.extra && (
                  <div className="w-7 h-7 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface">
                    +{ev.extra}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Sync */}
      <div className="p-4 border-t border-outline-variant shrink-0 flex items-center justify-center gap-2 text-on-surface-variant opacity-60">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sync</span>
        <span className="text-[11px]">Sincronizado há 2m</span>
      </div>
    </aside>
  )
}
