import { type ReactNode } from 'react'
import Logo from '../brand/Logo'
import ThemeToggle from '../ui/ThemeToggle'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between gradient-brand p-12 lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="relative flex items-center justify-between">
          <Logo size={40} variant="white" showText />
          <ThemeToggle className="text-white/80 hover:bg-white/10 hover:text-white" />
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight text-white">
            See your career clearly with AI-powered insights
          </h2>
          <p className="mt-4 text-lg text-white/80">
            CareerLens AI analyzes your resume, optimizes for ATS systems, and prepares you
            for interviews — so you land the role you deserve.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '10K+', label: 'Resumes Analyzed' },
            { value: '85%', label: 'Avg. Score Boost' },
            { value: '5K+', label: 'Interviews Practiced' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo size={36} showText />
            <ThemeToggle />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-muted">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
