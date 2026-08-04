import { useState, useRef, useEffect } from 'react'
import MessageBubble, { LoadingBubble } from './MessageBubble'
import ChatInput from './ChatInput'
import { enviarMensagem } from '@/lib/api'
import type { ChatMessage } from '@/data/chat'

// Mensagem de boas-vindas fixa exibida ao abrir o chat
const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'ai',
  icon: 'smart_toy',
  content: 'Olá! Sou o Xavier, seu assistente pessoal. Posso consultar e criar eventos no seu calendário. Como posso ajudar?',
  time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
}

function nowTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para o fim sempre que as mensagens mudam
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    // 1. Adiciona mensagem do usuário
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      icon: 'person',
      content: text,
      time: nowTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // 2. Monta o histórico (sem a welcome, sem a nova mensagem do usuário)
    //    somente as trocas user/assistant já confirmadas
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      }))

    // 3. Chama o backend
    try {
      const { message } = await enviarMensagem(text, history as { role: 'user' | 'assistant'; content: string }[])
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          icon: 'smart_toy',
          content: message,
          time: nowTime(),
        },
      ])
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Erro de rede'
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          icon: 'error',
          content: `[erro] Não consegui me conectar ao assistente. ${errorText}`,
          time: nowTime(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6 flex flex-col min-w-0">
      <div className="flex-1 glass-panel rounded-3xl flex flex-col overflow-hidden relative">
        {/* Dot grid background decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Chat Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-primary animate-pulse' : 'bg-primary'}`} />
            <h2 className="text-headline-md text-on-surface">Assistente IA Central</h2>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Loading bubble (typing indicator) */}
          {isLoading && <LoadingBubble />}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Chat Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
