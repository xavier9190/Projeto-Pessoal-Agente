import { useMemo } from 'react'
import type { CalendarEvent } from '@/data/calendario'

interface WeekViewProps {
  date: Date
  events: CalendarEvent[]
  onEventClick?: (ev: CalendarEvent, rect: DOMRect) => void
}

const hours = Array.from({ length: 23 }, (_, i) => i + 1)
const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getWeekDays(date: Date): Date[] {
  const start = new Date(date)
  const day = date.getDay()
  start.setDate(date.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export default function WeekView({ date, events, onEventClick }: WeekViewProps) {
  const now = new Date()
  const weekDays = useMemo(() => getWeekDays(date), [date])

  const isCurrentHourPercent = useMemo(() => {
    const h = now.getHours()
    const m = now.getMinutes()
    return ((h - 1 + m / 60) / 23) * 100
  }, [])

  return (
    <div className="flex-1 overflow-auto custom-scrollbar">
      {/* Header row */}
      <div className="sticky top-0 z-10 bg-surface-container-low border-b border-outline-variant flex">
        <div className="w-14 shrink-0" />
        {weekDays.map((d) => {
          const isToday =
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          return (
            <div
              key={d.toISOString()}
              className="flex-1 py-3 flex flex-col items-center gap-1 border-l border-outline-variant/30"
            >
              <span className="text-[11px] text-on-surface-variant">{weekdayLabels[d.getDay()]}</span>
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-body-md font-medium ${
                  isToday ? 'bg-primary text-on-primary' : 'text-on-surface'
                }`}
              >
                {d.getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="relative">
        {/* Current time line */}
        <div
          className="current-time-line"
          style={{ top: `${isCurrentHourPercent * 23 * 48}px` }}
        >
          <div className="current-time-dot" />
        </div>

        {hours.map((hour) => (
          <div key={hour} className="flex border-b border-outline-variant/30 min-h-[48px]">
            <div className="w-14 shrink-0 py-1 pr-3 text-right text-[11px] text-on-surface-variant/60">
              {hour}:00
            </div>
            {weekDays.map((d) => {
              const dayEvents = events.filter(
                (e) =>
                  e.day === d.getDate() &&
                  e.month === d.getMonth() + 1 &&
                  e.year === d.getFullYear() &&
                  e.hour === hour
              )
              return (
                <div
                  key={d.toISOString()}
                  className="flex-1 relative py-1 pl-1 border-l border-outline-variant/30"
                >
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity truncate"
                      style={{ backgroundColor: ev.color || '#3b82f6' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick?.(ev, e.currentTarget.getBoundingClientRect())
                      }}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
