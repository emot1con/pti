import {
  BarChart3,
  Home,
  ScanLine,
  User,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { AppView } from '../types/app'

interface MobileItem {
  label: string
  icon: LucideIcon
  view?: AppView
  soon?: boolean
}

const items: MobileItem[] = [
  { label: 'Beranda', icon: Home, view: 'dashboard' },
  { label: 'Analitik', icon: BarChart3, view: 'analytics' },
  { label: 'Profil', icon: User, view: 'profile' },
]

interface MobileNavigationProps {
  view: AppView
  onNavigate: (view: AppView) => void
  onOpenCamera: () => void
}

export function MobileNavigation({
  view,
  onNavigate,
  onOpenCamera,
}: MobileNavigationProps) {
  return (
    <nav
      aria-label="Navigasi seluler"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
    >
      <div className="mx-auto max-w-lg px-3 pb-3">
        <div className="relative flex items-center justify-between rounded-3xl border border-cream-200 bg-cream-50/95 px-3 py-2 shadow-lift backdrop-blur-md">
          <div className="flex flex-1 justify-around">
            {items.slice(0, 1).map((item) => (
              <MobileNavButton
                key={item.label}
                item={item}
                active={item.view === view}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenCamera}
            aria-label="Pindai makanan dengan kamera"
            className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-lift transition active:scale-95"
          >
            <ScanLine className="size-6" strokeWidth={2.3} />
          </button>

          <div className="flex flex-1 justify-around">
            {items.slice(1).map((item) => (
              <MobileNavButton
                key={item.label}
                item={item}
                active={item.view === view}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileNavButton({
  item,
  active,
  onNavigate,
}: {
  item: MobileItem
  active: boolean
  onNavigate: (view: AppView) => void
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      disabled={item.soon}
      onClick={() => item.view && onNavigate(item.view)}
      className={cn(
        'flex w-16 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition',
        active ? 'text-brand-600' : 'text-ink-400 hover:text-ink-700',
        item.soon && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'grid size-9 place-items-center rounded-xl transition',
          active && 'bg-brand-50',
        )}
      >
        <Icon className="size-5" strokeWidth={2.2} />
      </span>
      {item.label}
    </button>
  )
}
