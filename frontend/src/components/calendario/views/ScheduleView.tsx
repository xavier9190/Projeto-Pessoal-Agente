import { scheduleItems } from '@/data/calendario'

export default function ScheduleView() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 p-1">
      {/* Today indicator */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-[11px] font-bold">
            {new Date().getDate()}
          </div>
        </div>
        <div className="flex-1 h-px bg-red-500" />
      </div>

      {/* Schedule items */}
      {scheduleItems.map((item) => (
        <div key={item.id} className="flex gap-4">
          {/* Date column */}
          <div className="w-24 shrink-0 pt-3 text-right">
            <p className="text-label-md text-on-surface font-semibold">{item.date}</p>
            <p className="text-[11px] text-on-surface-variant">{item.weekday}</p>
          </div>

          {/* Events column */}
          <div className="flex-1 space-y-2">
            {item.events.map((ev, j) => (
              <div
                key={j}
                className="glass-panel rounded-xl p-3 flex items-center gap-3 hover:border-outline transition-colors cursor-pointer"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ev.dotColor }}
                />
                <div className="flex-1">
                  <p className="text-body-md text-on-surface">{ev.title}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
