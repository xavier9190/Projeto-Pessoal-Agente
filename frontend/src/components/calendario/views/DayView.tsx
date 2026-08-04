import { useMemo } from 'react'
import type { CalendarEvent } from '@/data/calendario'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
}

const hours = Array.from({ length: 23 }, (_, i) => i + 1) // 1 to 23

export default function DayView({ date, events }: DayViewProps) {
  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const dayEvents = useMemo(() =>
    events.filter(
      (e) =>
        e.day === date.getDate() &&
        e.month === date.getMonth() + 1 &&
        e.year === date.getFullYear()
    ),
    [date, events]
  )

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const timePercent = isToday ? ((currentHour - 1 + currentMinute / 60) / 23) * 100 : -1

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {/* Day header */}
      <div className="sticky top-0 z-10 bg-surface-container-low border-b border-outline-variant py-3 flex items-center justify-center gap-2">
        <span className="text-body-md text-on-surface-variant">{weekdays[date.getDay()]}</span>
        <span
          className={`w-8 h-8 flex items-center justify-center rounded-full text-body-md font-semibold ${
            isToday ? 'bg-primary text-on-primary' : 'text-on-surface'
          }`}
        >
          {date.getDate()}
        </span>
      </div>

      {/* Time grid */}
      <div className="relative">
        {/* Current time line */}
        {isToday && timePercent >= 0 && (
          <div
            className="current-time-line"
            style={{ top: `${timePercent * 23 * 48}px` }}
          >
            <div className="current-time-dot" />
          </div>
        )}

        {hours.map((hour) => {
          const hourEvents = dayEvents.filter((e) => e.hour === hour)
          return (
            <div key={hour} className="flex border-b border-outline-variant/30 min-h-[48px]">
              <div className="w-14 shrink-0 py-1 pr-3 text-right text-[11px] text-on-surface-variant/60">
                {hour}:00
              </div>
              <div className="flex-1 relative py-1 pl-2 border-l border-outline-variant/30">
                {hourEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="absolute left-2 right-2 rounded px-2 py-0.5 text-[11px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: ev.color || '#3b82f6', top: '2px', bottom: '2px' }}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
