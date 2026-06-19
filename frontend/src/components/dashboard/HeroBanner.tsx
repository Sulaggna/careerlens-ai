import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'

export default function HeroBanner() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient base */}
      <div className="absolute inset-0 gradient-brand" />

      {/* Dot pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

      {/* Decorative orbs */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-secondary-400/20 blur-3xl" />

      {/* Glass panel content */}
      <div className="relative m-1 rounded-[14px] border border-white/20 bg-white/10 p-6 shadow-xl shadow-primary-900/10 backdrop-blur-md sm:m-1.5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Career Platform
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back, {firstName}!
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Your career insights are ready. Upload a resume, check your ATS score, or practice
              for your next interview — all powered by CareerLens AI.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <Link to="/resume-upload" className="transition-transform duration-300 hover:scale-[1.02]">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Upload Resume
              </Button>
            </Link>
            <Link to="/mock-interview" className="transition-transform duration-300 hover:scale-[1.02]">
              <Button variant="secondary">Start Mock Interview</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
