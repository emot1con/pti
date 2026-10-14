import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialMeals, user } from '../data/nutrition'
import {
  DEFAULT_GOALS,
  clearStoredGoals,
  loadStoredGoals,
  normalizeGoals,
  storeGoals,
} from '../lib/goals'
import type { MealEntry, Nutrients, User, UserGoals } from '../types/nutrition'

export interface DashboardContextValue {
  user: User
  goals: UserGoals
  meals: MealEntry[]
  /** Sum of every logged meal's nutrients. Derived, never hardcoded. */
  totals: Nutrients
  addMeal: (meal: MealEntry) => void
  removeMeal: (id: string) => void
  /** Replace the daily nutrition target. Persisted between visits. */
  updateGoals: (goals: UserGoals) => void
  /** Restore the default daily nutrition target. */
  resetGoals: () => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const emptyTotals: Nutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
}

function sumNutrients(meals: MealEntry[]): Nutrients {
  return meals.reduce<Nutrients>(
    (acc, meal) => ({
      calories: acc.calories + meal.nutrients.calories,
      protein: acc.protein + meal.nutrients.protein,
      carbs: acc.carbs + meal.nutrients.carbs,
      fat: acc.fat + meal.nutrients.fat,
      fiber: acc.fiber + meal.nutrients.fiber,
      sugar: (acc.sugar ?? 0) + (meal.nutrients.sugar ?? 0),
    }),
    { ...emptyTotals },
  )
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealEntry[]>(initialMeals)
  const [goals, setGoals] = useState<UserGoals>(
    () => loadStoredGoals() ?? DEFAULT_GOALS,
  )

  const addMeal = useCallback((meal: MealEntry) => {
    setMeals((current) => [...current, meal])
  }, [])

  const removeMeal = useCallback((id: string) => {
    setMeals((current) => current.filter((meal) => meal.id !== id))
  }, [])

  const updateGoals = useCallback((next: UserGoals) => {
    const normalized = normalizeGoals(next)
    setGoals(normalized)
    storeGoals(normalized)
  }, [])

  const resetGoals = useCallback(() => {
    setGoals(DEFAULT_GOALS)
    clearStoredGoals()
  }, [])

  const totals = useMemo(() => sumNutrients(meals), [meals])

  const value = useMemo<DashboardContextValue>(
    () => ({
      user,
      goals,
      meals,
      totals,
      addMeal,
      removeMeal,
      updateGoals,
      resetGoals,
    }),
    [goals, meals, totals, addMeal, removeMeal, updateGoals, resetGoals],
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
