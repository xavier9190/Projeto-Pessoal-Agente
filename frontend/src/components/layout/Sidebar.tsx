import { NavLink } from 'react-router-dom'
import { sidebarHistory } from '@/data/chat'

const navItems = [
  { to: '/', icon: 'chat', label: 'Chat', exact: true },
  { to: '/financeiro', icon: 'account_balance_wallet', label: 'Dashboard Financeiro' },
  { to: '/calendario', icon: 'calendar_month', label: 'Calendário' },
]

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col bg-surface-container-low border-r border-outline-variant z-50"
      style={{ width: '260px' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 shrink-0">
        <h1 className="text-display-lg text-primary font-semibold leading-none">Hub</h1>
        <p className="text-label-md text-on-surface-variant mt-1 opacity-70 uppercase tracking-widest">
          Produtividade
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1 shrink-0">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group',
                isActive
                  ? 'bg-surface-container-highest text-primary border-r-2 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
              ].join(' ')
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {item.icon}
            </span>
            <span className="text-body-md font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-outline-variant shrink-0" />

      {/* History */}
      <div className="px-3 flex-1 flex flex-col min-h-0">
        <p className="text-label-md text-on-surface-variant opacity-60 uppercase tracking-widest px-3 mb-3">
          Histórico
        </p>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
          {sidebarHistory.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container text-left transition-colors group"
            >
              <span
                className="material-symbols-outlined text-on-surface-variant shrink-0 mt-0.5"
                style={{ fontSize: '16px' }}
              >
                chat_bubble
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-md text-on-surface truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-on-surface-variant opacity-60 mt-0.5">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
