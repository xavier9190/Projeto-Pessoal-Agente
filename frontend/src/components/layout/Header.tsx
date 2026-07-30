export default function Header() {
  return (
    <header
      className="fixed top-0 right-0 h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6 z-40"
      style={{ left: '260px' }}
    >
      <span className="text-headline-md text-primary font-semibold">Workspace</span>

      <div className="flex items-center gap-2">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all hover:scale-105 active:scale-95 rounded-lg hover:bg-surface-container">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-all hover:scale-105 active:scale-95 rounded-lg hover:bg-surface-container">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  )
}
