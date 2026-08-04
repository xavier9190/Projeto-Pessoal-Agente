import { useState, useEffect } from 'react'
import { buscarEventos } from '@/lib/api'
import { COLOR_MAP, COLOR_DEFAULT } from '@/lib/colors'

interface SimpleEvent {
  id: string
  title: string
  dateStr: string
  timeStr: string
  color: string
  timestamp: number
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatDateLabel(d: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Hoje'
  if (d.toDateString() === tomorrow.toDateString()) return 'Amanhã'

  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

export default function UpcomingEvents({ maxHeightClass = "max-h-[280px]" }: { maxHeightClass?: string }) {
  const [events, setEvents] = useState<SimpleEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNextEvents() {
      try {
        const now = new Date()
        const sixMonthsLater = new Date(now)
        sixMonthsLater.setMonth(now.getMonth() + 6)

        const apiEvents = await buscarEventos(toISODate(now), toISODate(sixMonthsLater))

        const parsed = apiEvents.map((ev) => {
          const dt = new Date(ev.inicio)
          return {
            id: ev.id,
            title: ev.titulo,
            dateStr: formatDateLabel(dt),
            timeStr: dt.getHours() > 0 ? formatTime(dt) : 'Dia inteiro',
            color: ev.colorId ? (COLOR_MAP[ev.colorId] ?? COLOR_DEFAULT) : COLOR_DEFAULT,
            timestamp: dt.getTime(),
          }
        })

        // Filtra eventos que já passaram hoje
        const futureOnly = parsed.filter(e => e.timestamp >= now.getTime() - 86400000)
        futureOnly.sort((a, b) => a.timestamp - b.timestamp)
        
        setEvents(futureOnly.slice(0, 10))
      } catch (error) {
        console.error('Erro ao buscar próximos eventos', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNextEvents()
  }, [])

  if (loading) {
    return <div className="text-on-surface-variant text-sm opacity-60">Carregando eventos...</div>
  }

  if (events.length === 0) {
    return <div className="text-on-surface-variant text-sm opacity-60">Nenhum evento futuro.</div>
  }

  return (
    <div className={`space-y-3 overflow-y-auto custom-scrollbar pr-2 ${maxHeightClass}`}>
      {events.map((ev) => (
        <div
          key={ev.id}
          className="p-4 glass-panel rounded-2xl hover:border-outline transition-colors cursor-pointer group flex gap-3"
        >
          <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: ev.color }} />
          <div>
            <p className="text-[12px] text-on-surface-variant mb-1 font-medium">
              {ev.dateStr} • {ev.timeStr}
            </p>
            <h4 className="text-on-surface font-semibold text-body-md group-hover:text-primary transition-colors">
              {ev.title}
            </h4>
          </div>
        </div>
      ))}
    </div>
  )
}
