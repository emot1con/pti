import { useMemo, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, CalendarRange, Flame, TrendingUp } from 'lucide-react'
import { NutrientCard } from './NutrientCard'
import { weeklyHistory } from '../data/analytics'
import { nutrientMeta } from '../data/nutrition'
import { useDashboard } from '../context/DashboardContext'
import { formatNumber, weekdayShort } from '../lib/utils'
import type { Nutrients } from '../types/nutrition'

const CHART_COLORS = {
  brand: '#2ba463',
  protein: '#3b82f6',
  carbs: '#f59e0b',
  fat: '#a78bfa',
}

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid #f2eadd',
  boxShadow: '0 14px 34px -18px rgba(30,42,36,0.3)',
  fontSize: 12,
  padding: '8px 12px',
}

interface DayPoint extends Nutrients {
  label: string
  isToday: boolean
}

export function NutritionAnalytics() {
  const { totals, goals } = useDashboard()

  const points = useMemo<DayPoint[]>(() => {
    const history = weeklyHistory.map((day, index) => ({
      ...day,
      label: weekdayShort(weeklyHistory.length - index),
      isToday: false,
    }))
    return [...history, { ...totals, label: 'Hari ini', isToday: true }]
  }, [totals])

  const weekCalories = points.reduce((sum, point) => sum + point.calories, 0)
  const avgCalories = Math.round(weekCalories / points.length)
  const avgProtein = Math.round(
    points.reduce((sum, point) => sum + point.protein, 0) / points.length,
  )
  const daysOnTarget = points.filter(
    (point) => point.calories >= goals.calories * 0.9,
  ).length

  const macroSplit = [
    {
      key: 'protein' as const,
      name: 'Protein',
      grams: totals.protein,
      kcal: totals.protein * 4,
      color: CHART_COLORS.protein,
    },
    {
      key: 'carbs' as const,
      name: 'Karbohidrat',
      grams: totals.carbs,
      kcal: totals.carbs * 4,
      color: CHART_COLORS.carbs,
    },
    {
      key: 'fat' as const,
      name: 'Lemak',
      grams: totals.fat,
      kcal: totals.fat * 9,
      color: CHART_COLORS.fat,
    },
  ]

  const macroTotal = macroSplit.reduce((sum, item) => sum + item.kcal, 0)

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="analytics-heading"
        className="animate-rise overflow-hidden rounded-4xl border border-cream-200 bg-white p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Activity className="size-5" strokeWidth={2.2} />
            </span>
            <div>
              <h1
                id="analytics-heading"
                className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl"
              >
                Analitik Nutrisi
              </h1>
              <p className="mt-0.5 text-sm text-ink-500">
                Ringkasan asupanmu selama 7 hari terakhir.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-cream-100 px-3 py-1.5 text-xs font-bold text-ink-600">
            <CalendarRange className="size-3.5 text-brand-500" />
            7 hari terakhir
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Flame className="size-4" />}
            label="Rata-rata kalori"
            value={formatNumber(avgCalories)}
            unit="kcal"
          />
          <StatCard
            icon={<TrendingUp className="size-4" />}
            label="Total 7 hari"
            value={formatNumber(weekCalories)}
            unit="kcal"
          />
          <StatCard
            icon={<Activity className="size-4" />}
            label="Rata-rata protein"
            value={formatNumber(avgProtein)}
            unit="g"
          />
          <StatCard
            icon={<CalendarRange className="size-4" />}
            label="Hari capai target"
            value={`${daysOnTarget}/${points.length}`}
            unit="hari"
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section
          aria-labelledby="calorie-trend-heading"
          className="animate-rise rounded-4xl border border-cream-200 bg-white p-5 shadow-soft sm:p-6 xl:col-span-2"
        >
          <h2
            id="calorie-trend-heading"
            className="text-base font-extrabold tracking-tight text-ink-900"
          >
            Tren Kalori Harian
          </h2>
          <p className="mt-0.5 text-sm text-ink-500">
            Garis putus-putus menandai target {formatNumber(goals.calories)} kcal.
          </p>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#8a968f' }}
                  dy={6}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#8a968f' }}
                  width={44}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(43,164,99,0.08)' }}
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${formatNumber(Number(value))} kcal`, 'Kalori']}
                />
                <ReferenceLine
                  y={goals.calories}
                  stroke={CHART_COLORS.carbs}
                  strokeDasharray="6 6"
                  strokeWidth={2}
                />
                <Bar dataKey="calories" radius={[8, 8, 0, 0]} maxBarSize={44}>
                  {points.map((point) => (
                    <Cell
                      key={point.label}
                      fill={point.isToday ? CHART_COLORS.brand : '#aee2c4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          aria-labelledby="macro-split-heading"
          className="animate-rise rounded-4xl border border-cream-200 bg-white p-5 shadow-soft sm:p-6"
        >
          <h2
            id="macro-split-heading"
            className="text-base font-extrabold tracking-tight text-ink-900"
          >
            Distribusi Makro Hari Ini
          </h2>
          <p className="mt-0.5 text-sm text-ink-500">
            Kontribusi tiap makronutrien terhadap kalori.
          </p>

          <div className="relative mx-auto mt-4 h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroSplit}
                  dataKey="kcal"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="none"
                >
                  {macroSplit.map((item) => (
                    <Cell key={item.key} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${formatNumber(Number(value))} kcal`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <span className="text-2xl font-extrabold tracking-tight text-ink-900">
                {formatNumber(macroTotal)}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                kcal makro
              </span>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {macroSplit.map((item) => {
              const percent =
                macroTotal > 0 ? Math.round((item.kcal / macroTotal) * 100) : 0
              return (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-cream-200 bg-cream-50/60 px-3.5 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-ink-900">
                    {formatNumber(item.grams)} g
                    <span className="ml-2 text-xs font-semibold text-ink-400">
                      {percent}%
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="protein-trend-heading"
        className="animate-rise rounded-4xl border border-cream-200 bg-white p-5 shadow-soft sm:p-6"
      >
        <h2
          id="protein-trend-heading"
          className="text-base font-extrabold tracking-tight text-ink-900"
        >
          Tren Protein &amp; Serat
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">
          Perbandingan asupan protein dan serat harian.
        </p>

        <div className="mt-4 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="protein-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.protein} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS.protein} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fiber-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.brand} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.brand} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#8a968f' }}
                dy={6}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#8a968f' }}
                width={44}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  `${formatNumber(Number(value))} g`,
                  String(name),
                ]}
              />
              <Area
                type="monotone"
                dataKey="protein"
                name="Protein"
                stroke={CHART_COLORS.protein}
                strokeWidth={2.5}
                fill="url(#protein-fill)"
              />
              <Area
                type="monotone"
                dataKey="fiber"
                name="Serat"
                stroke={CHART_COLORS.brand}
                strokeWidth={2.5}
                fill="url(#fiber-fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section
        aria-labelledby="today-target-heading"
        className="animate-rise rounded-4xl border border-cream-200 bg-white p-5 shadow-soft sm:p-6"
      >
        <h2
          id="today-target-heading"
          className="text-base font-extrabold tracking-tight text-ink-900"
        >
          Hari Ini vs Target
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">
          Progres makronutrienmu dibanding target harian.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {nutrientMeta.map((meta) => (
            <NutrientCard
              key={meta.key}
              meta={meta}
              value={totals[meta.key]}
              target={goals[meta.key]}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: ReactNode
  label: string
  value: string
  unit: string
}) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-50/60 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-400">
        <span className="text-brand-500">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold text-ink-900">
        {value}
        <span className="ml-1 text-xs font-semibold text-ink-400">{unit}</span>
      </p>
    </div>
  )
}
