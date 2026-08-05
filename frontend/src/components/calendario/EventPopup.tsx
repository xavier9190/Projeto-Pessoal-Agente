/**
 * EventPopup — Modal flutuante de detalhes/edição de evento do calendário.
 *
 * Modos:
 *   'view'    — exibe título, data/hora, lembrete + botões lápis/lixeira/fechar
 *   'edit'    — permite alterar data, hora início/fim e cor/categoria
 *   'confirm' — confirmação inline antes de excluir
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import type React from 'react'
import type { CalendarEvent } from '@/data/calendario'
import type { AtualizarEventoPayload } from '@/lib/api'
import { COLOR_DEFAULT } from '@/lib/colors'

// ---------------------------------------------------------------------------
// Categorias / paleta de cores
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: '9',  label: 'Trabalho', color: '#3b82f6' },
  { id: '10', label: 'Pessoal',  color: '#22c55e' },
  { id: '11', label: 'Saúde',   color: '#ef4444' },
  { id: '3',  label: 'Estudos', color: '#8b5cf6' },
  { id: '6',  label: 'Lazer',   color: '#f97316' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const WEEKDAYS_PT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

function formatDate(ev: CalendarEvent): string {
  const d = new Date(ev.year, ev.month - 1, ev.day)
  return `${WEEKDAYS_PT[d.getDay()]}, ${ev.day} de ${MONTHS_PT[ev.month - 1]}`
}

function formatTime(ev: CalendarEvent): string {
  if (!ev.hour && !ev.fim) return 'Dia inteiro'
  const start = `${String(ev.hour).padStart(2, '0')}:00`
  if (!ev.fim) return start
  // fim is ISO string — extract HH:MM
  const fimDate = new Date(ev.fim)
  const end = `${String(fimDate.getHours()).padStart(2, '0')}:${String(fimDate.getMinutes()).padStart(2, '0')}`
  return `${start} – ${end}`
}

/** ISO string local (YYYY-MM-DDTHH:MM) from date components */
function toLocalISO(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`
}

/** YYYY-MM-DD from CalendarEvent */
function evToDateString(ev: CalendarEvent): string {
  return `${ev.year}-${String(ev.month).padStart(2, '0')}-${String(ev.day).padStart(2, '0')}`
}

/** HH:MM from CalendarEvent.hour */
function evToTimeString(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

/** HH:MM from ISO string */
function isoToTimeString(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Posicionamento do popup
// ---------------------------------------------------------------------------
const POPUP_WIDTH = 300
const POPUP_HEIGHT = 220 // estimate for positioning; actual height varies

function calcPosition(anchor: DOMRect): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const GAP = 8

  let left = anchor.right + GAP
  let top = anchor.top

  // Cabe à direita?
  if (left + POPUP_WIDTH > vw - GAP) {
    left = anchor.left - POPUP_WIDTH - GAP
  }
  // Não cabe à esquerda também?
  if (left < GAP) {
    left = Math.max(GAP, (vw - POPUP_WIDTH) / 2)
  }

  // Cabe abaixo?
  if (top + POPUP_HEIGHT > vh - GAP) {
    top = Math.max(GAP, vh - POPUP_HEIGHT - GAP)
  }

  return { top, left }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
type PopupMode = 'view' | 'edit' | 'confirm'

interface EventPopupProps {
  event: CalendarEvent
  anchorRect: DOMRect
  onClose: () => void
  onUpdate: (id: string, payload: AtualizarEventoPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function EventPopup({
  event,
  anchorRect,
  onClose,
  onUpdate,
  onDelete,
}: EventPopupProps) {
  const [mode, setMode] = useState<PopupMode>('view')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit form state
  const [editDate, setEditDate] = useState(evToDateString(event))
  const [editTimeStart, setEditTimeStart] = useState(evToTimeString(event.hour))
  const [editTimeEnd, setEditTimeEnd] = useState(
    event.fim ? isoToTimeString(event.fim) : evToTimeString(Math.min(event.hour + 1, 23))
  )
  const [editColorId, setEditColorId] = useState(event.colorId ?? '9')

  const popupRef = useRef<HTMLDivElement>(null)
  const pos = calcPosition(anchorRect)

  // Close on outside click
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [handleOutsideClick])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleSave = async () => {
    setError(null)
    setIsSaving(true)
    try {
      const inicio = toLocalISO(editDate, editTimeStart)
      const fim = toLocalISO(editDate, editTimeEnd)
      await onUpdate(event.id, { inicio, fim, color_id: editColorId })
    } catch {
      setError('Erro ao salvar. Tente novamente.')
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setError(null)
    setIsSaving(true)
    try {
      await onDelete(event.id)
    } catch {
      setError('Erro ao excluir. Tente novamente.')
      setIsSaving(false)
    }
  }

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  const eventColor = event.color ?? COLOR_DEFAULT

  const headerActions = (
    <div className="flex items-center gap-0.5 ml-auto shrink-0">
      {mode === 'view' && (
        <>
          <button
            id="event-popup-edit"
            title="Editar"
            onClick={() => { setMode('edit'); setError(null) }}
            className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
          </button>
          <button
            id="event-popup-delete"
            title="Excluir"
            onClick={() => { setMode('confirm'); setError(null) }}
            className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
          </button>
        </>
      )}
      <button
        id="event-popup-close"
        title="Fechar"
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
      </button>
    </div>
  )

  // -------------------------------------------------------------------------
  // View mode
  // -------------------------------------------------------------------------
  const viewContent = (
    <div className="space-y-3">
      {/* Date + time row */}
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-on-surface-variant mt-0.5" style={{ fontSize: '16px' }}>
          calendar_today
        </span>
        <div>
          <p className="text-body-md text-on-surface">{formatDate(event)}</p>
          <p className="text-label-md text-on-surface-variant mt-0.5">{formatTime(event)}</p>
        </div>
      </div>

      {/* Reminder row (if present) */}
      {event.lembrete && (
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
            notifications
          </span>
          <p className="text-label-md text-on-surface-variant">{event.lembrete}</p>
        </div>
      )}
    </div>
  )

  // -------------------------------------------------------------------------
  // Edit mode
  // -------------------------------------------------------------------------
  const editContent = (
    <div className="space-y-3">
      {/* Date */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
          calendar_today
        </span>
        <input
          id="event-popup-date"
          type="date"
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
          className="flex-1 bg-surface-container-high text-on-surface text-body-md rounded-lg px-2 py-1 border border-outline-variant focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Time start / end */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
          schedule
        </span>
        <div className="flex items-center gap-2 flex-1">
          <input
            id="event-popup-time-start"
            type="time"
            value={editTimeStart}
            onChange={(e) => setEditTimeStart(e.target.value)}
            className="flex-1 bg-surface-container-high text-on-surface text-body-md rounded-lg px-2 py-1 border border-outline-variant focus:outline-none focus:border-primary transition-colors"
          />
          <span className="text-on-surface-variant text-label-md">–</span>
          <input
            id="event-popup-time-end"
            type="time"
            value={editTimeEnd}
            onChange={(e) => setEditTimeEnd(e.target.value)}
            className="flex-1 bg-surface-container-high text-on-surface text-body-md rounded-lg px-2 py-1 border border-outline-variant focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Color / category picker */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
          palette
        </span>
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`event-popup-color-${cat.id}`}
              title={cat.label}
              onClick={() => setEditColorId(cat.id)}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: cat.color,
                boxShadow: editColorId === cat.id ? `0 0 0 2px #fff, 0 0 0 4px ${cat.color}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-error">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          id="event-popup-cancel"
          onClick={() => { setMode('view'); setError(null) }}
          disabled={isSaving}
          className="px-3 py-1 text-label-md text-on-surface-variant rounded-lg hover:bg-surface-container-highest transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          id="event-popup-save"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-1 text-label-md font-medium bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </div>
  )

  // -------------------------------------------------------------------------
  // Confirm delete mode
  // -------------------------------------------------------------------------
  const confirmContent = (
    <div className="space-y-3">
      <p className="text-body-md text-on-surface">Excluir este evento permanentemente?</p>
      {error && <p className="text-[11px] text-error">{error}</p>}
      <div className="flex items-center justify-end gap-2">
        <button
          id="event-popup-confirm-cancel"
          onClick={() => { setMode('view'); setError(null) }}
          disabled={isSaving}
          className="px-3 py-1 text-label-md text-on-surface-variant rounded-lg hover:bg-surface-container-highest transition-colors disabled:opacity-50"
        >
          Não
        </button>
        <button
          id="event-popup-confirm-delete"
          onClick={handleDelete}
          disabled={isSaving}
          className="px-4 py-1 text-label-md font-medium bg-error text-on-error rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? 'Excluindo…' : 'Sim, excluir'}
        </button>
      </div>
    </div>
  )

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <>
      {/* Backdrop (transparent, just catches outside clicks via ref) */}
      <div
        ref={popupRef}
        id="event-popup"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes: ${event.title}`}
        className="fixed z-50 shadow-2xl"
        style={{
          top: pos.top,
          left: pos.left,
          width: POPUP_WIDTH,
          background: 'rgba(32,31,31,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(71,70,74,0.8)',
          borderRadius: '12px',
          animation: 'popup-enter 0.15s cubic-bezier(0.2,0,0,1)',
        } as React.CSSProperties}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          {/* Color dot + title */}
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: eventColor }}
          />
          <span
            className="text-body-md font-medium text-on-surface truncate flex-1"
            title={event.title}
          >
            {event.title}
          </span>
          {headerActions}
        </div>

        {/* Divider */}
        <div className="h-px bg-outline-variant/40 mx-3" />

        {/* Body */}
        <div className="px-3 py-3">
          {mode === 'view' && viewContent}
          {mode === 'edit' && editContent}
          {mode === 'confirm' && confirmContent}
        </div>
      </div>

    </>
  )
}
