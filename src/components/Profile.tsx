import { CalendarDays, Flame, Goal, Utensils } from 'lucide-react'
import type { ReactNode } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { formatNumber } from '../lib/utils'

export function Profile() {
  const { user, goals, meals, totals } = useDashboard()
  const calorieProgress = Math.min(
    100,
    Math.round((totals.calories / goals.calories) * 100),
  )

  return (
    <div className="flex flex-col gap-6">
      <section className="animate-rise overflow-hidden rounded-4xl border border-cream-200 bg-white shadow-card">
        <div className="h-28 bg-gradient-to-br from-brand-400 to-brand-600 sm:h-36" />
        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-12 grid size-24 place-items-center rounded-3xl border-4 border-white bg-gradient-to-br from-brand-400 to-brand-600 text-2xl font-extrabold text-white shadow-lift sm:-mt-14 sm:size-28">
            {user.initials}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Pantau kebiasaan makan dan target nutrisi harianmu.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProfileStat
          icon={<Utensils className="size-5" />}
          label="Makanan dicatat"
          value={meals.length}
          detail="hari ini"
        />
        <ProfileStat
          icon={<Flame className="size-5" />}
          label="Kalori hari ini"
          value={formatNumber(totals.calories)}
          detail={`dari ${formatNumber(goals.calories)} kcal`}
        />
        <ProfileStat
          icon={<Goal className="size-5" />}
          label="Target tercapai"
          value={`${calorieProgress}%`}
          detail="target kalori harian"
        />
        <ProfileStat
          icon={<CalendarDays className="size-5" />}
          label="Protein hari ini"
          value={`${formatNumber(totals.protein)} g`}
          detail={`dari ${formatNumber(goals.protein)} g`}
        />
      </div>

      <section className="animate-rise rounded-4xl border border-cream-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <Goal className="size-5" strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-ink-900">
              Target nutrisi harian
            </h2>
            <p className="mt-0.5 text-sm text-ink-500">
              Batas asupan yang sedang kamu gunakan.
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Target value={goals.calories} unit="kcal" label="Kalori" />
          <Target value={goals.protein} unit="g" label="Protein" />
          <Target value={goals.carbs} unit="g" label="Karbohidrat" />
          <Target value={goals.fat} unit="g" label="Lemak" />
          <Target value={goals.fiber} unit="g" label="Serat" />
        </div>
      </section>
    </div>
  )
}

function ProfileStat({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string | number
  detail: string
}) {
  return (
    <section className="animate-rise rounded-3xl border border-cream-200 bg-white p-4 shadow-soft">
      <span className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        {icon}
      </span>
      <p className="mt-4 text-xs font-semibold text-ink-500">{label}</p>
      <p className="mt-1 text-xl font-extrabold tracking-tight text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-400">{detail}</p>
    </section>
  )
}

function Target({ value, unit, label }: { value: number; unit: string; label: string }) {
  return (
    <div className="rounded-2xl bg-cream-100 p-3">
      <p className="text-xs font-semibold text-ink-500">{label}</p>
      <p className="mt-1 text-base font-extrabold text-ink-900">
        {formatNumber(value)} <span className="text-xs text-ink-500">{unit}</span>
      </p>
    </div>
  )
}
