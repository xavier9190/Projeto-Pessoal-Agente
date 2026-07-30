import type { ChatMessage, ComplexContent } from '@/data/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

function ComplexMessageContent({ content }: { content: ComplexContent }) {
  return (
    <div className="space-y-4">
      <p className="text-body-lg text-on-surface">{content.intro}</p>

      {/* Mini cards */}
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

      {/* List items */}
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

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isComplex = typeof message.content === 'object' && (message.content as ComplexContent).type === 'complex'

  return (
    <div className={`flex gap-4 ${isUser ? 'ml-auto flex-row-reverse' : ''} max-w-3xl`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-surface-container-highest border border-outline-variant'
            : 'bg-primary-container'
        }`}
      >
        <span
          className={`material-symbols-outlined ${isUser ? 'text-on-surface' : 'text-on-primary-container'}`}
          style={{ fontSize: '14px' }}
        >
          {message.icon}
        </span>
      </div>

      {/* Bubble */}
      <div
        className={`p-4 rounded-2xl ${
          isUser
            ? 'bg-surface-container-high border border-outline-variant rounded-tr-none'
            : 'glass-panel rounded-tl-none'
        } ${isComplex ? 'p-5' : 'p-4'}`}
      >
        {isComplex ? (
          <ComplexMessageContent content={message.content as ComplexContent} />
        ) : (
          <p className="text-body-lg text-on-surface leading-relaxed">
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
