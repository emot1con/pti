import { clsx, type ClassValue } from 'clsx'
import type { MealCategory } from '../types/nutrition'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Ratio of `value` to `target`, clamped to 0–1 for progress visuals. */
export function progressRatio(value: number, target: number) {
  if (target <= 0) return 0
  return clamp(value / target, 0, 1)
}

/** Percentage of `value` to `target`, rounded. Not clamped (may exceed 100). */
export function percentOf(value: number, target: number) {
  if (target <= 0) return 0
  return Math.round((value / target) * 100)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value)
}

export function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Short Indonesian weekday name for a day relative to today. */
export function weekdayShort(daysAgo: number) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date)
}

export function greetingForHour(hour: number) {
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 19) return 'Selamat sore'
  return 'Selamat malam'
}

export function mealCategoryForHour(hour: number): MealCategory {
  if (hour < 11) return 'Sarapan'
  if (hour < 15) return 'Makan Siang'
  if (hour < 18) return 'Camilan'
  return 'Makan Malam'
}

export function timeLabel(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function createId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}
