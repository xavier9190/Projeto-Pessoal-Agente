import type { Transaction } from '@/data/financeiro'

interface TransactionRowProps {
  transaction: Transaction
}

const categoryColors: Record<string, string> = {
  Software: 'bg-blue-500/15 text-blue-300',
  Income: 'bg-emerald-500/15 text-emerald-400',
  Facilities: 'bg-orange-500/15 text-orange-300',
  Supplies: 'bg-yellow-500/15 text-yellow-300',
  'Travel & Ent': 'bg-purple-500/15 text-purple-300',
  Utilities: 'bg-red-500/15 text-red-300',
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <tr className="border-b border-outline-variant hover:bg-surface-container/50 transition-colors group">
      <td className="py-3 px-4 text-body-md text-on-surface-variant whitespace-nowrap">
        {transaction.date}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
              {transaction.icon}
            </span>
          </div>
          <span className="text-body-md text-on-surface">{transaction.description}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span
          className={`px-2.5 py-0.5 rounded-full text-label-md font-medium ${
            categoryColors[transaction.category] || 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {transaction.category}
        </span>
      </td>
      <td className={`py-3 px-4 text-body-md font-medium text-right ${transaction.amountClass}`}>
        {transaction.amount}
      </td>
    </tr>
  )
}
