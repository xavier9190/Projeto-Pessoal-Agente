import ChatPanel from '@/components/chat/ChatPanel'
import UtilityPanel from '@/components/chat/UtilityPanel'

export default function ChatPage() {
  return (
    <div className="flex h-full">
      <ChatPanel />
      <UtilityPanel />
    </div>
  )
}
