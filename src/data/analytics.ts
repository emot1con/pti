import type { Nutrients } from '../types/nutrition'

/**
 * Sample nutrition totals for the previous six days (oldest first). Today's
 * totals are taken live from the dashboard so this page stays in sync.
 */
export const weeklyHistory: Nutrients[] = [
  { calories: 2050, protein: 88, carbs: 235, fat: 64, fiber: 24, sugar: 38 },
  { calories: 1880, protein: 79, carbs: 205, fat: 58, fiber: 21, sugar: 44 },
  { calories: 2310, protein: 96, carbs: 268, fat: 72, fiber: 27, sugar: 41 },
  { calories: 1760, protein: 72, carbs: 190, fat: 55, fiber: 19, sugar: 35 },
  { calories: 2420, protein: 101, carbs: 275, fat: 78, fiber: 29, sugar: 47 },
  { calories: 2140, protein: 90, carbs: 240, fat: 66, fiber: 25, sugar: 40 },
]
