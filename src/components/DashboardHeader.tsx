import { Bell, CalendarDays, CheckCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn, formatDateLong, greetingForHour } from '../lib/utils'
import type { User } from '../types/nutrition'

export function DashboardHeader({ user }: { user: User }) {
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="animate-rise">
        <p className="text-sm font-medium text-brand-600">
          {greetingForHour(now.getHours())}, {user.name}!
        </p>
        <h1 className="mt-1 text-balance text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          Yuk, lihat bagaimana kamu memberi nutrisi untuk tubuhmu hari ini.
        </h1>
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-ink-500">
          <CalendarDays className="size-4 text-ink-400" />
          {formatDateLong(now)}
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              unread ? 'Notifikasi, belum dibaca' : 'Notifikasi'
            }
            aria-expanded={open}
            aria-haspopup="true"
            className="relative grid size-11 place-items-center rounded-2xl border border-cream-200 bg-white/80 text-ink-600 shadow-soft transition hover:bg-white hover:text-ink-900"
          >
            <Bell className="size-5" />
            {unread && (
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-carbs-500 ring-2 ring-white" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-3 w-72 origin-top-right animate-pop rounded-3xl border border-cream-200 bg-white p-3 shadow-lift">
              <div className="flex items-center justify-between px-1 pb-2">
                <p className="text-sm font-bold text-ink-900">Notifikasi</p>
                {unread && (
                  <button
                    type="button"
                    onClick={() => setUnread(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <CheckCheck className="size-3.5" /> Tandai dibaca
                  </button>
                )}
              </div>
              <div className="rounded-2xl bg-cream-100 p-3">
                <p className="text-sm font-semibold text-ink-800">
                  Jaga terus rekor harianmu
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Kamu sudah mencatat 3 makanan hari ini. Tambahkan camilan kaya
                  serat agar tetap sesuai target.
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-soft transition hover:brightness-105',
          )}
          aria-label={`Profil ${user.name}`}
        >
          {user.initials}
        </button>
      </div>
    </header>
  )
}
