import { apiRequest, type ApiResponse } from './api'

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
  difficulty: string
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

export interface StartInterviewPayload {
  resumeId: string
  jobTitle: string
  jobDescription?: string
  questionCount: number
}

function mapSession(raw: {
  id: number
  userId: number
  resumeId: number
  jobTitle: string
  jobDescription: string | null
  questionCount: number
  status: string
  createdAt: string
  completedAt: string | null
}): InterviewSession {
  return {
    id: String(raw.id),
    userId: String(raw.userId),
    resumeId: String(raw.resumeId),
    jobTitle: raw.jobTitle,
    jobDescription: raw.jobDescription,
    questionCount: raw.questionCount,
    status: raw.status,
    createdAt: raw.createdAt,
    completedAt: raw.completedAt,
  }
}

function mapQuestion(raw: {
  id: number
  sessionId: number
  questionText: string
  category: string
  difficulty: string
  orderIndex: number
  answer?: {
    id: number
    questionId: number
    answerText: string
    audioFilePath: string | null
    feedback: string
    score: number
    answeredAt: string
  } | null
}): InterviewQuestion {
  return {
    id: String(raw.id),
    sessionId: String(raw.sessionId),
    questionText: raw.questionText,
    category: raw.category,
    difficulty: raw.difficulty,
    orderIndex: raw.orderIndex,
    answer: raw.answer ? mapAnswer(raw.answer) : null,
  }
}

function mapAnswer(raw: {
  id: number
  questionId: number
  answerText: string
  audioFilePath: string | null
  feedback: string
  score: number
  answeredAt: string
}): InterviewAnswer {
  return {
    id: String(raw.id),
    questionId: String(raw.questionId),
    answerText: raw.answerText,
    audioFilePath: raw.audioFilePath,
    feedback: raw.feedback,
    score: raw.score,
    answeredAt: raw.answeredAt,
  }
}

function mapFeedback(raw: {
  id: number
  sessionId: number
  overallScore: number
  strengths: string
  improvements: string
  recommendations: string
}): InterviewFeedback {
  return {
    id: String(raw.id),
    sessionId: String(raw.sessionId),
    overallScore: raw.overallScore,
    strengths: raw.strengths,
    improvements: raw.improvements,
    recommendations: raw.recommendations,
  }
}

function mapHistory(raw: {
  id: number
  resumeId: number
  jobTitle: string
  questionCount: number
  status: string
  overallScore: number | null
  createdAt: string
  completedAt: string | null
}): InterviewHistory {
  return {
    id: String(raw.id),
    resumeId: String(raw.resumeId),
    jobTitle: raw.jobTitle,
    questionCount: raw.questionCount,
    status: raw.status,
    overallScore: raw.overallScore,
    createdAt: raw.createdAt,
    completedAt: raw.completedAt,
  }
}

export async function startInterview(payload: StartInterviewPayload): Promise<InterviewSession> {
  const response = await apiRequest<ApiResponse<{
    id: number
    userId: number
    resumeId: number
    jobTitle: string
    jobDescription: string | null
    questionCount: number
    status: string
    createdAt: string
    completedAt: string | null
  }>>('/api/interviews/start', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapSession(response.data)
}

export async function getInterviewSession(sessionId: string): Promise<InterviewSession> {
  const response = await apiRequest<ApiResponse<{
    id: number
    userId: number
    resumeId: number
    jobTitle: string
    jobDescription: string | null
    questionCount: number
    status: string
    createdAt: string
    completedAt: string | null
  }>>(`/api/interviews/${sessionId}`)
  return mapSession(response.data)
}

export async function getInterviewQuestions(sessionId: string): Promise<InterviewQuestion[]> {
  const response = await apiRequest<ApiResponse<{
    id: number
    sessionId: number
    questionText: string
    category: string
    difficulty: string
    orderIndex: number
    answer?: {
      id: number
      questionId: number
      answerText: string
      audioFilePath: string | null
      feedback: string
      score: number
      answeredAt: string
    } | null
  }[]>>(`/api/interviews/${sessionId}/questions`)
  return response.data.map(mapQuestion)
}

export async function submitAnswer(sessionId: string, questionId: string, answerText: string): Promise<InterviewAnswer> {
  const response = await apiRequest<ApiResponse<{
    id: number
    questionId: number
    answerText: string
    audioFilePath: string | null
    feedback: string
    score: number
    answeredAt: string
  }>>(`/api/interviews/${sessionId}/answers/${questionId}`, {
    method: 'POST',
    body: JSON.stringify({ answerText }),
  })
  return mapAnswer(response.data)
}

export async function completeInterview(sessionId: string): Promise<InterviewFeedback> {
  const response = await apiRequest<ApiResponse<{
    id: number
    sessionId: number
    overallScore: number
    strengths: string
    improvements: string
    recommendations: string
  }>>(`/api/interviews/${sessionId}/complete`, {
    method: 'POST',
  })
  return mapFeedback(response.data)
}

export async function getInterviewHistory(): Promise<InterviewHistory[]> {
  const response = await apiRequest<ApiResponse<{
    id: number
    resumeId: number
    jobTitle: string
    questionCount: number
    status: string
    overallScore: number | null
    createdAt: string
    completedAt: string | null
  }[]>>('/api/interviews/history')
  return response.data.map(mapHistory)
}

export async function getInterviewStats(): Promise<InterviewStats> {
  const response = await apiRequest<ApiResponse<InterviewStats>>('/api/interviews/stats')
  return response.data
}
