import type { CSSProperties } from 'react'
import {
  Beef,
  Droplet,
  Leaf,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { cn, formatNumber, percentOf } from '../lib/utils'
import type { NutrientKey, NutrientMeta } from '../types/nutrition'

const iconByKey: Record<NutrientKey, LucideIcon> = {
  protein: Beef,
  carbs: Wheat,
  fat: Droplet,
  fiber: Leaf,
}

interface NutrientCardProps {
  meta: NutrientMeta
  value: number
  target: number
  /** "card" = standalone card, "plain" = tile for embedding in a panel. */
  variant?: 'card' | 'plain'
  style?: CSSProperties
}

export function NutrientCard({
  meta,
  value,
  target,
  variant = 'card',
  style,
}: NutrientCardProps) {
  const Icon = iconByKey[meta.key]
  const percent = percentOf(value, target)

  return (
    <article
      style={style}
      className={cn(
        'group',
        variant === 'card'
          ? 'animate-rise rounded-3xl border border-cream-200 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card'
          : 'rounded-2xl border border-cream-200 bg-cream-50/60 p-4 transition duration-300 hover:border-brand-200 hover:bg-cream-50',
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'grid place-items-center rounded-2xl ring-1',
            variant === 'card' ? 'size-10' : 'size-9',
            meta.accent.bg,
            meta.accent.text,
            meta.accent.ring,
          )}
        >
          <Icon
            className={variant === 'card' ? 'size-5' : 'size-[18px]'}
            strokeWidth={2.2}
          />
        </span>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-bold',
            meta.accent.bg,
            meta.accent.text,
          )}
        >
          {percent}%
        </span>
      </div>

      <h3
        className={cn(
          'font-semibold text-ink-500',
          variant === 'card' ? 'mt-4 text-sm' : 'mt-3 text-xs',
        )}
      >
        {meta.label}
      </h3>
      <p className="mt-1 flex items-baseline gap-1">
        <span
          className={cn(
            'font-extrabold tracking-tight text-ink-900',
            variant === 'card' ? 'text-2xl' : 'text-xl',
          )}
        >
          {formatNumber(value)}
        </span>
        <span className="text-sm font-semibold text-ink-400">
          / {formatNumber(target)}
          {meta.unit}
        </span>
      </p>

      <ProgressBar
        className="mt-3"
        value={value}
        target={target}
        barClassName={meta.accent.bar}
        label={`Progres ${meta.label}`}
      />
    </article>
  )
}
