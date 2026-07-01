import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { formatDate } from '../../utils/format'
import type { ATSResult } from '../../services/atsService'

interface RecentAnalysesTableProps {
  analyses: ATSResult[]
}

export default function RecentAnalysesTable({ analyses }: RecentAnalysesTableProps) {
  if (analyses.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        No analyses yet.{' '}
        <Link to="/ats-result" className="font-medium text-primary-500 hover:text-primary-600">
          Analyze a resume
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-4 font-medium text-muted">Resume</th>
            <th className="pb-3 pr-4 font-medium text-muted hidden sm:table-cell">Analyzed</th>
            <th className="pb-3 pr-4 font-medium text-muted">ATS Score</th>
            <th className="pb-3 pr-4 font-medium text-muted">Status</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((analysis) => (
            <tr
              key={analysis.id}
              className="border-b border-border last:border-0 transition-colors hover:bg-muted-bg/50"
            >
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/50">
                    <FileText className="h-4 w-4 text-primary-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {analysis.resumeTitle || analysis.originalFileName}
                    </p>
                    {analysis.originalFileName && analysis.resumeTitle && (
                      <p className="truncate text-xs text-muted">{analysis.originalFileName}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-4 text-muted hidden sm:table-cell">
                {formatDate(analysis.analysisDate)}
              </td>
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-2 min-w-[100px]">
                  <ProgressBar value={analysis.atsScore} size="sm" className="flex-1" />
                  <span className="text-xs font-semibold text-foreground w-8">{analysis.atsScore}%</span>
                </div>
              </td>
              <td className="py-3.5 pr-4">
                <Badge variant={analysis.atsScore >= 80 ? 'success' : analysis.atsScore >= 60 ? 'warning' : 'danger'}>
                  {analysis.atsScore >= 80 ? 'Strong' : analysis.atsScore >= 60 ? 'Good' : 'Needs Work'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
