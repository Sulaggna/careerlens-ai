import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Target,
  Type,
  Layout,
  Download,
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import type { ATSSuggestion } from '../types'

const scoreBreakdown = [
  { category: 'Keywords Match', score: 85, icon: Target },
  { category: 'Formatting', score: 90, icon: Layout },
  { category: 'Content Quality', score: 78, icon: Type },
  { category: 'Section Structure', score: 82, icon: FileText },
]

const suggestions: ATSSuggestion[] = [
  {
    category: 'Keywords',
    severity: 'high',
    message: 'Add more industry-specific keywords like "React", "TypeScript", and "CI/CD"',
  },
  {
    category: 'Experience',
    severity: 'medium',
    message: 'Quantify achievements with metrics (e.g., "Increased performance by 40%")',
  },
  {
    category: 'Formatting',
    severity: 'low',
    message: 'Consider using bullet points consistently across all experience entries',
  },
  {
    category: 'Skills',
    severity: 'medium',
    message: 'Group technical skills by category (Languages, Frameworks, Tools)',
  },
  {
    category: 'Contact',
    severity: 'low',
    message: 'Add a LinkedIn profile URL to improve professional visibility',
  },
]

const severityConfig = {
  high: { icon: XCircle, variant: 'danger' as const, label: 'High Priority' },
  medium: { icon: AlertTriangle, variant: 'warning' as const, label: 'Medium Priority' },
  low: { icon: CheckCircle, variant: 'success' as const, label: 'Low Priority' },
}

export default function ATSResult() {
  const overallScore = 82

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ATS Analysis Results</h2>
          <p className="mt-1 text-muted">
            Analysis for <span className="font-medium text-foreground">Alex_Johnson_Resume.pdf</span>
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Download Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center py-4">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" className="stroke-border" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={overallScore >= 80 ? '#14B8A6' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallScore * 2.64} ${100 * 2.64}`}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-5xl font-bold text-foreground">{overallScore}</p>
                <p className="text-sm text-muted">out of 100</p>
              </div>
            </div>
            <Badge variant={overallScore >= 80 ? 'success' : 'warning'} className="mt-4">
              {overallScore >= 80 ? 'Strong Match' : overallScore >= 60 ? 'Good Match' : 'Needs Work'}
            </Badge>
            <p className="mt-4 text-center text-sm text-muted">
              Your resume has a good chance of passing ATS filters. Address the suggestions below to
              improve further.
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Score Breakdown" description="Performance across key ATS criteria" />
          <div className="space-y-5">
            {scoreBreakdown.map((item) => (
              <div key={item.category} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-bg">
                  <item.icon className="h-5 w-5 text-muted" />
                </div>
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                    <span className="text-sm font-semibold text-foreground">{item.score}%</span>
                  </div>
                  <ProgressBar value={item.score} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Improvement Suggestions"
          description="Actionable recommendations to boost your ATS score"
        />
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const config = severityConfig[suggestion.severity]
            const Icon = config.icon
            return (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted-bg/50"
              >
                <div className="mt-0.5">
                  <Icon
                    className={`h-5 w-5 ${
                      suggestion.severity === 'high'
                        ? 'text-red-500'
                        : suggestion.severity === 'medium'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{suggestion.category}</span>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{suggestion.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Words Parsed', value: '487' },
          { label: 'Sections Found', value: '6' },
          { label: 'Keywords Matched', value: '24/32' },
        ].map((stat) => (
          <Card key={stat.label} padding="sm" className="text-center">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
