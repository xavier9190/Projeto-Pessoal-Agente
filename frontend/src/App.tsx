import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import ChatPage from '@/pages/ChatPage'
import FinanceiroPage from '@/pages/FinanceiroPage'
import CalendarioPage from '@/pages/CalendarioPage'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
