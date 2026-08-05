import type { CalendarEvent } from '@/data/calendario'

interface ScheduleViewProps {
  events: CalendarEvent[]
  onEventClick?: (ev: CalendarEvent, rect: DOMRect) => void
}

const MONTHS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function formatHour(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

export default function ScheduleView({ events, onEventClick }: ScheduleViewProps) {
  // Agrupa eventos por data (YYYY-MM-DD) e ordena cronologicamente
  const grouped = events
    .slice()
    .sort((a, b) => {
      const da = new Date(a.year, a.month - 1, a.day, a.hour)
      const db = new Date(b.year, b.month - 1, b.day, b.hour)
      return da.getTime() - db.getTime()
    })
    .reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
      const key = `${ev.year}-${String(ev.month).padStart(2, '0')}-${String(ev.day).padStart(2, '0')}`
      if (!acc[key]) acc[key] = []
      acc[key].push(ev)
      return acc
    }, {})

  const days = Object.keys(grouped).sort()
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-1">
      {days.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-16 text-on-surface-variant text-body-md opacity-60">
          Nenhum evento no período selecionado.
        </div>
      )}

      {days.map((dayKey) => {
        const [y, m, d] = dayKey.split('-').map(Number)
        const date = new Date(y, m - 1, d)
        const isToday = dayKey === todayKey
        const dateLabel = `${d} ${MONTHS[m - 1].toUpperCase()}.`
        const weekLabel = WEEKDAYS[date.getDay()].toUpperCase()

        return (
          <div key={dayKey} className="flex gap-4">
            {/* Date column */}
            <div className="w-24 shrink-0 pt-3 text-right">
              <p className={`text-label-md font-semibold ${isToday ? 'text-primary' : 'text-on-surface'}`}>
                {dateLabel}
              </p>
              <p className="text-[11px] text-on-surface-variant">{weekLabel}</p>
            </div>

            {/* Events column */}
            <div className="flex-1 space-y-2 pb-2">
              {/* Today indicator line */}
              {isToday && (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <div className="flex-1 h-px bg-red-500 opacity-50" />
                </div>
              )}

              {grouped[dayKey].map((ev) => (
                <div
                  key={ev.id}
                  className="glass-panel rounded-xl p-3 flex items-center gap-3 hover:border-outline transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick?.(ev, e.currentTarget.getBoundingClientRect())
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ev.color || '#6b7280' }}
                  />
                  <div className="flex-1">
                    <p className="text-body-md text-on-surface">{ev.title}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {ev.hour > 0 ? formatHour(ev.hour) : 'Dia inteiro'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
