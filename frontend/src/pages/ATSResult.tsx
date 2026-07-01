import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Target,
  Briefcase,
  GraduationCap,
  Mail,
  Layout,
  Wrench,
  Sparkles,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import { fetchResumes } from '../services/resumeService'
import { analyzeResume, fetchATSResult, fetchATSHistory } from '../services/atsService'
import { formatDate } from '../utils/format'
import type { Resume } from '../types'
import type { ATSResult } from '../services/atsService'
import { ApiError } from '../contexts/AuthContext'

const scoreBreakdownMeta = [
  { key: 'keywordsScore' as const, label: 'Keywords Match', weight: '30%', icon: Target },
  { key: 'skillsScore' as const, label: 'Skills Match', weight: '25%', icon: Wrench },
  { key: 'experienceScore' as const, label: 'Experience Section', weight: '15%', icon: Briefcase },
  { key: 'educationScore' as const, label: 'Education Section', weight: '10%', icon: GraduationCap },
  { key: 'contactScore' as const, label: 'Contact Information', weight: '10%', icon: Mail },
  { key: 'formattingScore' as const, label: 'Formatting Quality', weight: '10%', icon: Layout },
]

function getScoreColor(score: number): string {
  if (score >= 80) return '#14B8A6'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong Match'
  if (score >= 60) return 'Good Match'
  return 'Needs Work'
}

export default function ATSResultPage() {
  const [searchParams] = useSearchParams()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [result, setResult] = useState<ATSResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const resumeIdParam = searchParams.get('resumeId')
    fetchResumes()
      .then((data) => {
        setResumes(data)
        const initialId = resumeIdParam || data[0]?.id || ''
        setSelectedResumeId(initialId)
        if (initialId) {
          return fetchATSResult(initialId).catch(() => null)
        }
        return null
      })
      .then((existing) => setResult(existing))
      .catch(() => setError('Failed to load resumes'))
      .finally(() => setLoading(false))
  }, [searchParams])

  const handleResumeChange = async (resumeId: string) => {
    setSelectedResumeId(resumeId)
    setResult(null)
    setError('')
    if (!resumeId) return

    try {
      const existing = await fetchATSResult(resumeId)
      setResult(existing)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setResult(null)
      } else if (err instanceof ApiError) {
        setError(err.message)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!selectedResumeId) return
    setAnalyzing(true)
    setError('')
    try {
      const analysis = await analyzeResume(selectedResumeId)
      setResult(analysis)
      await fetchATSHistory()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Analysis failed. Please try again.')
      }
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ATS Analysis Results</h2>
          <p className="mt-1 text-muted">
            Analyze your uploaded PDF resume and get an ATS compatibility score with actionable insights.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedResumeId}
            onChange={(e) => handleResumeChange(e.target.value)}
            className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={resumes.length === 0 || analyzing}
          >
            {resumes.length === 0 ? (
              <option value="">No resumes uploaded</option>
            ) : (
              resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.resumeTitle || resume.originalFileName}
                </option>
              ))
            )}
          </select>
          <Button
            onClick={handleAnalyze}
            disabled={!selectedResumeId || analyzing}
            loading={analyzing}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            {result ? 'Re-analyze' : 'Analyze Resume'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!result && !analyzing && (
        <Card>
          <div className="py-12 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-primary-500" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No analysis yet</h3>
            <p className="mt-2 text-sm text-muted">
              Select a resume and click Analyze to generate your ATS score and recommendations.
            </p>
          </div>
        </Card>
      )}

      {result && (
        <>
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
                      stroke={getScoreColor(result.atsScore)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${result.atsScore * 2.64} ${100 * 2.64}`}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-5xl font-bold text-foreground">{result.atsScore}</p>
                    <p className="text-sm text-muted">out of 100</p>
                  </div>
                </div>
                <Badge
                  variant={result.atsScore >= 80 ? 'success' : result.atsScore >= 60 ? 'warning' : 'danger'}
                  className="mt-4"
                >
                  {getScoreLabel(result.atsScore)}
                </Badge>
                <p className="mt-4 text-center text-sm text-muted">
                  Analysis for{' '}
                  <span className="font-medium text-foreground">
                    {result.resumeTitle || result.originalFileName}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted">Analyzed on {formatDate(result.analysisDate)}</p>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader title="Score Breakdown" description="Weighted performance across ATS criteria" />
              <div className="space-y-5">
                {scoreBreakdownMeta.map((item) => {
                  const score = result[item.key]
                  return (
                    <div key={item.key} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-bg">
                        <item.icon className="h-5 w-5 text-muted" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {item.label}{' '}
                            <span className="text-xs text-muted">({item.weight})</span>
                          </span>
                          <span className="text-sm font-semibold text-foreground">{score}%</span>
                        </div>
                        <ProgressBar value={score} size="sm" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Missing Keywords" description="Industry keywords not found in your resume" />
              {result.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="warning">{keyword}</Badge>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" /> Strong keyword coverage detected.
                </p>
              )}
            </Card>

            <Card>
              <CardHeader title="Missing Skills" description="Technical skills to consider adding" />
              {result.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill) => (
                    <Badge key={skill} variant="info">{skill}</Badge>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" /> Good skills coverage detected.
                </p>
              )}
            </Card>
          </div>

          {result.missingSections.length > 0 && (
            <Card>
              <CardHeader title="Missing Sections" description="Resume sections that were not detected" />
              <div className="flex flex-wrap gap-2">
                {result.missingSections.map((section) => (
                  <Badge key={section} variant="danger">{section}</Badge>
                ))}
              </div>
            </Card>
          )}

          {result.weakKeywords.length > 0 && (
            <Card>
              <CardHeader title="Weak Keywords" description="Phrases that may reduce ATS impact" />
              <div className="flex flex-wrap gap-2">
                {result.weakKeywords.map((keyword) => (
                  <Badge key={keyword} variant="warning">{keyword}</Badge>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader
              title="Recommendations"
              description="Actionable suggestions to improve your ATS score"
            />
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <p className="text-sm text-muted">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
