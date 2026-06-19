import { useState, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { cn } from '../utils/cn'

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_SIZE_MB = 5

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const validateFile = (selected: File): string | null => {
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      return 'Only PDF and Word documents are accepted'
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_SIZE_MB}MB`
    }
    return null
  }

  const handleFile = (selected: File) => {
    const validationError = validateFile(selected)
    if (validationError) {
      setError(validationError)
      setFile(null)
      return
    }
    setError('')
    setFile(selected)
  }

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setUploading(false)
    navigate('/ats-result')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Your Resume</h2>
        <p className="mt-1 text-muted">
          Upload your resume to get an ATS compatibility score and personalized suggestions from
          CareerLens AI.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Select File"
          description="Drag and drop or click to browse. PDF and DOCX up to 5MB."
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors',
            dragActive
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/30'
              : 'border-border bg-muted-bg hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-950/20',
            error && 'border-red-300 bg-red-50 dark:bg-red-950/20',
          )}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-950/50">
            <Upload className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            Drop your resume here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted">PDF, DOC, DOCX — Max {MAX_SIZE_MB}MB</p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {file && (
          <div className="mt-4 flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-50 dark:bg-secondary-950/30">
              <FileText className="h-5 w-5 text-secondary-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
            </div>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <button
              onClick={() => setFile(null)}
              className="rounded-lg p-1.5 text-muted hover:bg-muted-bg hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setFile(null)} disabled={!file}>
            Clear
          </Button>
          <Button onClick={handleUpload} disabled={!file} loading={uploading}>
            Analyze Resume
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Tips for Better Results" />
        <ul className="space-y-3">
          {[
            'Use a clean, single-column layout for best ATS parsing',
            'Include relevant keywords from the job description',
            'Avoid images, tables, and complex formatting',
            'Use standard section headings (Experience, Education, Skills)',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-muted">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500" />
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
