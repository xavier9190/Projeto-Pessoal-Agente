export interface Metric {
  id: string
  title: string
  icon: string
  iconClass?: string
  value: string
  valueClass?: string
  auxiliary: string
  auxiliaryClass?: string
  hasInfo?: boolean
}

export interface Transaction {
  id: string
  date: string
  description: string
  icon: string
  category: string
  amount: string
  amountClass: string
}

export interface Alert {
  id: string
  dotClass: string
  title: string
  description: string
  priority: string
  priorityClass: string
}

export const metrics: Metric[] = [
  {
    id: '1',
    title: 'Fluxo de Caixa',
    icon: 'trending_up',
    iconClass: 'text-primary',
    value: 'R$ 142.500,00',
    auxiliary: '+12.4% vs last mo',
    auxiliaryClass: 'text-primary',
  },
  {
    id: '2',
    title: 'Contas a Pagar',
    icon: 'payments',
    iconClass: 'text-error',
    value: '- R$ 28.450,00',
    valueClass: 'text-error',
    auxiliary: '4 Overdue',
    auxiliaryClass: 'text-error',
  },
  {
    id: '3',
    title: 'Saldo Previsto',
    icon: 'account_balance_wallet',
    value: 'R$ 114.050,00',
    auxiliary: '',
    hasInfo: true,
  },
]

export const transactions: Transaction[] = [
  {
    id: '1',
    date: '24 Oct, 2023',
    description: 'AWS Cloud Services',
    icon: 'cloud',
    category: 'Software',
    amount: '- R$ 1.240,00',
    amountClass: 'text-on-surface',
  },
  {
    id: '2',
    date: '23 Oct, 2023',
    description: 'Pagamento Consultoria X',
    icon: 'work',
    category: 'Income',
    amount: '+ R$ 15.000,00',
    amountClass: 'text-primary',
  },
  {
    id: '3',
    date: '22 Oct, 2023',
    description: 'Aluguel Escritório',
    icon: 'apartment',
    category: 'Facilities',
    amount: '- R$ 8.500,00',
    amountClass: 'text-on-surface',
  },
  {
    id: '4',
    date: '21 Oct, 2023',
    description: 'Suprimentos de Escritório',
    icon: 'shopping_cart',
    category: 'Supplies',
    amount: '- R$ 420,15',
    amountClass: 'text-on-surface',
  },
  {
    id: '5',
    date: '20 Oct, 2023',
    description: 'Jantar Corporativo',
    icon: 'restaurant',
    category: 'Travel & Ent',
    amount: '- R$ 850,00',
    amountClass: 'text-on-surface',
  },
  {
    id: '6',
    date: '19 Oct, 2023',
    description: 'Utility - Electric Corp',
    icon: 'bolt',
    category: 'Utilities',
    amount: '- R$ 3.100,00',
    amountClass: 'text-on-surface',
  },
]

export const alerts: Alert[] = [
  {
    id: '1',
    dotClass: 'bg-red-500',
    title: 'Divergência Bancária',
    description: 'Diferença de R$ 150,00 detectada no extrato Santander.',
    priority: 'High',
    priorityClass: 'text-error',
  },
  {
    id: '2',
    dotClass: 'bg-yellow-400',
    title: 'Reconciliação Pendente',
    description: '12 transações da conta Inter aguardando categorização.',
    priority: 'Mid',
    priorityClass: 'text-yellow-400',
  },
  {
    id: '3',
    dotClass: 'bg-red-500',
    title: 'Boleto Próximo ao Vencimento',
    description: "Fornecedor 'Tech Supply' vence em 24h.",
    priority: 'High',
    priorityClass: 'text-error',
  },
]
