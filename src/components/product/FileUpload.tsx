'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/postscript', 'image/vnd.adobe.photoshop']
const ACCEPTED_EXT = '.pdf,.png,.jpg,.jpeg,.ai,.psd'
const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

interface UploadedFile {
  name: string
  size: number
  type: string
  previewUrl: string | null
}

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  label?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({ onFileChange, label = 'Upload Design File' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(ai|psd)$/i)) {
        setError('Unsupported file type. Please upload PDF, PNG, JPG, AI, or PSD.')
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`)
        return
      }

      setUploading(true)

      // Generate preview for images
      let previewUrl: string | null = null
      if (file.type.startsWith('image/')) {
        previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
      }

      // Simulate upload delay (replace with actual Supabase Storage upload)
      await new Promise((r) => setTimeout(r, 800))

      setUploaded({ name: file.name, size: file.size, type: file.type, previewUrl })
      setUploading(false)
      onFileChange(file)
    },
    [onFileChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const clear = useCallback(() => {
    setUploaded(null)
    setError(null)
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [onFileChange])

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXT}
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload design file"
      />

      <AnimatePresence mode="wait">
        {!uploaded && !uploading ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative w-full rounded-md border-2 border-dashed cursor-pointer
              flex flex-col items-center justify-center gap-3 py-10 px-6 text-center
              transition-all duration-200
              ${isDragging
                ? 'border-brand-blue bg-brand-blue/5 scale-[1.01]'
                : 'border-border hover:border-brand-blue/40 hover:bg-white/2 bg-bg-secondary'
              }
            `}
            role="button"
            tabIndex={0}
            aria-label="Drop file here or click to browse"
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-brand-blue/20' : 'bg-white/5'}`}>
              <Upload size={20} className={isDragging ? 'text-brand-blue' : 'text-text-secondary'} />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">
                Drop your file here, or{' '}
                <span className="text-brand-blue">browse</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">
                PDF, PNG, JPG, AI, PSD — max {MAX_SIZE_MB} MB
              </p>
            </div>
          </motion.div>
        ) : uploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full rounded-md border border-border bg-bg-secondary p-6 flex flex-col items-center gap-3"
          >
            <Loader2 size={24} className="text-brand-blue animate-spin" />
            <p className="text-sm text-text-secondary">Uploading your file…</p>
          </motion.div>
        ) : uploaded ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full rounded-md border border-success/30 bg-success/5 p-4 flex items-center gap-4"
          >
            {/* Preview or icon */}
            {uploaded.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={uploaded.previewUrl}
                alt="Design preview"
                className="w-14 h-14 object-cover rounded shrink-0 border border-border"
              />
            ) : (
              <div className="w-14 h-14 rounded bg-bg-secondary border border-border flex items-center justify-center shrink-0">
                <FileText size={22} className="text-text-secondary" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success shrink-0" />
                <p className="text-sm font-medium text-text-primary truncate">{uploaded.name}</p>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{formatBytes(uploaded.size)}</p>
            </div>

            <button
              type="button"
              onClick={clear}
              className="text-text-secondary hover:text-error transition-colors shrink-0 touch-target"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-error flex items-center gap-1.5"
          >
            <AlertCircle size={13} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
