import MiniCalendar from './MiniCalendar'
import UpcomingEvents from './UpcomingEvents'

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
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <h3 className="text-body-md font-semibold text-on-surface mb-4">Próximos Eventos</h3>
        <UpcomingEvents />
      </div>

      {/* Footer Sync */}
      <div className="p-4 border-t border-outline-variant shrink-0 flex items-center justify-center gap-2 text-on-surface-variant opacity-60">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sync</span>
        <span className="text-[11px]">Sincronizado há 2m</span>
      </div>
    </aside>
  )
}
