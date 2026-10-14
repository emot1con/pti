import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  ScanLine,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useState,
  type DragEvent,
} from 'react'
import { FoodAnalysisResult } from './FoodAnalysisResult'
import { mealFromAnalysis, simulateFoodAnalysis } from '../lib/analysis'
import { timeLabel } from '../lib/utils'
import { useDashboard } from '../context/DashboardContext'
import { useScanner } from '../context/ScannerContext'
import type { FoodAnalysis, MealCategory } from '../types/nutrition'

type Status = 'idle' | 'ready' | 'analyzing' | 'result' | 'added'

const MAX_BYTES = 10 * 1024 * 1024
const ANALYZE_MS = 1800

export function FoodScanner() {
  const { addMeal } = useDashboard()
  const { openCamera, pickFile, captured, consumeCaptured } = useScanner()
  const [previewUrl, setPreviewUrl] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [status, setStatus] = useState<Status>('idle')
  const [analysis, setAnalysis] = useState<FoodAnalysis>()
  const [error, setError] = useState<string>()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!captured) return
    setError(undefined)
    setPreviewUrl(captured.dataUrl)
    setFileName(undefined)
    setAnalysis(undefined)
    setStatus('ready')
    consumeCaptured()
  }, [captured, consumeCaptured])

  const loadFile = useCallback((file: File | undefined) => {
    setError(undefined)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Pilih file gambar (JPG atau PNG).')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Ukuran gambar melebihi 10 MB. Coba foto yang lebih kecil.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setPreviewUrl(reader.result)
      setFileName(file.name)
      setAnalysis(undefined)
      setStatus('ready')
    }
    reader.readAsDataURL(file)
  }, [])

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setDragging(false)
    loadFile(event.dataTransfer.files?.[0])
  }

  const analyze = () => {
    if (!previewUrl) return
    setStatus('analyzing')
    setError(undefined)
    window.setTimeout(() => {
      setAnalysis(simulateFoodAnalysis(previewUrl))
      setStatus('result')
    }, ANALYZE_MS)
  }

  const reset = () => {
    setPreviewUrl(undefined)
    setFileName(undefined)
    setAnalysis(undefined)
    setError(undefined)
    setStatus('idle')
  }

  const handleAdd = (result: FoodAnalysis, category: MealCategory) => {
    addMeal(mealFromAnalysis(result, category, timeLabel(new Date())))
    setStatus('added')
  }

  return (
    <section
      id="scanner"
      aria-labelledby="food-scanner-heading"
      className="animate-rise scroll-mt-24 overflow-hidden rounded-4xl border border-brand-100 bg-white shadow-card"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-5 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10 blur-xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Camera className="size-5" strokeWidth={2.2} />
          </span>
          <div>
            <h2
              id="food-scanner-heading"
              className="text-lg font-extrabold tracking-tight"
            >
              Pemindai Makanan AI
            </h2>
            <p className="text-sm text-white/75">
              Ambil foto dan temukan nilai gizinya.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p aria-live="polite" className="sr-only">
          {status === 'analyzing'
            ? 'Menganalisis foto makananmu'
            : status === 'result'
              ? 'Analisis siap'
              : status === 'added'
                ? 'Makanan ditambahkan'
                : ''}
        </p>

        {status === 'idle' && (
          <div
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-5 py-8 text-center transition ${
              dragging
                ? 'border-brand-400 bg-brand-50'
                : 'border-cream-300 bg-cream-50/60'
            }`}
          >
            <span className="grid size-14 place-items-center rounded-full bg-white text-brand-500 shadow-soft">
              <ImagePlus className="size-6" strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-bold text-ink-900">Tambah foto makanan</p>
              <p className="mt-1 text-sm text-ink-500">
                Buka kamera langsung, atau seret &amp; lepas file (JPG/PNG, maks
                10 MB).
              </p>
            </div>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={openCamera}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
              >
                <Camera className="size-4" strokeWidth={2.6} />
                Pindai dengan Kamera
              </button>
              <button
                type="button"
                onClick={pickFile}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-white px-5 py-3 text-sm font-bold text-ink-600 transition hover:bg-cream-100"
              >
                <Upload className="size-4" />
                Unggah File
              </button>
            </div>
          </div>
        )}

        {(status === 'ready' || status === 'analyzing') && previewUrl && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-cream-200">
              <img
                src={previewUrl}
                alt="Makanan terpilih"
                className="aspect-video w-full object-cover"
              />
              {status === 'analyzing' && (
                <div className="absolute inset-0 grid place-items-center bg-ink-900/55 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="size-7 animate-spin text-brand-300" />
                    <p className="text-sm font-semibold">
                      Menganalisis makananmu&hellip;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {status === 'ready' && (
              <>
                {fileName && (
                  <p className="truncate text-xs font-medium text-ink-400">
                    {fileName}
                  </p>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={analyze}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
                  >
                    <ScanLine className="size-4" strokeWidth={2.6} />
                    Analisis foto
                  </button>
                  <button
                    type="button"
                    onClick={openCamera}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-600 transition hover:bg-cream-200"
                  >
                    <Camera className="size-4" />
                    Ganti
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {status === 'result' && analysis && (
          <FoodAnalysisResult
            analysis={analysis}
            onAdd={handleAdd}
            onReset={reset}
          />
        )}

        {status === 'added' && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-brand-100 bg-brand-50 px-6 py-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand-500 text-white shadow-soft">
              <CheckCircle2 className="size-7" strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-bold text-ink-900">
                Ditambahkan ke Makan Hari Ini
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Total kalori dan nutrisimu sudah diperbarui.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-1 inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600 active:scale-[0.98]"
            >
              <Camera className="size-4" strokeWidth={2.4} />
              Pindai makanan lain
            </button>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
          >
            {error}
          </p>
        )}

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-ink-400">
          <ShieldCheck className="mt-px size-3.5 shrink-0" />
          Pengenalan di sini disimulasikan untuk prototipe. Hubungkan backend AI
          untuk mengaktifkan deteksi makanan nyata.
        </p>
      </div>
    </section>
  )
}
