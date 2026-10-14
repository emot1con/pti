import { ArrowRight, Plus, Trash2, UtensilsCrossed } from 'lucide-react'
import { FoodThumbnail } from './FoodThumbnail'
import { formatNumber } from '../lib/utils'
import type { MealCategory, MealEntry } from '../types/nutrition'

const categoryStyle: Record<MealCategory, string> = {
  Sarapan: 'bg-sunny-100 text-sunny-500',
  'Makan Siang': 'bg-brand-50 text-brand-600',
  'Makan Malam': 'bg-protein-50 text-protein-600',
  Camilan: 'bg-carbs-50 text-carbs-600',
}

interface TodaysMealsProps {
  meals: MealEntry[]
  totalCalories: number
  onRemove: (id: string) => void
}

function scrollToScanner() {
  document
    .getElementById('scanner')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function TodaysMeals({
  meals,
  totalCalories,
  onRemove,
}: TodaysMealsProps) {
  return (
    <section
      aria-labelledby="todays-meals-heading"
      className="animate-rise rounded-4xl border border-cream-200 bg-white p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="todays-meals-heading"
            className="text-lg font-extrabold tracking-tight text-ink-900"
          >
            Makan Hari Ini
          </h2>
          <p className="mt-0.5 text-sm text-ink-500">
            {meals.length > 0
              ? `${meals.length} makanan · ${formatNumber(totalCalories)} kcal`
              : 'Belum ada catatan'}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-cream-50 px-3.5 py-2 text-sm font-semibold text-ink-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        >
          Lihat Semua
          <ArrowRight className="size-4" />
        </button>
      </div>

      {meals.length === 0 ? (
        <EmptyMeals onScan={scrollToScanner} />
      ) : (
        <ul className="mt-4 flex flex-col gap-1.5">
          {meals.map((meal) => (
            <li key={meal.id}>
              <MealRow meal={meal} onRemove={onRemove} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function MealRow({
  meal,
  onRemove,
}: {
  meal: MealEntry
  onRemove: (id: string) => void
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-transparent p-2.5 transition hover:border-cream-200 hover:bg-cream-50">
      <FoodThumbnail
        emoji={meal.emoji}
        thumb={meal.thumb}
        imageUrl={meal.imageUrl}
        alt={meal.name}
        className="size-14"
        emojiClassName="text-xl"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-ink-900">{meal.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${categoryStyle[meal.category]}`}
          >
            {meal.category}
          </span>
          <span className="text-xs font-medium text-ink-400">{meal.time}</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-bold text-ink-900">
          {formatNumber(meal.nutrients.calories)}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
          kcal
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(meal.id)}
        aria-label={`Hapus ${meal.name}`}
        className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-300 opacity-60 transition hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

function EmptyMeals({ onScan }: { onScan: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-cream-300 bg-cream-50/60 px-6 py-10 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-100 to-carbs-100 text-brand-600 shadow-soft">
        <UtensilsCrossed className="size-7" strokeWidth={2} />
      </span>
      <div>
        <p className="font-bold text-ink-900">Belum ada makanan tercatat</p>
        <p className="mt-1 text-sm text-ink-500">
          Pindai makanan pertamamu dan kami akan memperkirakan gizinya untukmu.
        </p>
      </div>
      <button
        type="button"
        onClick={onScan}
        className="mt-1 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-95"
      >
        <Plus className="size-4" strokeWidth={2.6} />
        Pindai makananmu
      </button>
    </div>
  )
}
