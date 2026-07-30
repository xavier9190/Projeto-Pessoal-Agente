import { metrics, transactions, alerts } from '@/data/financeiro'
import MetricCard from '@/components/financeiro/MetricCard'
import TransactionRow from '@/components/financeiro/TransactionRow'
import AlertCard from '@/components/financeiro/AlertCard'

export default function FinanceiroPage() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Dashboard Financeiro</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Visão geral da sua saúde financeira corporativa.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-body-md text-on-surface hover:bg-surface-container-high transition-colors shrink-0 mt-2">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>date_range</span>
          <span>01 Out - 31 Out, 2023</span>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-5">
        {metrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Main Content — 2 columns */}
      <div className="grid grid-cols-[1fr_360px] gap-5">
        {/* Transactions */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-outline-variant">
            <h2 className="text-headline-md text-on-surface">Transações Recentes</h2>
            <button className="text-body-md text-on-surface-variant hover:text-primary transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-4 text-left text-label-md text-on-surface-variant">Date</th>
                  <th className="py-3 px-4 text-left text-label-md text-on-surface-variant">Description</th>
                  <th className="py-3 px-4 text-left text-label-md text-on-surface-variant">Category</th>
                  <th className="py-3 px-4 text-right text-label-md text-on-surface-variant">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Reconciliation */}
        <div className="space-y-4">
          {/* Alerts header */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-headline-md text-on-surface">Alertas e Reconciliações</h2>
              <span className="bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold">
                3
              </span>
            </div>

            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>

          {/* Reconciled Status */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-md text-on-surface">Reconciled Status</span>
              <span className="text-headline-md font-semibold text-primary">94%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: '94%' }} />
            </div>
            <button className="w-full py-2.5 px-4 rounded-xl border border-outline-variant text-body-md text-on-surface hover:bg-surface-container-high transition-colors">
              Run Auto-Reconcile
            </button>
          </div>

          {/* IA Insight */}
          <div className="glass-panel rounded-2xl p-5 bg-gradient-to-br from-surface-container to-surface-container-high relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #ffffff 0%, transparent 60%)' }} />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>auto_awesome</span>
                <span className="text-label-md text-on-surface-variant uppercase tracking-wider">IA Insight</span>
              </div>
              <p className="text-body-md text-on-surface leading-relaxed">
                Redução de 15% nos custos fixos sugerida via otimização de SaaS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
