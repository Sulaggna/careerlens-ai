import { FileText, MoreHorizontal } from 'lucide-react'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

interface ResumeUpload {
  id: string
  fileName: string
  uploadedAt: string
  fileSize: string
  atsScore: number
  status: 'completed' | 'processing' | 'failed'
}

interface ResumeUploadsTableProps {
  uploads: ResumeUpload[]
}

const statusVariant = {
  completed: 'success' as const,
  processing: 'info' as const,
  failed: 'danger' as const,
}

const statusLabel = {
  completed: 'Completed',
  processing: 'Processing',
  failed: 'Failed',
}

export default function ResumeUploadsTable({ uploads }: ResumeUploadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-4 font-medium text-muted">File Name</th>
            <th className="pb-3 pr-4 font-medium text-muted hidden sm:table-cell">Uploaded</th>
            <th className="pb-3 pr-4 font-medium text-muted hidden md:table-cell">Size</th>
            <th className="pb-3 pr-4 font-medium text-muted">ATS Score</th>
            <th className="pb-3 pr-4 font-medium text-muted">Status</th>
            <th className="pb-3 font-medium text-muted w-10" />
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
                    {upload.fileName}
                  </span>
                </div>
              </td>
              <td className="py-3.5 pr-4 text-muted hidden sm:table-cell">{upload.uploadedAt}</td>
              <td className="py-3.5 pr-4 text-muted hidden md:table-cell">{upload.fileSize}</td>
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-2 min-w-[100px]">
                  <ProgressBar value={upload.atsScore} size="sm" className="flex-1" />
                  <span className="text-xs font-semibold text-foreground w-8">{upload.atsScore}%</span>
                </div>
              </td>
              <td className="py-3.5 pr-4">
                <Badge variant={statusVariant[upload.status]}>{statusLabel[upload.status]}</Badge>
              </td>
              <td className="py-3.5">
                <button className="rounded-lg p-1.5 text-muted hover:bg-muted-bg hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
