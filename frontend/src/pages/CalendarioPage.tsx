import { useState } from 'react'
import type { CalendarView } from '@/data/calendario'
import CalendarHeader from '@/components/calendario/CalendarHeader'
import DayView from '@/components/calendario/views/DayView'
import WeekView from '@/components/calendario/views/WeekView'
import MonthView from '@/components/calendario/views/MonthView'
import YearView from '@/components/calendario/views/YearView'
import ScheduleView from '@/components/calendario/views/ScheduleView'
import CalendarSidePanel from '@/components/calendario/CalendarSidePanel'

export default function CalendarioPage() {
  const [view, setView] = useState<CalendarView>('dia')
  // We hardcode the date to July 2026 to match the design spec data
  const [currentDate] = useState(new Date(2026, 6, 19)) // 19 July 2026

  const periodLabels: Record<CalendarView, string> = {
    dia: '19 de julho de 2026',
    semana: '19 a 25 de julho de 2026',
    mes: 'Julho de 2026',
    ano: '2026',
    programacao: 'Jul. 2026 – mar. 2027',
  }

  const renderView = () => {
    switch (view) {
      case 'dia':
        return <DayView date={currentDate} />
      case 'semana':
        return <WeekView date={currentDate} />
      case 'mes':
        return <MonthView date={currentDate} />
      case 'ano':
        return <YearView date={currentDate} />
      case 'programacao':
        return <ScheduleView />
    }
  }

  return (
    <div className="flex h-full">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col p-6 min-w-0">
        <CalendarHeader
          currentView={view}
          onViewChange={setView}
          periodLabel={periodLabels[view]}
          onPrev={() => {}}
          onNext={() => {}}
          onToday={() => {}}
        />
        <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative bg-surface-container-low/30">
          {renderView()}
        </div>
      </div>

      {/* Right Panel */}
      <CalendarSidePanel />
    </div>
  )
}
