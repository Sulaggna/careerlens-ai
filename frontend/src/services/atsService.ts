import { apiRequest, type ApiResponse } from './api'

export interface ATSResult {
  id: string
  resumeId: string
  userId: string
  resumeTitle: string | null
  originalFileName: string | null
  atsScore: number
  keywordsScore: number
  skillsScore: number
  experienceScore: number
  educationScore: number
  contactScore: number
  formattingScore: number
  missingKeywords: string[]
  missingSkills: string[]
  missingSections: string[]
  weakKeywords: string[]
  recommendations: string[]
  analysisDate: string
}

export interface ATSStats {
  totalAnalyses: number
  averageScore: number
  bestScore: number
}

function mapResult(raw: {
  id: number
  resumeId: number
  userId: number
  resumeTitle?: string | null
  originalFileName?: string | null
  atsScore: number
  keywordsScore: number
  skillsScore: number
  experienceScore: number
  educationScore: number
  contactScore: number
  formattingScore: number
  missingKeywords?: string[]
  missingSkills?: string[]
  missingSections?: string[]
  weakKeywords?: string[]
  recommendations?: string[]
  analysisDate: string
}): ATSResult {
  return {
    id: String(raw.id),
    resumeId: String(raw.resumeId),
    userId: String(raw.userId),
    resumeTitle: raw.resumeTitle ?? null,
    originalFileName: raw.originalFileName ?? null,
    atsScore: raw.atsScore,
    keywordsScore: raw.keywordsScore,
    skillsScore: raw.skillsScore,
    experienceScore: raw.experienceScore,
    educationScore: raw.educationScore,
    contactScore: raw.contactScore,
    formattingScore: raw.formattingScore,
    missingKeywords: raw.missingKeywords ?? [],
    missingSkills: raw.missingSkills ?? [],
    missingSections: raw.missingSections ?? [],
    weakKeywords: raw.weakKeywords ?? [],
    recommendations: raw.recommendations ?? [],
    analysisDate: raw.analysisDate,
  }
}

export async function analyzeResume(resumeId: string): Promise<ATSResult> {
  const response = await apiRequest<ApiResponse<Parameters<typeof mapResult>[0]>>(
    `/api/ats/analyze/${resumeId}`,
    { method: 'POST' },
  )
  return mapResult(response.data)
}

export async function fetchATSResult(resumeId: string): Promise<ATSResult> {
  const response = await apiRequest<ApiResponse<Parameters<typeof mapResult>[0]>>(
    `/api/ats/result/${resumeId}`,
  )
  return mapResult(response.data)
}

export async function fetchATSHistory(): Promise<ATSResult[]> {
  const response = await apiRequest<ApiResponse<Parameters<typeof mapResult>[0][]>>(
    '/api/ats/history',
  )
  return response.data.map(mapResult)
}

export async function fetchATSStats(): Promise<ATSStats> {
  const response = await apiRequest<ApiResponse<ATSStats>>('/api/ats/stats')
  return response.data
}
