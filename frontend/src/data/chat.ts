export interface HistoryItem {
  id: string
  title: string
  time: string
}

export interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  icon: string
  content: string | ComplexContent
  time: string
}

export interface ComplexContent {
  type: 'complex'
  intro: string
  cards: { label: string; value: string; valueClass?: string }[]
  list: { icon: string; text: string }[]
}

export const sidebarHistory: HistoryItem[] = [
  { id: '1', title: 'Gastos do mês de julho', time: 'Hoje, 19:32' },
  { id: '2', title: 'Reunião amanhã às 14h', time: 'Hoje, 17:05' },
  { id: '3', title: 'Almoço — R$ 45', time: 'Ontem, 13:20' },
  { id: '4', title: 'Planejamento financeiro', time: 'Seg., 10:41' },
  { id: '5', title: 'Evento no Google Calendar', time: 'Dom., 09:15' },
]

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    icon: 'smart_toy',
    content: 'Olá Alexandre! Como posso ajudar na sua produtividade hoje? Analisei seu calendário e notei que você tem uma reunião de finanças em 30 minutos.',
    time: '10:24 AM',
  },
  {
    id: '2',
    role: 'user',
    icon: 'person',
    content: 'Perfeito. Você pode gerar um resumo das pendências do Dashboard Financeiro para eu apresentar na reunião?',
    time: '10:25 AM',
  },
  {
    id: '3',
    role: 'ai',
    icon: 'auto_awesome',
    content: {
      type: 'complex',
      intro: 'Com certeza. Aqui está o resumo atualizado baseado nos dados do seu ERP:',
      cards: [
        { label: 'Fluxo de Caixa', value: '+R$ 12.450,00', valueClass: 'text-primary' },
        { label: 'Contas a Pagar', value: 'R$ 2.800,00', valueClass: 'text-error' },
      ],
      list: [
        { icon: 'check_circle', text: '3 faturas conciliadas automaticamente hoje.' },
        { icon: 'warning', text: 'Alerta: Variação de 15% nos custos operacionais.' },
      ],
    },
    time: '10:26 AM',
  },
]
