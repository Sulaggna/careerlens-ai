import { useState, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { cn } from '../utils/cn'
import { formatFileSize } from '../utils/format'
import { uploadResume } from '../services/resumeService'
import { ApiError } from '../contexts/AuthContext'

const MAX_SIZE_MB = 10

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [resumeTitle, setResumeTitle] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const validateFile = (selected: File): string | null => {
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are allowed'
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_SIZE_MB}MB`
    }
    return null
  }

  const handleFile = useCallback((selected: File) => {
    const validationError = validateFile(selected)
    if (validationError) {
      setError(validationError)
      setFile(null)
      return
    }
    setError('')
    setSuccess('')
    setFile(selected)
    if (!resumeTitle) {
      const name = selected.name.replace(/\.pdf$/i, '')
      setResumeTitle(name)
    }
  }, [resumeTitle])

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile],
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError('')
    setSuccess('')

    try {
      await uploadResume(file, resumeTitle, setProgress)
      setSuccess('Resume uploaded successfully!')
      setFile(null)
      setResumeTitle('')
      setProgress(100)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Upload failed. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Your Resume</h2>
        <p className="mt-1 text-muted">
          Upload a PDF resume to store it securely and prepare for ATS analysis with CareerLens AI.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Select PDF File"
          description={`Drag and drop or click to browse. PDF only, up to ${MAX_SIZE_MB}MB.`}
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
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={uploading}
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-950/50">
            <Upload className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            Drop your PDF resume here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted">PDF only — Max {MAX_SIZE_MB}MB</p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {file && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
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
                disabled={uploading}
                className="rounded-lg p-1.5 text-muted hover:bg-muted-bg hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Input
              label="Resume Title"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="e.g. Software Engineer Resume"
              hint="Optional — defaults to file name"
            />
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">Uploading...</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted-bg">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setFile(null); setResumeTitle('') }} disabled={!file || uploading}>
            Clear
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading} loading={uploading}>
            Upload Resume
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
        <div className="mt-4">
          <Link to="/resume-history" className="text-sm font-medium text-primary-500 hover:text-primary-600">
            View your uploaded resumes →
          </Link>
        </div>
      </Card>
    </div>
  )
}
