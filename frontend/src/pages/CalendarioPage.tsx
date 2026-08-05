import { useState, useEffect, useCallback } from 'react'
import type { CalendarView, CalendarEvent } from '@/data/calendario'
import CalendarHeader from '@/components/calendario/CalendarHeader'
import DayView from '@/components/calendario/views/DayView'
import WeekView from '@/components/calendario/views/WeekView'
import MonthView from '@/components/calendario/views/MonthView'
import YearView from '@/components/calendario/views/YearView'
import ScheduleView from '@/components/calendario/views/ScheduleView'
import CalendarSidePanel from '@/components/calendario/CalendarSidePanel'
import EventPopup from '@/components/calendario/EventPopup'
import {
  buscarEventos,
  atualizarEvento,
  excluirEvento,
  type CalendarApiEvent,
  type AtualizarEventoPayload,
} from '@/lib/api'
import { COLOR_MAP, COLOR_DEFAULT } from '@/lib/colors'

// ---------------------------------------------------------------------------
// Helpers de data
// ---------------------------------------------------------------------------
function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Retorna [inicio, fim] do intervalo visível de acordo com a view atual. */
function getVisibleRange(date: Date, view: CalendarView): [string, string] {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()

  if (view === 'dia') {
    const s = toISODate(new Date(y, m, d))
    return [s, s]
  }
  if (view === 'semana') {
    const dow = date.getDay()
    const start = new Date(y, m, d - dow)
    const end = new Date(y, m, d - dow + 6)
    return [toISODate(start), toISODate(end)]
  }
  if (view === 'mes') {
    return [toISODate(new Date(y, m, 1)), toISODate(new Date(y, m + 1, 0))]
  }
  if (view === 'ano') {
    return [`${y}-01-01`, `${y}-12-31`]
  }
  // programacao — próximos 6 meses
  const end = new Date(y, m + 6, 0)
  return [toISODate(new Date(y, m, d)), toISODate(end)]
}

/** Converte evento bruto da API para o formato CalendarEvent das views. */
function apiEventToCalendarEvent(ev: CalendarApiEvent): CalendarEvent {
  const dt = new Date(ev.inicio)
  return {
    id: ev.id,
    day: dt.getDate(),
    month: dt.getMonth() + 1,
    year: dt.getFullYear(),
    hour: dt.getHours(),
    title: ev.titulo,
    color: ev.colorId ? (COLOR_MAP[ev.colorId] ?? COLOR_DEFAULT) : COLOR_DEFAULT,
    colorId: ev.colorId ?? undefined,
    fim: ev.fim,
  }
}

/** Retorna o label de período exibido no header. */
function getPeriodLabel(date: Date, view: CalendarView): string {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ]
  const m = months[date.getMonth()]
  const y = date.getFullYear()

  if (view === 'dia') return `${date.getDate()} de ${m} de ${y}`
  if (view === 'semana') {
    const dow = date.getDay()
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dow)
    const end = new Date(start); end.setDate(start.getDate() + 6)
    return `${start.getDate()} a ${end.getDate()} de ${months[start.getMonth()]} de ${y}`
  }
  if (view === 'mes') return `${m.charAt(0).toUpperCase() + m.slice(1)} de ${y}`
  if (view === 'ano') return `${y}`
  return `${m.slice(0, 3).charAt(0).toUpperCase() + m.slice(0, 3).slice(1)}. ${y}`
}

// ---------------------------------------------------------------------------
// Navegação (avança/recua de acordo com a view)
// ---------------------------------------------------------------------------
function moveDate(date: Date, view: CalendarView, delta: number): Date {
  const d = new Date(date)
  if (view === 'dia')   d.setDate(d.getDate() + delta)
  if (view === 'semana') d.setDate(d.getDate() + delta * 7)
  if (view === 'mes')   d.setMonth(d.getMonth() + delta)
  if (view === 'ano')   d.setFullYear(d.getFullYear() + delta)
  if (view === 'programacao') d.setMonth(d.getMonth() + delta * 3)
  return d
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function CalendarioPage() {
  const [view, setView] = useState<CalendarView>('dia')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])

  // Popup state
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  const fetchEvents = useCallback(async (d: Date, v: CalendarView) => {
    const [inicio, fim] = getVisibleRange(d, v)
    try {
      const apiEvents = await buscarEventos(inicio, fim)
      setEvents(apiEvents.map(apiEventToCalendarEvent))
    } catch (err) {
      console.error('[CalendarioPage] Erro ao buscar eventos:', err)
      setEvents([])
    }
  }, [])

  // Busca eventos toda vez que a data ou a view muda
  useEffect(() => {
    fetchEvents(currentDate, view)
  }, [currentDate, view, fetchEvents])

  const handleViewChange = (v: CalendarView) => setView(v)
  const handlePrev = () => setCurrentDate((d) => moveDate(d, view, -1))
  const handleNext = () => setCurrentDate((d) => moveDate(d, view, +1))
  const handleToday = () => setCurrentDate(new Date())

  // ---------------------------------------------------------------------------
  // Popup handlers
  // ---------------------------------------------------------------------------
  const handleEventClick = useCallback((ev: CalendarEvent, rect: DOMRect) => {
    setSelectedEvent(ev)
    setAnchorRect(rect)
  }, [])

  const handlePopupClose = useCallback(() => {
    setSelectedEvent(null)
    setAnchorRect(null)
  }, [])

  const handleEventUpdate = useCallback(async (id: string, payload: AtualizarEventoPayload) => {
    try {
      await atualizarEvento(id, payload)
      handlePopupClose()
      fetchEvents(currentDate, view)
    } catch (err) {
      console.error('[CalendarioPage] Erro ao atualizar evento:', err)
      throw err // re-throw so EventPopup can show error state
    }
  }, [currentDate, view, fetchEvents, handlePopupClose])

  const handleEventDelete = useCallback(async (id: string) => {
    try {
      await excluirEvento(id)
      handlePopupClose()
      fetchEvents(currentDate, view)
    } catch (err) {
      console.error('[CalendarioPage] Erro ao excluir evento:', err)
      throw err
    }
  }, [currentDate, view, fetchEvents, handlePopupClose])

  const renderView = () => {
    switch (view) {
      case 'dia':
        return <DayView date={currentDate} events={events} onEventClick={handleEventClick} />
      case 'semana':
        return <WeekView date={currentDate} events={events} onEventClick={handleEventClick} />
      case 'mes':
        return <MonthView date={currentDate} events={events} onEventClick={handleEventClick} />
      case 'ano':
        return <YearView date={currentDate} />
      case 'programacao':
        return <ScheduleView events={events} onEventClick={handleEventClick} />
    }
  }

  return (
    <div className="flex h-full">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col p-6 min-w-0">
        <CalendarHeader
          currentView={view}
          onViewChange={handleViewChange}
          periodLabel={getPeriodLabel(currentDate, view)}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative bg-surface-container-low/30">
          {renderView()}
        </div>
      </div>

      {/* Right Panel */}
      <CalendarSidePanel />

      {/* Event Details Popup */}
      {selectedEvent && anchorRect && (
        <EventPopup
          event={selectedEvent}
          anchorRect={anchorRect}
          onClose={handlePopupClose}
          onUpdate={handleEventUpdate}
          onDelete={handleEventDelete}
        />
      )}
    </div>
  )
}
