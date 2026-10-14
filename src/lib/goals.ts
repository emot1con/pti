import { userGoals } from '../data/nutrition'
import type { NutrientKey, UserGoals } from '../types/nutrition'

export const DEFAULT_GOALS: UserGoals = { ...userGoals }

/** Editable fields of the daily target, in display order. */
export interface GoalFieldMeta {
  key: keyof UserGoals
  label: string
  unit: string
  min: number
  max: number
  step: number
}

export const goalFields: GoalFieldMeta[] = [
  { key: 'calories', label: 'Kalori', unit: 'kcal', min: 800, max: 6000, step: 50 },
  { key: 'protein', label: 'Protein', unit: 'g', min: 20, max: 400, step: 5 },
  { key: 'carbs', label: 'Karbohidrat', unit: 'g', min: 20, max: 700, step: 5 },
  { key: 'fat', label: 'Lemak', unit: 'g', min: 10, max: 300, step: 5 },
  { key: 'fiber', label: 'Serat', unit: 'g', min: 5, max: 100, step: 1 },
]

export interface GoalPreset {
  id: string
  label: string
  description: string
  /** Share of total calories for each macronutrient (sums to 1). */
  ratios: Record<MacroKey, number>
}

type MacroKey = Exclude<NutrientKey, 'fiber'>

export const goalPresets: GoalPreset[] = [
  {
    id: 'balanced',
    label: 'Seimbang',
    description: 'Pembagian makro yang merata untuk kebutuhan harian umum.',
    ratios: { protein: 0.2, carbs: 0.5, fat: 0.3 },
  },
  {
    id: 'high-protein',
    label: 'Tinggi Protein',
    description: 'Cocok untuk yang aktif berolahraga atau sedang membentuk otot.',
    ratios: { protein: 0.35, carbs: 0.35, fat: 0.3 },
  },
  {
    id: 'low-carb',
    label: 'Rendah Karbo',
    description: 'Menekan karbohidrat dan menambah porsi lemak sehat.',
    ratios: { protein: 0.3, carbs: 0.2, fat: 0.5 },
  },
]

const KCAL_PER_GRAM: Record<MacroKey, number> = {
  protein: 4,
  carbs: 4,
  fat: 9,
}

/** Recommended fiber: roughly 14 g per 1000 kcal. */
const FIBER_PER_1000_KCAL = 14

/** Build a full target from a calorie amount and a preset's macro ratios. */
export function goalsFromPreset(preset: GoalPreset, calories: number): UserGoals {
  const round = (key: MacroKey) =>
    Math.max(1, Math.round((calories * preset.ratios[key]) / KCAL_PER_GRAM[key]))

  return {
    calories,
    protein: round('protein'),
    carbs: round('carbs'),
    fat: round('fat'),
    fiber: Math.max(1, Math.round((calories / 1000) * FIBER_PER_1000_KCAL)),
  }
}

/** Validate and normalise a hand-edited target, clamping to sane bounds. */
export function normalizeGoals(goals: UserGoals): UserGoals {
  const clampField = (key: keyof UserGoals, value: number, fallback: number) => {
    const meta = goalFields.find((field) => field.key === key)
    if (!meta) return fallback
    if (!Number.isFinite(value)) return fallback
    return Math.min(Math.max(Math.round(value), meta.min), meta.max)
  }

  return {
    calories: clampField('calories', goals.calories, DEFAULT_GOALS.calories),
    protein: clampField('protein', goals.protein, DEFAULT_GOALS.protein),
    carbs: clampField('carbs', goals.carbs, DEFAULT_GOALS.carbs),
    fat: clampField('fat', goals.fat, DEFAULT_GOALS.fat),
    fiber: clampField('fiber', goals.fiber, DEFAULT_GOALS.fiber),
  }
}

const STORAGE_KEY = 'nutrisnap.dailyGoals'

export function loadStoredGoals(): UserGoals | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<UserGoals>
    return normalizeGoals({ ...DEFAULT_GOALS, ...parsed })
  } catch {
    return null
  }
}

export function storeGoals(goals: UserGoals) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  } catch {
    /* storage unavailable — targets stay in memory for this session */
  }
}

export function clearStoredGoals() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
