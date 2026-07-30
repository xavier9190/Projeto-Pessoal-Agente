import { useMemo } from 'react'
import { sampleEvents } from '@/data/calendario'

interface YearViewProps {
  date: Date
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const weekdayHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface MiniMonthProps {
  year: number
  monthIndex: number // 0-based
  today: Date
}

function MiniMonth({ year, monthIndex, today }: MiniMonthProps) {
  const cells = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1).getDay()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    const result: { day: number; isCurrentMonth: boolean }[] = []
    for (let i = 0; i < firstDay; i++) result.push({ day: 0, isCurrentMonth: false })
    for (let d = 1; d <= daysInMonth; d++) result.push({ day: d, isCurrentMonth: true })
    while (result.length % 7 !== 0) result.push({ day: 0, isCurrentMonth: false })
    return result
  }, [year, monthIndex])

  return (
    <div className="glass-panel rounded-xl p-3">
      <h3 className="text-body-md font-semibold text-on-surface mb-2 text-center">
        {monthNames[monthIndex]}
      </h3>
      <div className="grid grid-cols-7 gap-0">
        {weekdayHeaders.map((h, i) => (
          <div key={i} className="text-center text-[9px] text-on-surface-variant py-0.5">
            {h}
          </div>
        ))}
        {cells.map((cell, i) => {
          const isToday =
            cell.day === today.getDate() &&
            monthIndex === today.getMonth() &&
            year === today.getFullYear()
          const hasEvent = sampleEvents.some(
            (e) => e.day === cell.day && e.month === monthIndex + 1 && e.year === year
          )
          return (
            <div
              key={i}
              className={`flex items-center justify-center rounded text-[9px] h-5 cursor-pointer ${
                !cell.isCurrentMonth
                  ? 'opacity-0 pointer-events-none'
                  : isToday
                  ? 'bg-primary text-on-primary font-bold'
                  : hasEvent
                  ? 'text-primary font-semibold hover:bg-surface-container-highest'
                  : 'text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {cell.day > 0 ? cell.day : ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function YearView({ date }: YearViewProps) {
  const now = new Date()
  const year = date.getFullYear()

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-4 gap-4 p-2">
        {Array.from({ length: 12 }, (_, i) => (
          <MiniMonth key={i} year={year} monthIndex={i} today={now} />
        ))}
      </div>
    </div>
  )
}
