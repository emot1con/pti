import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { CameraCapture } from '../components/CameraCapture'
import { createId } from '../lib/utils'

export interface CapturedImage {
  id: string
  dataUrl: string
}

interface ScannerContextValue {
  cameraOpen: boolean
  openCamera: () => void
  closeCamera: () => void
  /** Latest image produced by the camera or the fallback file picker. */
  captured: CapturedImage | null
  consumeCaptured: () => void
  /** Open the system file picker (used as a camera fallback). */
  pickFile: () => void
}

const ScannerContext = createContext<ScannerContextValue | null>(null)

const MAX_BYTES = 10 * 1024 * 1024

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [cameraOpen, setCameraOpen] = useState(false)
  const [captured, setCaptured] = useState<CapturedImage | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const openCamera = useCallback(() => setCameraOpen(true), [])
  const closeCamera = useCallback(() => setCameraOpen(false), [])
  const consumeCaptured = useCallback(() => setCaptured(null), [])
  const pickFile = useCallback(() => inputRef.current?.click(), [])

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > MAX_BYTES) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCaptured({ id: createId('capture'), dataUrl: reader.result })
      }
    }
    reader.readAsDataURL(file)
  }

  const value = useMemo<ScannerContextValue>(
    () => ({
      cameraOpen,
      openCamera,
      closeCamera,
      captured,
      consumeCaptured,
      pickFile,
    }),
    [cameraOpen, openCamera, closeCamera, captured, consumeCaptured, pickFile],
  )

  return (
    <ScannerContext.Provider value={value}>
      {children}

      <CameraCapture
        open={cameraOpen}
        onClose={closeCamera}
        onCapture={(dataUrl) => {
          setCaptured({ id: createId('capture'), dataUrl })
          setCameraOpen(false)
        }}
        onUploadInstead={() => {
          setCameraOpen(false)
          pickFile()
        }}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="sr-only"
        aria-label="Unggah foto makanan"
      />
    </ScannerContext.Provider>
  )
}

export function useScanner() {
  const context = useContext(ScannerContext)
  if (!context) {
    throw new Error('useScanner must be used within a ScannerProvider')
  }
  return context
}
