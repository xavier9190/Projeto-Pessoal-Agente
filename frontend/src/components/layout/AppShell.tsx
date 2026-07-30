import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0" style={{ marginLeft: '260px' }}>
        <Header />
        <main className="flex-1 overflow-hidden" style={{ marginTop: '64px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
