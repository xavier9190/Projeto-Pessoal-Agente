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
