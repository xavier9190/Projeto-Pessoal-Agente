import type { Metric } from '@/data/financeiro'

interface MetricCardProps {
  metric: Metric
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <span
          className={`material-symbols-outlined ${metric.iconClass || 'text-on-surface-variant'}`}
          style={{ fontSize: '24px' }}
        >
          {metric.icon}
        </span>
        {metric.hasInfo && (
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
            info
          </span>
        )}
        {metric.auxiliaryClass && !metric.hasInfo && (
          <span className={`text-label-md font-medium ${metric.auxiliaryClass}`}>
            {metric.auxiliary}
          </span>
        )}
      </div>

      <div>
        <p className="text-label-md text-on-surface-variant mb-1">{metric.title}</p>
        <p className={`text-headline-lg font-semibold ${metric.valueClass || 'text-on-surface'}`}>
          {metric.value}
        </p>
      </div>

      {metric.auxiliary && !metric.auxiliaryClass && (
        <p className="text-body-md text-on-surface-variant">{metric.auxiliary}</p>
      )}
      {metric.auxiliaryClass && metric.hasInfo && (
        <p className={`text-body-md ${metric.auxiliaryClass}`}>{metric.auxiliary}</p>
      )}
    </div>
  )
}
