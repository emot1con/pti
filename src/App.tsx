import { lazy, Suspense, useState } from 'react'
import { Leaf, Loader2 } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { MobileNavigation } from './components/MobileNavigation'
import { DashboardHeader } from './components/DashboardHeader'
import { NutritionAnalysis } from './components/NutritionAnalysis'
import { Profile } from './components/Profile'
import { TodaysMeals } from './components/TodaysMeals'
import { FoodScanner } from './components/FoodScanner'
import { DailyTargetEditor } from './components/DailyTargetEditor'
import { useDashboard } from './context/DashboardContext'
import { useScanner } from './context/ScannerContext'
import type { AppView } from './types/app'

const NutritionAnalytics = lazy(() =>
  import('./components/NutritionAnalytics').then((module) => ({
    default: module.NutritionAnalytics,
  })),
)

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [targetOpen, setTargetOpen] = useState(false)
  const [view, setView] = useState<AppView>('dashboard')
  const { user, goals, meals, totals, removeMeal } = useDashboard()
  const { openCamera } = useScanner()

  const handleScan = () => {
    setView('dashboard')
    openCamera()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        view={view}
        onNavigate={setView}
        onOpenCamera={handleScan}
      />

      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <div className="mb-5 flex items-center gap-2.5 lg:hidden">
            <span className="grid size-9 place-items-center rounded-2xl bg-brand-500 text-white shadow-soft">
              <Leaf className="size-5" strokeWidth={2.4} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-ink-900">
              Nutri<span className="text-brand-600">Snap</span>
            </span>
          </div>

          {view === 'dashboard' && (
            <>
              <DashboardHeader user={user} />

              <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <div className="flex flex-col gap-6 xl:col-span-2">
                  <NutritionAnalysis
                    totals={totals}
                    goals={goals}
                    onEditTargets={() => setTargetOpen(true)}
                  />

                  <TodaysMeals
                    meals={meals}
                    totalCalories={totals.calories}
                    onRemove={removeMeal}
                  />
                </div>

                <div className="xl:col-span-1">
                  <div className="xl:sticky xl:top-6">
                    <FoodScanner />
                  </div>
                </div>
              </div>
            </>
          )}

          {view === 'analytics' && (
            <Suspense
              fallback={
                <div className="grid place-items-center rounded-4xl border border-cream-200 bg-white py-24 shadow-soft">
                  <span className="flex flex-col items-center gap-3 text-ink-500">
                    <Loader2 className="size-6 animate-spin text-brand-500" />
                    <span className="text-sm font-semibold">
                      Memuat analitik&hellip;
                    </span>
                  </span>
                </div>
              }
            >
              <NutritionAnalytics />
            </Suspense>
          )}

          {view === 'profile' && <Profile />}
        </main>
      </div>

      <MobileNavigation
        view={view}
        onNavigate={setView}
        onOpenCamera={handleScan}
      />

      <DailyTargetEditor open={targetOpen} onClose={() => setTargetOpen(false)} />
    </div>
  )
}
