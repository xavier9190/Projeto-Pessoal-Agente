interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="p-4 border-t border-outline-variant bg-surface-container-low/50 backdrop-blur-sm relative z-10">
      <div className="flex items-center gap-3">
        <button
          className="p-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container"
          disabled={disabled}
        >
          <span className="material-symbols-outlined">attach_file</span>
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Digite sua mensagem aqui..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="bg-primary text-background p-3 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px', color: '#141313' }}
          >
            send
          </span>
        </button>
      </div>
    </div>
  )
}
