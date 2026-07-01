export interface User {
  id: string
  name: string
  email: string
  title?: string
  location?: string
  bio?: string
  avatarUrl?: string
}

export interface Resume {
  id: string
  userId: string
  fileName: string
  originalFileName: string
  fileSize: number
  uploadDate: string
  resumeTitle: string
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

export interface InterviewSession {
  id: string
  userId: string
  resumeId: string
  jobTitle: string
  jobDescription: string | null
  questionCount: number
  status: string
  createdAt: string
  completedAt: string | null
}

export interface InterviewQuestion {
  id: string
  sessionId: string
  questionText: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  orderIndex: number
  answer: InterviewAnswer | null
}

export interface InterviewAnswer {
  id: string
  questionId: string
  answerText: string
  audioFilePath: string | null
  feedback: string
  score: number
  answeredAt: string
}

export interface InterviewFeedback {
  id: string
  sessionId: string
  overallScore: number
  strengths: string
  improvements: string
  recommendations: string
}

export interface InterviewHistory {
  id: string
  resumeId: string
  jobTitle: string
  questionCount: number
  status: string
  overallScore: number | null
  createdAt: string
  completedAt: string | null
}

export interface InterviewStats {
  totalInterviews: number
  averageScore: number
  bestScore: number
  completedInterviews: number
}
