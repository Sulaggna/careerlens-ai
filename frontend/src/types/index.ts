export interface User {
  id: string
  name: string
  email: string
  title?: string
  location?: string
  bio?: string
  avatarUrl?: string
}

export interface ResumeAnalysis {
  id: string
  fileName: string
  uploadedAt: string
  atsScore: number
  status: 'pending' | 'completed' | 'failed'
}

export interface ATSSuggestion {
  category: string
  severity: 'high' | 'medium' | 'low'
  message: string
}

export interface InterviewQuestion {
  id: string
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface DashboardStats {
  totalResumes: number
  averageScore: number
  interviewsCompleted: number
  lastAnalysisDate: string | null
}
