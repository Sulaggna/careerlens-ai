import { Link } from 'react-router-dom'
import { FileText, BarChart3, MessageSquare, Clock, ArrowRight } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import HeroBanner from '../components/dashboard/HeroBanner'
import SectionHeader from '../components/dashboard/SectionHeader'
import QuickActions from '../components/dashboard/QuickActions'
import ATSScoreTrendChart from '../components/dashboard/ATSScoreTrendChart'
import InterviewPerformanceChart from '../components/dashboard/InterviewPerformanceChart'
import ResumeUploadsTable from '../components/dashboard/ResumeUploadsTable'

const atsTrendData = [
  { label: 'Jan', value: 62 },
  { label: 'Feb', value: 68 },
  { label: 'Mar', value: 71 },
  { label: 'Apr', value: 76 },
  { label: 'May', value: 79 },
  { label: 'Jun', value: 82 },
]

const interviewData = [
  { label: 'Behavioral', score: 8, maxScore: 10 },
  { label: 'Technical', score: 7, maxScore: 10 },
  { label: 'System Design', score: 6, maxScore: 10 },
  { label: 'Communication', score: 9, maxScore: 10 },
]

const recentUploads = [
  {
    id: '1',
    fileName: 'Alex_Johnson_Resume.pdf',
    uploadedAt: '2 hours ago',
    fileSize: '245 KB',
    atsScore: 82,
    status: 'completed' as const,
  },
  {
    id: '2',
    fileName: 'Alex_Johnson_Resume_v2.pdf',
    uploadedAt: '1 day ago',
    fileSize: '312 KB',
    atsScore: 76,
    status: 'completed' as const,
  },
  {
    id: '3',
    fileName: 'Cover_Letter.docx',
    uploadedAt: '3 days ago',
    fileSize: '128 KB',
    atsScore: 68,
    status: 'completed' as const,
  },
  {
    id: '4',
    fileName: 'Senior_Engineer_CV.pdf',
    uploadedAt: '5 days ago',
    fileSize: '198 KB',
    atsScore: 0,
    status: 'processing' as const,
  },
]

export default function Dashboard() {
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
            value={4}
            icon={<FileText className="h-7 w-7" />}
            trend={{ value: 12, label: 'this month' }}
          />
          <StatCard
            title="Average ATS Score"
            value="75%"
            icon={<BarChart3 className="h-7 w-7" />}
            trend={{ value: 8, label: 'improvement' }}
          />
          <StatCard
            title="Interviews Completed"
            value={5}
            icon={<MessageSquare className="h-7 w-7" />}
            trend={{ value: 0, label: 'this week' }}
          />
          <StatCard
            title="Last Analysis"
            value="2h ago"
            icon={<Clock className="h-7 w-7" />}
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Quick Actions"
          description="Jump into the tools you need most"
        />
        <QuickActions />
      </section>

      <section>
        <SectionHeader
          title="Performance Insights"
          description="Track your ATS scores and interview readiness over time"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader
              title="ATS Score Trend"
              description="Your resume compatibility over time"
            />
            <ATSScoreTrendChart data={atsTrendData} />
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader
              title="Interview Performance"
              description="Scores from your recent mock sessions"
            />
            <InterviewPerformanceChart data={interviewData} />
          </Card>
        </div>
      </section>

      <section>
        <Card padding="none" className="transition-all duration-300 hover:shadow-md">
          <div className="p-6 pb-0 sm:p-8 sm:pb-0">
            <CardHeader
              title="Recent Resume Uploads"
              description="Track your uploaded resumes and ATS scores"
              action={
                <Link to="/ats-result">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View all
                  </Button>
                </Link>
              }
            />
          </div>
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <ResumeUploadsTable uploads={recentUploads} />
          </div>
        </Card>
      </section>
    </div>
  )
}
