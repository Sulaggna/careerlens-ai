import { Menu, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/resume-upload': 'Resume Upload',
  '/resume-history': 'Resume History',
  '/ats-result': 'ATS Result',
  '/mock-interview': 'Mock Interview',
  '/profile': 'Profile',
}

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-muted-bg hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle className="hidden lg:flex" />
        <button className="relative rounded-lg p-2 text-muted hover:bg-muted-bg hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
        </button>
      </div>
    </header>
  )
}
