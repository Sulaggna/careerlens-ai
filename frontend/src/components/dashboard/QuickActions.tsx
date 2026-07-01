import { Link } from 'react-router-dom'
import { Upload, BarChart3, MessageSquare, User, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import { cn } from '../../utils/cn'

const actions = [
  {
    title: 'Upload Resume',
    description: 'Analyze a new resume with AI-powered ATS scoring',
    icon: Upload,
    to: '/resume-upload',
    bg: 'bg-primary-50 dark:bg-primary-950/30',
    iconColor: 'text-primary-500',
  },
  {
    title: 'View ATS Results',
    description: 'Review scores, breakdowns, and improvement tips',
    icon: BarChart3,
    to: '/ats-result',
    bg: 'bg-secondary-50 dark:bg-secondary-950/30',
    iconColor: 'text-secondary-500',
  },
  {
    title: 'Resume History',
    description: 'View and manage your uploaded resumes',
    icon: Upload,
    to: '/resume-history',
    bg: 'bg-secondary-50 dark:bg-secondary-950/30',
    iconColor: 'text-secondary-500',
  },
  {
    title: 'Mock Interview',
    description: 'Practice with AI-generated interview questions',
    icon: MessageSquare,
    to: '/mock-interview',
    bg: 'bg-primary-50 dark:bg-primary-950/30',
    iconColor: 'text-primary-400',
  },
  {
    title: 'Edit Profile',
    description: 'Update your personal info and career preferences',
    icon: User,
    to: '/profile',
    bg: 'bg-secondary-50 dark:bg-secondary-950/30',
    iconColor: 'text-secondary-500',
  },
]

export default function QuickActions() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {actions.map((action) => (
        <Link key={action.to} to={action.to}>
          <Card
            className={cn(
              'group h-full transition-all duration-300 ease-out',
              'hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5',
              'dark:hover:border-primary-700',
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                  action.bg,
                )}
              >
                <action.icon className={cn('h-6 w-6', action.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground transition-colors duration-300 group-hover:text-primary-500">
                  {action.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{action.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-500" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
