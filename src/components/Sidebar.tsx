import {
  BarChart3,
  ChevronLeft,
  Home,
  Leaf,
  ScanLine,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { AppView } from '../types/app'

interface NavItem {
  label: string
  icon: LucideIcon
  view?: AppView
  action?: 'camera'
  soon?: boolean
}

const navItems: NavItem[] = [
  { label: 'Beranda', icon: Home, view: 'dashboard' },
  { label: 'Pindai Makanan', icon: ScanLine, action: 'camera' },
  { label: 'Analitik Nutrisi', icon: BarChart3, view: 'analytics' },
  { label: 'Profil', icon: User, view: 'profile' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  view: AppView
  onNavigate: (view: AppView) => void
  onOpenCamera: () => void
}

export function Sidebar({
  collapsed,
  onToggle,
  view,
  onNavigate,
  onOpenCamera,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col gap-6 border-r border-cream-200 bg-cream-50/80 px-4 py-6 backdrop-blur-sm transition-[width] duration-300 lg:flex',
        collapsed ? 'w-[88px]' : 'w-[264px]',
      )}
    >
      <div className="flex items-center justify-between">
        <a
          href="#dashboard"
          className={cn(
            'flex items-center gap-3 overflow-hidden',
            collapsed && 'justify-center',
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-soft">
            <Leaf className="size-5" strokeWidth={2.4} />
          </span>
          {!collapsed && (
            <span className="text-lg font-extrabold tracking-tight text-ink-900">
              Nutri<span className="text-brand-600">Snap</span>
            </span>
          )}
        </a>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Tutup sidebar"
            className="grid size-8 place-items-center rounded-xl text-ink-500 transition hover:bg-cream-200 hover:text-ink-800"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Buka sidebar"
          className="mx-auto grid size-8 place-items-center rounded-xl text-ink-500 transition hover:bg-cream-200 hover:text-ink-800"
        >
          <ChevronLeft className="size-4 rotate-180" />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-1" aria-label="Menu utama">
        {navItems.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            collapsed={collapsed}
            active={item.view === view}
            onNavigate={onNavigate}
            onOpenCamera={onOpenCamera}
          />
        ))}
      </nav>

      {!collapsed ? (
        <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-4 text-white shadow-soft">
          <div className="mb-2 grid size-8 place-items-center rounded-xl bg-white/20">
            <Sparkles className="size-4" />
          </div>
          <p className="text-sm font-semibold leading-snug">
            Pindai makanan, catat seketika
          </p>
          <p className="mt-1 text-xs text-white/75">
            Arahkan kamera dan biarkan NutriSnap menghitungnya.
          </p>
        </div>
      ) : (
        <div className="grid size-11 place-items-center self-center rounded-2xl bg-brand-50 text-brand-600">
          <Sparkles className="size-5" />
        </div>
      )}
    </aside>
  )
}

function NavButton({
  item,
  collapsed,
  active,
  onNavigate,
  onOpenCamera,
}: {
  item: NavItem
  collapsed: boolean
  active: boolean
  onNavigate: (view: AppView) => void
  onOpenCamera: () => void
}) {
  const Icon = item.icon

  const handleClick = () => {
    if (item.view) onNavigate(item.view)
    else if (item.action === 'camera') onOpenCamera()
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      disabled={item.soon}
      onClick={handleClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-ink-500 hover:bg-cream-200/70 hover:text-ink-800',
        item.soon && 'cursor-not-allowed opacity-70',
        collapsed && 'justify-center px-0',
      )}
    >
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-xl transition',
          active
            ? 'bg-brand-100 text-brand-600'
            : 'text-ink-400 group-hover:text-ink-700',
        )}
      >
        <Icon className="size-[18px]" strokeWidth={2.2} />
      </span>
      {!collapsed && (
        <span className="flex flex-1 items-center justify-between gap-2 text-left">
          {item.label}
          {item.soon && (
            <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-400">
              Segera
            </span>
          )}
        </span>
      )}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />
      )}
    </button>
  )
}
