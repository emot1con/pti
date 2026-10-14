import { Check, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { scaleNutrients } from '../lib/analysis'
import { MEAL_CATEGORIES } from '../types/nutrition'
import type {
  FoodAnalysis,
  MealCategory,
  NutrientKey,
  Nutrients,
} from '../types/nutrition'
import { cn, formatNumber } from '../lib/utils'

interface FoodAnalysisResultProps {
  analysis: FoodAnalysis
  onAdd: (analysis: FoodAnalysis, category: MealCategory) => void
  onReset: () => void
}

type BreakdownKey = NutrientKey | 'calories' | 'sugar'

const breakdown: { key: BreakdownKey; label: string; unit: string }[] = [
  { key: 'calories', label: 'Kalori', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Karbohidrat', unit: 'g' },
  { key: 'fat', label: 'Lemak', unit: 'g' },
  { key: 'sugar', label: 'Gula', unit: 'g' },
  { key: 'fiber', label: 'Serat', unit: 'g' },
]

export function FoodAnalysisResult({
  analysis,
  onAdd,
  onReset,
}: FoodAnalysisResultProps) {
  const [name, setName] = useState(analysis.name)
  const [grams, setGrams] = useState(analysis.grams)
  const [category, setCategory] = useState<MealCategory>('Makan Siang')

  const scaled = useMemo<Nutrients>(
    () => scaleNutrients(analysis.nutrients, analysis.grams, grams),
    [analysis.nutrients, analysis.grams, grams],
  )

  const confidencePct = Math.round(analysis.confidence * 100)

  const valueFor = (key: BreakdownKey) =>
    key === 'sugar' ? (scaled.sugar ?? 0) : scaled[key]

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
          <Sparkles className="size-3.5" />
          Kecocokan {confidencePct}%
        </span>
        <span className="rounded-full bg-cream-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-400">
          Simulasi
        </span>
      </div>

      <div className="rounded-3xl border border-cream-200 bg-white p-4">
        <label
          htmlFor="analysis-name"
          className="text-xs font-bold uppercase tracking-wide text-ink-400"
        >
          Nama makanan
        </label>
        <input
          id="analysis-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm font-bold text-ink-900 outline-none transition focus:border-brand-300 focus:bg-white"
        />

        <div className="mt-4 flex items-center justify-between">
          <label
            htmlFor="analysis-portion"
            className="text-xs font-bold uppercase tracking-wide text-ink-400"
          >
            Porsi
          </label>
          <span className="text-sm font-bold text-ink-900">{grams} g</span>
        </div>
        <input
          id="analysis-portion"
          type="range"
          min={50}
          max={600}
          step={10}
          value={grams}
          onChange={(event) => setGrams(Number(event.target.value))}
          className="mt-2 w-full cursor-pointer accent-brand-500"
        />
        <div className="mt-1 flex justify-between text-[11px] font-medium text-ink-400">
          <span>50 g</span>
          <span>600 g</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        {breakdown.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-cream-200 bg-cream-50/70 px-3 py-2.5"
          >
            <dt className="text-[11px] font-semibold text-ink-400">
              {item.label}
            </dt>
            <dd className="mt-0.5 text-base font-extrabold text-ink-900">
              {formatNumber(valueFor(item.key))}
              <span className="ml-1 text-[11px] font-semibold text-ink-400">
                {item.unit}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-400">
          Waktu makan
        </span>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {MEAL_CATEGORIES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={category === option}
              className={cn(
                'rounded-xl px-2 py-2 text-xs font-bold transition',
                category === option
                  ? 'bg-brand-500 text-white shadow-soft'
                  : 'bg-cream-100 text-ink-500 hover:bg-cream-200',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            onAdd(
              { ...analysis, name: name.trim() || analysis.name, grams, nutrients: scaled },
              category,
            )
          }
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
        >
          <Check className="size-4" strokeWidth={2.8} />
          Tambahkan ke Makan Hari Ini
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-600 transition hover:bg-cream-200"
        >
          <RotateCcw className="size-4" />
          Pindai ulang
        </button>
      </div>
    </div>
  )
}
