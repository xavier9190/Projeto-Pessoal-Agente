import { chatMessages } from '@/data/chat'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

export default function ChatPanel() {
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
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-headline-md text-on-surface">Assistente IA Central</h2>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
          {chatMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Chat Input */}
        <ChatInput />
      </div>
    </div>
  )
}
