import type {
  FoodAnalysis,
  MealEntry,
  NutrientMeta,
  NutrientKey,
  User,
  UserGoals,
} from '../types/nutrition'

export const user: User = {
  name: 'Arqan',
  initials: 'AR',
}

/** Illustrative targets — not medically validated personal recommendations. */
export const userGoals: UserGoals = {
  calories: 2200,
  protein: 90,
  carbs: 250,
  fat: 70,
  fiber: 25,
}

export const nutrientMeta: NutrientMeta[] = [
  {
    key: 'protein',
    label: 'Protein',
    unit: 'g',
    accent: {
      text: 'text-protein-600',
      bg: 'bg-protein-50',
      bar: 'bg-protein-500',
      ring: 'ring-protein-100',
    },
  },
  {
    key: 'carbs',
    label: 'Karbohidrat',
    unit: 'g',
    accent: {
      text: 'text-carbs-600',
      bg: 'bg-carbs-50',
      bar: 'bg-carbs-500',
      ring: 'ring-carbs-100',
    },
  },
  {
    key: 'fat',
    label: 'Lemak',
    unit: 'g',
    accent: {
      text: 'text-fat-600',
      bg: 'bg-fat-50',
      bar: 'bg-fat-500',
      ring: 'ring-fat-100',
    },
  },
  {
    key: 'fiber',
    label: 'Serat',
    unit: 'g',
    accent: {
      text: 'text-brand-600',
      bg: 'bg-brand-50',
      bar: 'bg-brand-500',
      ring: 'ring-brand-100',
    },
  },
]

export const initialMeals: MealEntry[] = [
  {
    id: 'meal-nasi-goreng',
    name: 'Nasi Goreng',
    category: 'Sarapan',
    time: '07:30',
    emoji: '🍚',
    thumb: ['#FCD9A6', '#F2A65A'],
    imageUrl: '/foods/nasi-goreng.jpg',
    nutrients: {
      calories: 470,
      protein: 15,
      carbs: 55,
      fat: 17,
      fiber: 6,
      sugar: 4,
    },
  },
  {
    id: 'meal-ayam-bakar',
    name: 'Nasi Ayam Bakar',
    category: 'Makan Siang',
    time: '12:30',
    emoji: '🍗',
    thumb: ['#F3C08B', '#C97B3C'],
    imageUrl: '/foods/ayam-bakar.jpg',
    nutrients: {
      calories: 450,
      protein: 31,
      carbs: 45,
      fat: 13,
      fiber: 4,
      sugar: 3,
    },
  },
  {
    id: 'meal-banana-milk',
    name: 'Pisang & Susu',
    category: 'Camilan',
    time: '15:30',
    emoji: '🍌',
    thumb: ['#FBE7A1', '#F2C94C'],
    imageUrl: '/foods/pisang-susu.jpg',
    nutrients: {
      calories: 330,
      protein: 9,
      carbs: 40,
      fat: 10,
      fiber: 5,
      sugar: 24,
    },
  },
]

/**
 * Sample recognitions used to simulate the AI scanner until a real backend
 * is connected. Nutrients are estimates for the reference `grams` portion.
 */
export const recognitionSamples: Omit<FoodAnalysis, 'id' | 'imageUrl'>[] = [
  {
    name: 'Nasi Goreng Spesial',
    confidence: 0.94,
    grams: 250,
    emoji: '🍚',
    thumb: ['#FCD9A6', '#F2A65A'],
    nutrients: {
      calories: 470,
      protein: 15,
      carbs: 55,
      fat: 17,
      fiber: 6,
      sugar: 4,
    },
  },
  {
    name: 'Sate Ayam',
    confidence: 0.91,
    grams: 200,
    emoji: '🍢',
    thumb: ['#F8C98A', '#D98A3D'],
    nutrients: {
      calories: 380,
      protein: 30,
      carbs: 25,
      fat: 18,
      fiber: 3,
      sugar: 8,
    },
  },
  {
    name: 'Rendang Daging',
    confidence: 0.89,
    grams: 180,
    emoji: '🥘',
    thumb: ['#E8A87C', '#B4552D'],
    nutrients: {
      calories: 420,
      protein: 28,
      carbs: 12,
      fat: 28,
      fiber: 4,
      sugar: 5,
    },
  },
  {
    name: 'Mie Goreng',
    confidence: 0.92,
    grams: 250,
    emoji: '🍜',
    thumb: ['#F6D28B', '#E09A3E'],
    nutrients: {
      calories: 410,
      protein: 14,
      carbs: 58,
      fat: 13,
      fiber: 4,
      sugar: 6,
    },
  },
  {
    name: 'Gado-Gado',
    confidence: 0.87,
    grams: 300,
    emoji: '🥗',
    thumb: ['#CDE8B5', '#7DBE6A'],
    nutrients: {
      calories: 340,
      protein: 16,
      carbs: 38,
      fat: 14,
      fiber: 9,
      sugar: 10,
    },
  },
  {
    name: 'Pisang & Susu',
    confidence: 0.96,
    grams: 250,
    emoji: '🍌',
    thumb: ['#FBE7A1', '#E9C158'],
    nutrients: {
      calories: 330,
      protein: 9,
      carbs: 40,
      fat: 10,
      fiber: 5,
      sugar: 24,
    },
  },
]

export const macroKeys: NutrientKey[] = ['protein', 'carbs', 'fat', 'fiber']
