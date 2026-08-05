const API_BASE = 'http://localhost:8000'

export interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatApiResponse {
  message: string
}

export async function enviarMensagem(
  message: string,
  history: HistoryMessage[],
): Promise<ChatApiResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro desconhecido')
    throw new Error(`Erro ${res.status}: ${errorText}`)
  }

  return res.json() as Promise<ChatApiResponse>
}

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

export interface CalendarApiEvent {
  id: string
  titulo: string
  inicio: string   // ISO 8601
  fim: string      // ISO 8601
  colorId: string | null
}

export async function buscarEventos(
  inicio: string,
  fim: string,
): Promise<CalendarApiEvent[]> {
  const params = new URLSearchParams({ inicio, fim })
  const res = await fetch(`${API_BASE}/api/calendar/events?${params}`)

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro desconhecido')
    throw new Error(`Erro ${res.status}: ${errorText}`)
  }

  const data = await res.json() as { total: number; eventos: CalendarApiEvent[] }
  return data.eventos
}

export interface AtualizarEventoPayload {
  inicio?: string
  fim?: string
  color_id?: string
}

export async function atualizarEvento(
  id: string,
  payload: AtualizarEventoPayload,
): Promise<CalendarApiEvent> {
  const res = await fetch(`${API_BASE}/api/calendar/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro desconhecido')
    throw new Error(`Erro ${res.status}: ${errorText}`)
  }

  return res.json() as Promise<CalendarApiEvent>
}

export async function excluirEvento(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/calendar/events/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro desconhecido')
    throw new Error(`Erro ${res.status}: ${errorText}`)
  }
}
