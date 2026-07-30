import { useMemo } from 'react'

interface MiniCalendarProps {
  date: Date
  onChange?: (date: Date) => void
}

const weekdayHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function MiniCalendar({ date, onChange }: MiniCalendarProps) {
  const now = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const result: { day: number; isCurrentMonth: boolean; dateObj: Date }[] = []

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateObj: new Date(year, month - 1, daysInPrevMonth - i),
      })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({
        day: d,
        isCurrentMonth: true,
        dateObj: new Date(year, month, d),
      })
    }
    const remaining = 42 - result.length
    for (let d = 1; d <= remaining; d++) {
      result.push({
        day: d,
        isCurrentMonth: false,
        dateObj: new Date(year, month + 1, d),
      })
    }
    return result
  }, [year, month])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <span className="text-body-md font-semibold text-on-surface">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
          </button>
          <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="grid grid-cols-7 mb-2">
          {weekdayHeaders.map((h, i) => (
            <div key={i} className="text-center text-[11px] text-on-surface-variant">
              {h}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, i) => {
            const isToday =
              cell.dateObj.getDate() === now.getDate() &&
              cell.dateObj.getMonth() === now.getMonth() &&
              cell.dateObj.getFullYear() === now.getFullYear()

            return (
              <div
                key={i}
                className="flex justify-center"
              >
                <button
                  onClick={() => onChange?.(cell.dateObj)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] transition-colors ${
                    !cell.isCurrentMonth
                      ? 'text-on-surface-variant opacity-40 hover:bg-surface-container'
                      : isToday
                      ? 'bg-primary text-on-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  {cell.day}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
