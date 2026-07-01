import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatFileSize, formatRelativeTime } from '../../utils/format'
import type { Resume } from '../../types'

interface ResumeUploadsTableProps {
  uploads: Resume[]
}

export default function ResumeUploadsTable({ uploads }: ResumeUploadsTableProps) {
  if (uploads.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        No resumes uploaded yet.{' '}
        <Link to="/resume-upload" className="font-medium text-primary-500 hover:text-primary-600">
          Upload your first resume
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-4 font-medium text-muted">Resume Title</th>
            <th className="pb-3 pr-4 font-medium text-muted hidden sm:table-cell">File Name</th>
            <th className="pb-3 pr-4 font-medium text-muted hidden md:table-cell">Uploaded</th>
            <th className="pb-3 pr-4 font-medium text-muted">Size</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr
              key={upload.id}
              className="border-b border-border last:border-0 transition-colors hover:bg-muted-bg/50"
            >
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/50">
                    <FileText className="h-4 w-4 text-primary-500" />
                  </div>
                  <span className="truncate font-medium text-foreground max-w-[160px] sm:max-w-none">
                    {upload.resumeTitle}
                  </span>
                </div>
              </td>
              <td className="py-3.5 pr-4 text-muted hidden sm:table-cell">{upload.originalFileName}</td>
              <td className="py-3.5 pr-4 text-muted hidden md:table-cell">
                {formatRelativeTime(upload.uploadDate)}
              </td>
              <td className="py-3.5 pr-4 text-muted">{formatFileSize(upload.fileSize)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
