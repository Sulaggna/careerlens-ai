import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Upload,
  AlertTriangle,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { fetchResumes, fetchResumeById, downloadResume, deleteResume } from '../services/resumeService'
import { formatFileSize, formatDate } from '../utils/format'
import type { Resume } from '../types'
import { ApiError } from '../contexts/AuthContext'

export default function ResumeHistory() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const loadResumes = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchResumes()
      setResumes(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load resumes')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResumes()
  }, [])

  const handleViewDetails = async (id: string) => {
    setActionError('')
    try {
      const resume = await fetchResumeById(id)
      setSelectedResume(resume)
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message)
      }
    }
  }

  const handleDownload = async (resume: Resume) => {
    setActionError('')
    try {
      await downloadResume(resume.id, resume.originalFileName)
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message)
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setActionError('')
    try {
      await deleteResume(deleteTarget.id)
      setResumes((prev) => prev.filter((r) => r.id !== deleteTarget.id))
      setDeleteTarget(null)
      if (selectedResume?.id === deleteTarget.id) {
        setSelectedResume(null)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resume History</h2>
          <p className="mt-1 text-muted">View, download, and manage your uploaded resumes.</p>
        </div>
        <Link to="/resume-upload">
          <Button leftIcon={<Upload className="h-4 w-4" />}>Upload Resume</Button>
        </Link>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No resumes uploaded yet"
            description="Upload your first PDF resume to get started with CareerLens AI."
            action={
              <Link to="/resume-upload">
                <Button leftIcon={<Upload className="h-4 w-4" />}>Upload Resume</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 font-medium text-muted">Resume Title</th>
                  <th className="px-6 py-4 font-medium text-muted hidden sm:table-cell">File Name</th>
                  <th className="px-6 py-4 font-medium text-muted hidden md:table-cell">Upload Date</th>
                  <th className="px-6 py-4 font-medium text-muted">Size</th>
                  <th className="px-6 py-4 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.id} className="border-b border-border last:border-0 hover:bg-muted-bg/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/50">
                          <FileText className="h-4 w-4 text-primary-500" />
                        </div>
                        <span className="font-medium text-foreground">{resume.resumeTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted hidden sm:table-cell">{resume.originalFileName}</td>
                    <td className="px-6 py-4 text-muted hidden md:table-cell">{formatDate(resume.uploadDate)}</td>
                    <td className="px-6 py-4 text-muted">{formatFileSize(resume.fileSize)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/ats-result?resumeId=${resume.id}`}
                          className="rounded-lg p-2 text-muted hover:bg-muted-bg hover:text-primary-500"
                          title="Analyze ATS"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleViewDetails(resume.id)}
                          className="rounded-lg p-2 text-muted hover:bg-muted-bg hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(resume)}
                          className="rounded-lg p-2 text-muted hover:bg-muted-bg hover:text-foreground"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(resume)}
                          className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <CardHeader title="Resume Details" />
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted">Title</dt>
                <dd className="font-medium text-foreground">{selectedResume.resumeTitle}</dd>
              </div>
              <div>
                <dt className="text-muted">File Name</dt>
                <dd className="font-medium text-foreground">{selectedResume.originalFileName}</dd>
              </div>
              <div>
                <dt className="text-muted">Upload Date</dt>
                <dd className="font-medium text-foreground">{formatDate(selectedResume.uploadDate)}</dd>
              </div>
              <div>
                <dt className="text-muted">File Size</dt>
                <dd className="font-medium text-foreground">{formatFileSize(selectedResume.fileSize)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedResume(null)}>Close</Button>
              <Link to={`/ats-result?resumeId=${selectedResume.id}`}>
                <Button leftIcon={<Sparkles className="h-4 w-4" />}>Analyze ATS</Button>
              </Link>
              <Button onClick={() => handleDownload(selectedResume)} leftIcon={<Download className="h-4 w-4" />}>
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Delete Resume</h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to delete &quot;{deleteTarget.resumeTitle}&quot;? This will permanently
              remove the file and cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
