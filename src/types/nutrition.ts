export type MealCategory = 'Sarapan' | 'Makan Siang' | 'Makan Malam' | 'Camilan'

export const MEAL_CATEGORIES: MealCategory[] = [
  'Sarapan',
  'Makan Siang',
  'Makan Malam',
  'Camilan',
]

/**
 * Nutritional values. All masses are in grams, energy in kilocalories.
 * Values are estimates and should not be treated as precise measurements.
 */
export interface Nutrients {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar?: number
}

export type NutrientKey = 'protein' | 'carbs' | 'fat' | 'fiber'

/** A logged meal shown in "Makan Hari Ini". */
export interface MealEntry {
  id: string
  name: string
  category: MealCategory
  /** Display time, e.g. "07:30". */
  time: string
  nutrients: Nutrients
  /** Emoji used for the illustrated thumbnail. */
  emoji: string
  /** Tailwind gradient stops for the thumbnail backdrop. */
  thumb: [string, string]
  /** Optional real image; falls back to the illustrated thumbnail. */
  imageUrl?: string
}

/** Recognised food result coming from the (simulated) AI scanner. */
export interface FoodAnalysis {
  id: string
  name: string
  /** 0–1 confidence score. */
  confidence: number
  /** Nutrients for the reference portion (`grams`). */
  nutrients: Nutrients
  grams: number
  emoji: string
  thumb: [string, string]
  /** Data URI of the uploaded photo, when available. */
  imageUrl?: string
}

export interface UserGoals extends Nutrients {
  calories: number
}

export interface User {
  name: string
  initials: string
}

export interface NutrientMeta {
  key: NutrientKey
  label: string
  unit: string
  /** Icon + colour tokens used by the nutrient cards. */
  accent: {
    text: string
    bg: string
    bar: string
    ring: string
  }
}
