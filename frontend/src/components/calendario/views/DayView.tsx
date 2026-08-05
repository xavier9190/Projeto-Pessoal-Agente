import { useMemo } from 'react'
import type { CalendarEvent } from '@/data/calendario'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onEventClick?: (ev: CalendarEvent, rect: DOMRect) => void
}

// ---------------------------------------------------------------------------
// Constantes do grid
// ---------------------------------------------------------------------------
const DAY_START_HOUR = 1   // primeira linha visível (igual ao array hours anterior)
const DAY_END_HOUR   = 24  // grid vai de 1:00 até 24:00 (23 linhas)
const HOUR_HEIGHT_PX = 48  // height de cada linha — deve coincidir com min-h-[48px] do CSS
const TOTAL_HOURS    = DAY_END_HOUR - DAY_START_HOUR  // 23

const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => i + DAY_START_HOUR)

// ---------------------------------------------------------------------------
// Helpers de posicionamento
// ---------------------------------------------------------------------------

/** Retorna os minutos de um evento desde o início do grid (DAY_START_HOUR). */
function eventToMinutes(ev: CalendarEvent): { startMin: number; endMin: number } {
  // início: vem de ev.hour (inteiro) + minuto de ev.inicio se disponível via `fim`
  // A API retorna ev.fim como ISO; ev.hour já é int hora de início.
  // Para minutos de início, extraímos do campo `fim` por não termos `inicio` no CalendarEvent —
  // mas ev.hour é sempre derivado de `new Date(ev.inicio).getHours()`.
  // Para os minutos do início usamos 0 (limitação do tipo atual).
  // Para os minutos do fim usamos o campo ev.fim quando presente.
  const startMin = (ev.hour - DAY_START_HOUR) * 60

  let endMin: number
  if (ev.fim) {
    const fimDate = new Date(ev.fim)
    endMin = (fimDate.getHours() - DAY_START_HOUR) * 60 + fimDate.getMinutes()
  } else {
    endMin = startMin + 60  // assume duração de 1h quando não há fim
  }

  // Garante pelo menos 20 min de altura visual
  if (endMin <= startMin) endMin = startMin + 20

  return { startMin, endMin }
}

// ---------------------------------------------------------------------------
// Layout de sobreposição (Problema 2)
// ---------------------------------------------------------------------------
interface PositionedEvent {
  ev: CalendarEvent
  startMin: number
  endMin: number
  widthPct: number
  leftPct: number
}

function layoutEvents(events: CalendarEvent[]): PositionedEvent[] {
  // Converte e ordena por início
  const items = events
    .map((ev) => ({ ev, ...eventToMinutes(ev) }))
    .sort((a, b) => a.startMin - b.startMin)

  if (items.length === 0) return []

  // Agrupa eventos com sobreposição temporal
  const groups: typeof items[] = []
  let currentGroup: typeof items = []
  let groupEndMin = -Infinity

  for (const item of items) {
    if (currentGroup.length === 0 || item.startMin < groupEndMin) {
      currentGroup.push(item)
      groupEndMin = Math.max(groupEndMin, item.endMin)
    } else {
      groups.push(currentGroup)
      currentGroup = [item]
      groupEndMin = item.endMin
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup)

  // Distribui colunas dentro de cada grupo
  const positioned: PositionedEvent[] = []

  for (const group of groups) {
    const columns: typeof items[] = []

    for (const item of group) {
      let placed = false
      for (const col of columns) {
        // coloca nessa coluna se não sobrepõe o último evento dela
        if (col[col.length - 1].endMin <= item.startMin) {
          col.push(item)
          placed = true
          break
        }
      }
      if (!placed) columns.push([item])
    }

    const totalCols = columns.length
    columns.forEach((col, colIndex) => {
      col.forEach((item) => {
        positioned.push({
          ...item,
          widthPct: 100 / totalCols,
          leftPct: (100 / totalCols) * colIndex,
        })
      })
    })
  }

  return positioned
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function DayView({ date, events, onEventClick }: DayViewProps) {
  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const dayEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.day === date.getDate() &&
          e.month === date.getMonth() + 1 &&
          e.year === date.getFullYear()
      ),
    [date, events]
  )

  const positionedEvents = useMemo(() => layoutEvents(dayEvents), [dayEvents])

  // Linha do horário atual
  const currentTimeTop = useMemo(() => {
    if (!isToday) return -1
    const h = now.getHours()
    const m = now.getMinutes()
    const elapsedMin = (h - DAY_START_HOUR) * 60 + m
    return (elapsedMin / 60) * HOUR_HEIGHT_PX
  }, [isToday]) // eslint-disable-line react-hooks/exhaustive-deps

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const totalGridHeight = TOTAL_HOURS * HOUR_HEIGHT_PX

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
      <div className="flex">
        {/* Hour labels column */}
        <div className="w-14 shrink-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="border-b border-outline-variant/30 py-1 pr-3 text-right text-[11px] text-on-surface-variant/60"
              style={{ height: HOUR_HEIGHT_PX }}
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Events column — single relative container for absolute positioning */}
        <div
          className="flex-1 relative border-l border-outline-variant/30"
          style={{ height: totalGridHeight }}
        >
          {/* Hour separator lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-b border-outline-variant/30"
              style={{ top: (hour - DAY_START_HOUR) * HOUR_HEIGHT_PX }}
            />
          ))}

          {/* Current time indicator */}
          {isToday && currentTimeTop >= 0 && (
            <div className="current-time-line" style={{ top: currentTimeTop }}>
              <div className="current-time-dot" />
            </div>
          )}

          {/* Event blocks */}
          {positionedEvents.map(({ ev, startMin, endMin, widthPct, leftPct }) => {
            const top    = (startMin / 60) * HOUR_HEIGHT_PX
            const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT_PX, 18)
            return (
              <div
                key={ev.id}
                className="absolute rounded px-1.5 py-0.5 text-[11px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                style={{
                  top,
                  height,
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: ev.color || '#3b82f6',
                  // pequena margem interna para separar eventos coluna
                  paddingLeft: leftPct > 0 ? '4px' : undefined,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick?.(ev, e.currentTarget.getBoundingClientRect())
                }}
              >
                <span className="truncate block leading-tight">{ev.title}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
