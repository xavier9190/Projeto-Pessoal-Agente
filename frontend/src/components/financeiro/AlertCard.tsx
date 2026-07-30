import type { Alert } from '@/data/financeiro'

interface AlertCardProps {
  alert: Alert
}

export default function AlertCard({ alert }: AlertCardProps) {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-2">
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.dotClass}`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-body-md font-semibold text-on-surface">{alert.title}</h4>
          <p className="text-body-md text-on-surface-variant mt-1">{alert.description}</p>
        </div>
      </div>
      <div className="pl-5">
        <span className={`text-label-md font-bold uppercase tracking-wider ${alert.priorityClass}`}>
          Priority: {alert.priority}
        </span>
      </div>
    </div>
  )
}
