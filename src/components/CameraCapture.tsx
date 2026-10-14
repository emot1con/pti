import {
  AlertTriangle,
  Camera,
  RefreshCw,
  ScanLine,
  Upload,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface CameraCaptureProps {
  open: boolean
  onClose: () => void
  onCapture: (dataUrl: string) => void
  onUploadInstead: () => void
}

type CameraStatus = 'starting' | 'ready' | 'error'

const MAX_CAPTURE_WIDTH = 1280

function messageForError(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return 'Akses kamera ditolak. Izinkan kamera di pengaturan browser lalu coba lagi.'
    }
    if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') {
      return 'Kamera tidak ditemukan di perangkat ini.'
    }
    if (error.name === 'NotReadableError') {
      return 'Kamera sedang dipakai aplikasi lain.'
    }
  }
  return 'Tidak dapat membuka kamera.'
}

export function CameraCapture({
  open,
  onClose,
  onCapture,
  onUploadInstead,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>('starting')
  const [error, setError] = useState<string>()
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  )

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  useEffect(() => {
    if (!open) return
    let cancelled = false

    setStatus('starting')
    setError(undefined)

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Perangkat ini tidak mendukung akses kamera.')
        setStatus('error')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: MAX_CAPTURE_WIDTH },
            height: { ideal: 720 },
          },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => undefined)
        }
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setError(messageForError(err))
        setStatus('error')
      }
    }

    void start()

    return () => {
      cancelled = true
      stopStream()
    }
  }, [open, facingMode, stopStream])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const capture = () => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const scale = Math.min(1, MAX_CAPTURE_WIDTH / video.videoWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    onCapture(canvas.toDataURL('image/jpeg', 0.9))
  }

  const switchCamera = () => {
    stopStream()
    setFacingMode((mode) => (mode === 'environment' ? 'user' : 'environment'))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kamera pemindai makanan"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-0 backdrop-blur-sm sm:p-6"
    >
      <div className="animate-pop flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-4xl border border-cream-200 bg-white shadow-lift sm:rounded-4xl">
        <div className="flex items-center justify-between gap-3 border-b border-cream-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Camera className="size-5" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-ink-900">
                Pindai Makanan
              </h2>
              <p className="text-xs text-ink-500">
                Posisikan makanan di dalam bingkai lalu ambil foto.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kamera"
            className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-500 transition hover:bg-cream-200 hover:text-ink-800"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden bg-ink-900 sm:aspect-[4/3]">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full object-cover"
          />

          {status === 'ready' && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(30,42,36,0.28)]"
            />
          )}

          {status === 'starting' && (
            <div className="absolute inset-0 grid place-items-center bg-ink-900/60">
              <div className="flex flex-col items-center gap-3 text-white">
                <RefreshCw className="size-6 animate-spin text-brand-300" />
                <p className="text-sm font-semibold">Menyalakan kamera&hellip;</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <div className="flex flex-col items-center gap-3 text-white">
                <span className="grid size-12 place-items-center rounded-full bg-red-500/20 text-red-200">
                  <AlertTriangle className="size-6" />
                </span>
                <p className="max-w-xs text-sm font-semibold">{error}</p>
                <button
                  type="button"
                  onClick={onUploadInstead}
                  className="mt-1 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-ink-800 shadow-soft transition hover:bg-cream-100"
                >
                  <Upload className="size-4" />
                  Unggah foto saja
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onUploadInstead}
            className="inline-flex items-center gap-2 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-600 transition hover:bg-cream-200"
          >
            <Upload className="size-4" />
            Unggah
          </button>

          <button
            type="button"
            onClick={capture}
            disabled={status !== 'ready'}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ScanLine className="size-4" strokeWidth={2.6} />
            Ambil Foto
          </button>

          <button
            type="button"
            onClick={switchCamera}
            disabled={status === 'starting'}
            aria-label="Ganti kamera"
            className="grid size-11 place-items-center rounded-2xl border border-cream-200 bg-cream-50 text-ink-600 transition hover:bg-cream-200 disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
