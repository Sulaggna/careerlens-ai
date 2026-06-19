import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  MessageSquare,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../ui/Avatar'
import Logo from '../brand/Logo'
import ThemeToggle from '../ui/ThemeToggle'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resume-upload', label: 'Resume Upload', icon: Upload },
  { to: '/ats-result', label: 'ATS Result', icon: BarChart3 },
  { to: '/mock-interview', label: 'Mock Interview', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-[4.5rem] items-center justify-between border-b border-border px-5">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <Logo size={34} showText />
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-muted-bg hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400'
                    : 'text-muted hover:bg-muted-bg hover:text-foreground',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted">Theme</span>
            <ThemeToggle size="sm" />
          </div>
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted-bg p-3">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
