import { useState, useRef, useEffect } from 'react'
import type { CalendarView } from '@/data/calendario'

const viewOptions: { value: CalendarView; label: string; icon: string }[] = [
  { value: 'dia', label: 'Dia', icon: 'calendar_view_day' },
  { value: 'semana', label: 'Semana', icon: 'calendar_view_week' },
  { value: 'mes', label: 'Mês', icon: 'calendar_month' },
  { value: 'ano', label: 'Ano', icon: 'event_note' },
  { value: 'programacao', label: 'Programação', icon: 'format_list_bulleted' },
]

interface CalendarHeaderProps {
  currentView: CalendarView
  onViewChange: (v: CalendarView) => void
  periodLabel: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export default function CalendarHeader({
  currentView,
  onViewChange,
  periodLabel,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentOption = viewOptions.find((v) => v.value === currentView)!

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between mb-4 shrink-0">
      {/* Left: title + navigation */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Calendário</h1>
          <p className="text-body-md text-on-surface-variant">{periodLabel}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1.5 rounded-lg text-body-md text-on-surface hover:bg-surface-container-high border border-outline-variant transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={onNext}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Right: view selector + new event */}
      <div className="flex items-center gap-3">
        {/* View dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant text-body-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {currentOption.icon}
            </span>
            <span>{currentOption.label}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 glass-panel rounded-xl overflow-hidden z-50 min-w-[180px] shadow-xl">
              {viewOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onViewChange(option.value)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-body-md hover:bg-surface-container-highest transition-colors text-left ${
                    currentView === option.value ? 'text-primary bg-surface-container-high' : 'text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {option.icon}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-body-md font-medium hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#303032' }}>add</span>
          <span style={{ color: '#303032' }}>Novo Evento</span>
        </button>
      </div>
    </div>
  )
}
