export default function ChatInput() {
  return (
    <div className="p-4 border-t border-outline-variant bg-surface-container-low/50 backdrop-blur-sm relative z-10">
      <div className="flex items-center gap-3">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container">
          <span className="material-symbols-outlined">attach_file</span>
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Digite sua mensagem aqui..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/50"
          />
        </div>

        <button className="bg-primary text-background p-3 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center">
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
