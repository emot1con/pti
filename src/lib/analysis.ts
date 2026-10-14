import { recognitionSamples } from '../data/nutrition'
import type { FoodAnalysis, MealEntry, Nutrients } from '../types/nutrition'
import { createId } from './utils'

/** Scale a nutrient set to a new portion size, preserving ratios. */
export function scaleNutrients(
  nutrients: Nutrients,
  fromGrams: number,
  toGrams: number,
): Nutrients {
  if (fromGrams <= 0) return { ...nutrients }
  const factor = toGrams / fromGrams
  const scale = (value: number | undefined) =>
    value === undefined ? undefined : Math.round(value * factor)
  return {
    calories: Math.round(nutrients.calories * factor),
    protein: Math.round(nutrients.protein * factor),
    carbs: Math.round(nutrients.carbs * factor),
    fat: Math.round(nutrients.fat * factor),
    fiber: Math.round(nutrients.fiber * factor),
    sugar: scale(nutrients.sugar),
  }
}

/**
 * Simulates an AI recognition result. This is NOT real inference — it picks a
 * plausible sample and adds slight noise so the prototype feels alive.
 */
export function simulateFoodAnalysis(imageUrl?: string): FoodAnalysis {
  const sample =
    recognitionSamples[Math.floor(Math.random() * recognitionSamples.length)]
  const jitter = 0.95 + Math.random() * 0.12
  const nutrients: Nutrients = {
    calories: Math.round(sample.nutrients.calories * jitter),
    protein: Math.round(sample.nutrients.protein * jitter),
    carbs: Math.round(sample.nutrients.carbs * jitter),
    fat: Math.round(sample.nutrients.fat * jitter),
    fiber: Math.round(sample.nutrients.fiber * jitter),
    sugar:
      sample.nutrients.sugar === undefined
        ? undefined
        : Math.round(sample.nutrients.sugar * jitter),
  }

  return {
    id: createId('analysis'),
    name: sample.name,
    confidence: sample.confidence,
    grams: sample.grams,
    emoji: sample.emoji,
    thumb: sample.thumb,
    nutrients,
    imageUrl,
  }
}

export function mealFromAnalysis(
  analysis: FoodAnalysis,
  category: MealEntry['category'],
  time: string,
): MealEntry {
  return {
    id: createId('meal'),
    name: analysis.name,
    category,
    time,
    emoji: analysis.emoji,
    thumb: analysis.thumb,
    imageUrl: analysis.imageUrl,
    nutrients: { ...analysis.nutrients },
  }
}
