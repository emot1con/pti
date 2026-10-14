import {
  Activity,
  Flame,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { NutrientCard } from './NutrientCard'
import { nutrientMeta } from '../data/nutrition'
import { formatNumber, percentOf, progressRatio } from '../lib/utils'
import type { NutrientKey, Nutrients, UserGoals } from '../types/nutrition'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const FOCUS_KEYS: NutrientKey[] = ['protein', 'fiber', 'carbs', 'fat']
const NUTRIENT_NAME: Record<NutrientKey, string> = {
  protein: 'protein',
  fiber: 'serat',
  carbs: 'karbohidrat',
  fat: 'lemak',
}
const FOCUS_LABEL: Record<NutrientKey, string> = {
  protein: 'kaya protein',
  fiber: 'kaya serat',
  carbs: 'karbohidrat kompleks',
  fat: 'lemak sehat',
}

interface NutritionAnalysisProps {
  totals: Nutrients
  goals: UserGoals
  onEditTargets?: () => void
}

function buildInsight(totals: Nutrients, goals: UserGoals) {
  const below = FOCUS_KEYS.filter((key) => totals[key] < goals[key] * 0.9)

  const opener =
    totals.calories > 0
      ? 'Kamu sudah mencatat dengan baik hari ini!'
      : 'Siap saat kamu siap — catat makanan pertamamu untuk melihat wawasan.'

  if (below.length === 0) {
    return {
      opener,
      body: 'Asupan makromu hari ini sudah sesuai jalur. Pertahankan dan jangan lupa minum air yang cukup.',
      focus: [] as NutrientKey[],
    }
  }

  const primary = below.slice(0, 2)
  const names = primary.map((key) => NUTRIENT_NAME[key]).join(' dan ')
  const labels = primary.map((key) => FOCUS_LABEL[key]).join(' dan ')
  return {
    opener,
    body: `Asupan ${names} kamu masih di bawah target harian. Coba tambahkan makanan ${labels} pada waktu makan berikutnya.`,
    focus: primary,
  }
}

export function NutritionAnalysis({
  totals,
  goals,
  onEditTargets,
}: NutritionAnalysisProps) {
  const ratio = progressRatio(totals.calories, goals.calories)
  const percent = percentOf(totals.calories, goals.calories)
  const remaining = Math.max(goals.calories - totals.calories, 0)
  const [animatedRatio, setAnimatedRatio] = useState(0)
  const insight = buildInsight(totals, goals)

  useEffect(() => {
    const id = window.setTimeout(() => setAnimatedRatio(ratio), 120)
    return () => window.clearTimeout(id)
  }, [ratio])

  return (
    <section
      aria-labelledby="nutrition-analysis-heading"
      className="animate-rise overflow-hidden rounded-4xl border border-brand-100 bg-white shadow-card"
    >
      <div className="flex items-center justify-between gap-4 border-b border-cream-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <Activity className="size-5" strokeWidth={2.2} />
          </span>
          <div>
            <h2
              id="nutrition-analysis-heading"
              className="text-lg font-extrabold tracking-tight text-ink-900"
            >
              Analisis Nutrisi
            </h2>
            <p className="text-sm text-ink-500">
              Asupanmu hari ini dibandingkan target harianmu.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 sm:inline-flex">
            {percent}% dari target
          </span>
          {onEditTargets && (
            <button
              type="button"
              onClick={onEditTargets}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              <Target className="size-3.5" />
              Atur Target
            </button>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-brand-50/70 via-cream-50 to-cream-100/70 px-6 py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-brand-200/40 blur-2xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
              <Flame className="size-3.5" />
              Kalori Hari Ini
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-extrabold leading-none tracking-tight text-ink-900 sm:text-6xl">
                {formatNumber(totals.calories)}
              </span>
              <span className="pb-1 text-lg font-semibold text-ink-400">
                kcal
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-500">
              Kamu sudah mencapai{' '}
              <span className="font-bold text-brand-600">{percent}%</span> dari
              target harianmu.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
              <Stat
                icon={<Target className="size-4" />}
                label="Target harian"
                value={formatNumber(goals.calories)}
              />
              <Stat
                icon={<TrendingUp className="size-4" />}
                label="Sisa"
                value={formatNumber(remaining)}
              />
            </dl>
          </div>

          <div className="relative mx-auto grid size-40 shrink-0 place-items-center sm:mx-0 sm:size-44">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <defs>
                <linearGradient id="analysis-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4DBB7E" />
                  <stop offset="100%" stopColor="#1F8A51" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="#EAF1EC"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="url(#analysis-ring)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - animatedRatio)}
                className="transition-[stroke-dashoffset] duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 grid place-content-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-ink-900">
                {percent}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                dari target harian
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-xs font-bold uppercase tracking-wide text-ink-400">
          Makronutrien
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {nutrientMeta.map((meta) => (
            <NutrientCard
              key={meta.key}
              meta={meta}
              value={totals[meta.key]}
              target={goals[meta.key]}
              variant="plain"
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-3xl border border-sunny-200 bg-gradient-to-br from-sunny-50 to-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-sunny-100 text-sunny-500 ring-1 ring-sunny-200">
              <Lightbulb className="size-5" strokeWidth={2.2} />
            </span>
            <h3 className="text-base font-bold text-ink-900">
              Wawasan Nutrisi
            </h3>
          </div>

          <p className="mt-4 text-sm font-semibold text-ink-800">
            {insight.opener}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            {insight.body}
          </p>

          {insight.focus.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {insight.focus.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-ink-600 ring-1 ring-cream-200"
                >
                  <Sparkles className="size-3.5 text-sunny-400" />
                  Tambah {NUTRIENT_NAME[key]}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-ink-400">
            Perkiraan ini hanya sebagai panduan dan bukan saran medis.
          </p>
        </div>
      </div>
    </section>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-cream-200/80 bg-white/70 px-3.5 py-3">
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-ink-400">
        <span className="text-brand-500">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-lg font-bold text-ink-900">
        {value}
        <span className="ml-1 text-xs font-semibold text-ink-400">kcal</span>
      </dd>
    </div>
  )
}
