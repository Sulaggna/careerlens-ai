import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, BarChart3, Trophy, ArrowRight, Users } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import HeroBanner from '../components/dashboard/HeroBanner'
import SectionHeader from '../components/dashboard/SectionHeader'
import QuickActions from '../components/dashboard/QuickActions'
import ATSScoreTrendChart from '../components/dashboard/ATSScoreTrendChart'
import InterviewPerformanceChart from '../components/dashboard/InterviewPerformanceChart'
import RecentAnalysesTable from '../components/dashboard/RecentAnalysesTable'
import { fetchResumes } from '../services/resumeService'
import { fetchATSHistory, fetchATSStats } from '../services/atsService'
import { getInterviewStats } from '../services/interviewService'
import type { Resume } from '../types'
import type { ATSResult, ATSStats } from '../services/atsService'
import type { InterviewStats } from '../services/interviewService'

const interviewData = [
  { label: 'Behavioral', score: 8, maxScore: 10 },
  { label: 'Technical', score: 7, maxScore: 10 },
  { label: 'System Design', score: 6, maxScore: 10 },
  { label: 'Communication', score: 9, maxScore: 10 },
]

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [analyses, setAnalyses] = useState<ATSResult[]>([])
  const [stats, setStats] = useState<ATSStats | null>(null)
  const [interviewStats, setInterviewStats] = useState<InterviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchResumes().catch(() => [] as Resume[]),
      fetchATSHistory().catch(() => [] as ATSResult[]),
      fetchATSStats().catch(() => null),
      getInterviewStats().catch(() => null),
    ])
      .then(([resumeData, historyData, statsData, interviewStatsData]) => {
        setResumes(resumeData)
        setAnalyses(historyData)
        setStats(statsData)
        setInterviewStats(interviewStatsData)
      })
      .finally(() => setLoading(false))
  }, [])

  const trendData = [...analyses]
    .reverse()
    .slice(-6)
    .map((item, index) => ({
      label: `#${index + 1}`,
      value: item.atsScore,
    }))

  const recentAnalyses = analyses.slice(0, 5)

  return (
    <div className="space-y-12">
      <HeroBanner />

      <section>
        <SectionHeader
          title="Overview"
          description="Key metrics from your career analysis activity"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Resumes"
            value={loading ? '—' : resumes.length}
            icon={<FileText className="h-7 w-7" />}
          />
          <StatCard
            title="Average ATS Score"
            value={loading || !stats || stats.totalAnalyses === 0 ? '—' : `${stats.averageScore}%`}
            icon={<BarChart3 className="h-7 w-7" />}
          />
          <StatCard
            title="Total Interviews"
            value={loading || !interviewStats ? '—' : interviewStats.totalInterviews}
            icon={<Users className="h-7 w-7" />}
          />
          <StatCard
            title="Avg Interview Score"
            value={loading || !interviewStats || interviewStats.completedInterviews === 0 ? '—' : `${interviewStats.averageScore}%`}
            icon={<Trophy className="h-7 w-7" />}
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Quick Actions" description="Jump into the tools you need most" />
        <QuickActions />
      </section>

      <section>
        <SectionHeader
          title="Performance Insights"
          description="Track your ATS scores and interview readiness over time"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader title="ATS Score Trend" description="Your recent analysis scores" />
            {trendData.length > 1 ? (
              <ATSScoreTrendChart data={trendData} />
            ) : (
              <div className="py-8 text-center text-sm text-muted">
                Analyze at least two resumes to see a trend chart.
              </div>
            )}
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader title="Interview Performance" description="Scores from your recent mock sessions" />
            <InterviewPerformanceChart data={interviewData} />
          </Card>
        </div>
      </section>

      <section>
        <Card padding="none" className="transition-all duration-300 hover:shadow-md">
          <div className="p-6 pb-0 sm:p-8 sm:pb-0">
            <CardHeader
              title="Recent Analyses"
              description="Your latest ATS analysis results"
              action={
                <Link to="/ats-result">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Analyze resume
                  </Button>
                </Link>
              }
            />
          </div>
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : (
              <RecentAnalysesTable analyses={recentAnalyses} />
            )}
          </div>
        </Card>
      </section>
    </div>
  )
}
