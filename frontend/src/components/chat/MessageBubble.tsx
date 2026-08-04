import type { ChatMessage, ComplexContent } from '@/data/chat'

// ------------------------------------------------------------------
// Loading bubble (typing indicator)
// ------------------------------------------------------------------
export function LoadingBubble() {
  return (
    <div className="flex gap-4 max-w-3xl">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-container">
        <span
          className="material-symbols-outlined text-on-primary-container"
          style={{ fontSize: '14px' }}
        >
          smart_toy
        </span>
      </div>

      {/* Bubble */}
      <div className="glass-panel rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Complex content renderer (unchanged)
// ------------------------------------------------------------------
function ComplexMessageContent({ content }: { content: ComplexContent }) {
  return (
    <div className="space-y-4">
      <p className="text-body-lg text-on-surface">{content.intro}</p>

      <div className="grid grid-cols-2 gap-3">
        {content.cards.map((card, i) => (
          <div
            key={i}
            className="p-3 border border-outline-variant rounded-xl bg-surface-container-lowest"
          >
            <p className="text-[12px] text-on-surface-variant mb-1">{card.label}</p>
            <p className={`text-lg font-bold ${card.valueClass || 'text-on-surface'}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <ul className="space-y-2">
        {content.list.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
            <span
              className="material-symbols-outlined shrink-0 mt-0.5"
              style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
            >
              {item.icon}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ------------------------------------------------------------------
// Regular message bubble
// ------------------------------------------------------------------
interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isError = message.role === 'ai' && (message.content as string)?.startsWith?.('[erro]')
  const isComplex =
    typeof message.content === 'object' && (message.content as ComplexContent).type === 'complex'

  return (
    <div className={`flex gap-4 ${isUser ? 'ml-auto flex-row-reverse' : ''} max-w-3xl`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-surface-container-highest border border-outline-variant'
            : isError
              ? 'bg-error-container'
              : 'bg-primary-container'
        }`}
      >
        <span
          className={`material-symbols-outlined ${
            isUser ? 'text-on-surface' : isError ? 'text-on-error-container' : 'text-on-primary-container'
          }`}
          style={{ fontSize: '14px' }}
        >
          {message.icon}
        </span>
      </div>

      {/* Bubble */}
      <div
        className={`rounded-2xl ${
          isUser
            ? 'bg-surface-container-high border border-outline-variant rounded-tr-none'
            : isError
              ? 'bg-error-container/30 border border-error-container rounded-tl-none'
              : 'glass-panel rounded-tl-none'
        } ${isComplex ? 'p-5' : 'p-4'}`}
      >
        {isComplex ? (
          <ComplexMessageContent content={message.content as ComplexContent} />
        ) : (
          <p
            className={`text-body-lg leading-relaxed ${
              isError ? 'text-error' : 'text-on-surface'
            }`}
          >
            {message.content as string}
          </p>
        )}
        <span
          className={`text-[10px] text-on-surface-variant mt-2 block opacity-50 ${isUser ? 'text-right' : ''}`}
        >
          {message.time}
        </span>
      </div>
    </div>
  )
}
