import {
  Check,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_GOALS,
  goalFields,
  goalPresets,
  goalsFromPreset,
  normalizeGoals,
} from '../lib/goals'
import { cn, formatNumber } from '../lib/utils'
import { useDashboard } from '../context/DashboardContext'
import type { UserGoals } from '../types/nutrition'

interface DailyTargetEditorProps {
  open: boolean
  onClose: () => void
}

const MACRO_KCAL: Record<'protein' | 'carbs' | 'fat', number> = {
  protein: 4,
  carbs: 4,
  fat: 9,
}

export function DailyTargetEditor({ open, onClose }: DailyTargetEditorProps) {
  const { goals, updateGoals, resetGoals } = useDashboard()
  const [draft, setDraft] = useState<UserGoals>(goals)
  const [activePreset, setActivePreset] = useState<string>()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setDraft(goals)
      setActivePreset(undefined)
    }
  }, [open, goals])

  useEffect(() => {
    if (!open) return

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLInputElement>('input[type="number"]')
        ?.focus()
    }, 60)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
    }
  }, [open, onClose])

  const macroKcal = useMemo(
    () =>
      draft.protein * MACRO_KCAL.protein +
      draft.carbs * MACRO_KCAL.carbs +
      draft.fat * MACRO_KCAL.fat,
    [draft],
  )

  const share = (key: keyof typeof MACRO_KCAL) =>
    macroKcal > 0 ? Math.round((draft[key] * MACRO_KCAL[key]) / macroKcal * 100) : 0

  if (!open) return null

  const setField = (key: keyof UserGoals, value: number) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setActivePreset(undefined)
  }

  const applyPreset = (presetId: string) => {
    const preset = goalPresets.find((item) => item.id === presetId)
    if (!preset) return
    setDraft(goalsFromPreset(preset, draft.calories))
    setActivePreset(preset.id)
  }

  const handleSave = () => {
    updateGoals(normalizeGoals(draft))
    onClose()
  }

  const handleReset = () => {
    resetGoals()
    setDraft(DEFAULT_GOALS)
    setActivePreset(undefined)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-target-heading"
        className="animate-pop flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-4xl border border-cream-200 bg-white shadow-lift sm:rounded-4xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-5 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-white/10 blur-xl"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Target className="size-5" strokeWidth={2.2} />
              </span>
              <div>
                <h2
                  id="daily-target-heading"
                  className="text-lg font-extrabold tracking-tight"
                >
                  Target Nutrisi Harian
                </h2>
                <p className="text-sm text-white/75">
                  Sesuaikan target agar analisismu lebih akurat.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-sunny-400" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink-400">
                Preset Cepat
              </h3>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {goalPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  aria-pressed={activePreset === preset.id}
                  title={preset.description}
                  className={cn(
                    'rounded-2xl border px-3 py-2.5 text-left text-sm font-bold transition',
                    activePreset === preset.id
                      ? 'border-brand-400 bg-brand-50 text-brand-700'
                      : 'border-cream-200 bg-cream-50 text-ink-600 hover:border-brand-200 hover:bg-brand-50/60',
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {activePreset && (
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                {goalPresets.find((item) => item.id === activePreset)?.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {goalFields.map((field) => (
              <div key={field.key}>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`target-${field.key}`}
                    className="text-sm font-bold text-ink-700"
                  >
                    {field.label}
                  </label>
                  <span className="text-xs font-semibold text-ink-400">
                    {field.min}–{field.max} {field.unit}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id={`target-${field.key}`}
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={draft[field.key]}
                    onChange={(event) =>
                      setField(field.key, Number(event.target.value))
                    }
                    className="w-28 rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm font-bold text-ink-900 outline-none transition focus:border-brand-300 focus:bg-white"
                  />
                  <span className="text-sm font-semibold text-ink-400">
                    {field.unit}
                  </span>
                  {field.key === 'calories' && (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                      <Flame className="size-3.5" />
                      {formatNumber(draft.calories)} kcal
                    </span>
                  )}
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={draft[field.key]}
                  aria-label={`Atur ${field.label}`}
                  onChange={(event) =>
                    setField(field.key, Number(event.target.value))
                  }
                  className="mt-2 w-full cursor-pointer accent-brand-500"
                />
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-cream-200 bg-cream-50/70 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-ink-400">
              Distribusi Makronutrien
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {(['protein', 'carbs', 'fat'] as const).map((key) => (
                <div key={key} className="rounded-2xl bg-white px-2 py-3 shadow-soft">
                  <p className="text-lg font-extrabold text-ink-900">
                    {share(key)}%
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold capitalize text-ink-400">
                    {key === 'carbs' ? 'karbo' : key === 'protein' ? 'protein' : 'lemak'}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
              Target ini adalah panduan umum dan bukan saran medis. Konsultasikan
              dengan ahli gizi untuk kebutuhan khusus.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream-200 bg-cream-50/60 px-6 py-4 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
          >
            <Check className="size-4" strokeWidth={2.8} />
            Simpan Target
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm font-bold text-ink-600 transition hover:bg-cream-100"
          >
            <RotateCcw className="size-4" />
            Kembalikan Default
          </button>
        </div>
      </div>
    </div>
  )
}
