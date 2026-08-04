import { useMemo } from 'react'
import type { CalendarEvent } from '@/data/calendario'

interface MonthViewProps {
  date: Date
  events: CalendarEvent[]
}

const weekdayHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export default function MonthView({ date }: MonthViewProps) {
  const now = new Date()

  const cells = useMemo(() => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = []

    // Prev month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const m = month === 0 ? 12 : month
      const y = month === 0 ? year - 1 : year
      cells.push({ day: d, month: m, year: y, isCurrentMonth: false })
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: month + 1, year, isCurrentMonth: true })
    }
    // Next month fill
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      const m = month === 11 ? 1 : month + 2
      const y = month === 11 ? year + 1 : year
      cells.push({ day: d, month: m, year: y, isCurrentMonth: false })
    }
    return cells
  }, [date])

  return (
    <div className="flex-1 flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-outline-variant">
        {weekdayHeaders.map((h, i) => (
          <div key={i} className="py-2 text-center text-label-md text-on-surface-variant">
            {h}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {cells.map((cell, i) => {
          const isToday =
            cell.day === now.getDate() &&
            cell.month === now.getMonth() + 1 &&
            cell.year === now.getFullYear()
          const dayEvents = events.filter(
            (e) => e.day === cell.day && e.month === cell.month && e.year === cell.year
          )
          return (
            <div
              key={i}
              className={`border-b border-r border-outline-variant/30 p-1.5 min-h-[80px] ${
                !cell.isCurrentMonth ? 'opacity-30' : ''
              } hover:bg-surface-container transition-colors cursor-pointer`}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-medium mb-1 ${
                  isToday ? 'bg-primary text-on-primary' : 'text-on-surface'
                }`}
              >
                {cell.day}
              </span>
              <div className="space-y-0.5">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded px-1 py-0.5 text-[10px] font-medium text-white truncate"
                    style={{ backgroundColor: ev.color || '#3b82f6' }}
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
