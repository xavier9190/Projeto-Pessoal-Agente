export type CalendarView = 'dia' | 'semana' | 'mes' | 'ano' | 'programacao'

export interface CalendarEvent {
  id: string
  day: number
  month: number
  year: number
  hour: number
  title: string
  color?: string    // hex color for display
  colorId?: string  // Google Calendar colorId for editing
  fim?: string      // ISO 8601 end datetime
  lembrete?: string // ex: '30 minutos antes'
}

export interface ScheduleItem {
  id: string
  date: string
  weekday: string
  events: { time: string; title: string; dotColor: string }[]
}

export interface UpcomingEvent {
  id: string
  time: string
  title: string
  avatars: string[]
  extra?: number
}

// July 2026 sample events
export const sampleEvents: CalendarEvent[] = [
  { id: '1', day: 19, month: 7, year: 2026, hour: 9, title: 'Daily Standup', color: '#3b82f6' },
  { id: '2', day: 21, month: 7, year: 2026, hour: 14, title: 'Review Mensal', color: '#8b5cf6' },
  { id: '3', day: 22, month: 7, year: 2026, hour: 10, title: 'Sincronização Design', color: '#06b6d4' },
  { id: '4', day: 25, month: 7, year: 2026, hour: 16, title: 'Planejamento Q3', color: '#10b981' },
]

export const scheduleItems: ScheduleItem[] = [
  {
    id: '1',
    date: '9 AGO.',
    weekday: 'DOM.',
    events: [{ time: 'Dia inteiro', title: 'Dia dos Pais', dotColor: '#22c55e' }],
  },
  {
    id: '2',
    date: '7 SET.',
    weekday: 'SEG.',
    events: [{ time: 'Dia inteiro', title: 'Independência', dotColor: '#22c55e' }],
  },
  {
    id: '3',
    date: '12 OUT.',
    weekday: 'SEG.',
    events: [{ time: 'Dia inteiro', title: 'Nossa Senhora de Aparecida', dotColor: '#22c55e' }],
  },
  {
    id: '4',
    date: '2 NOV.',
    weekday: 'SEG.',
    events: [
      { time: 'Dia inteiro', title: 'Aniversário da Rafa', dotColor: '#3b82f6' },
      { time: 'Dia inteiro', title: 'Finados', dotColor: '#22c55e' },
    ],
  },
  {
    id: '5',
    date: '15 NOV.',
    weekday: 'DOM.',
    events: [{ time: 'Dia inteiro', title: 'Proclamação da República', dotColor: '#22c55e' }],
  },
  {
    id: '6',
    date: '25 DEZ.',
    weekday: 'QUI.',
    events: [{ time: 'Dia inteiro', title: 'Natal', dotColor: '#22c55e' }],
  },
]

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    time: '10:00 - 11:30',
    title: 'Sincronização de Design',
    avatars: ['PX', 'AL'],
    extra: 2,
  },
  {
    id: '2',
    time: '14:00 - 15:00',
    title: 'Review Mensal',
    avatars: ['PX', 'MR'],
  },
]
