import { API_BASE_URL, ApiError, type ApiResponse } from './api'
import type { Resume } from '../types'

function mapResume(raw: {
  id: number
  userId: number
  fileName: string
  originalFileName: string
  fileSize: number
  uploadDate: string
  resumeTitle: string
}): Resume {
  return {
    id: String(raw.id),
    userId: String(raw.userId),
    fileName: raw.fileName,
    originalFileName: raw.originalFileName,
    fileSize: raw.fileSize,
    uploadDate: raw.uploadDate,
    resumeTitle: raw.resumeTitle,
  }
}

export async function fetchResumes(): Promise<Resume[]> {
  const response = await fetch(`${API_BASE_URL}/api/resumes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const body = await response.json()

  if (!response.ok) {
    throw new ApiError(body.message || 'Failed to fetch resumes', response.status)
  }

  return (body as ApiResponse<Array<Parameters<typeof mapResume>[0]>>).data.map(mapResume)
}

export async function fetchResumeById(id: string): Promise<Resume> {
  const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const body = await response.json()

  if (!response.ok) {
    throw new ApiError(body.message || 'Failed to fetch resume', response.status)
  }

  return mapResume((body as ApiResponse<Parameters<typeof mapResume>[0]>).data)
}

export function uploadResume(
  file: File,
  resumeTitle?: string,
  onProgress?: (percent: number) => void,
): Promise<Resume> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    if (resumeTitle?.trim()) {
      formData.append('resumeTitle', resumeTitle.trim())
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      try {
        const body = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(mapResume(body.data))
        } else {
          reject(new ApiError(body.message || 'Upload failed', xhr.status))
        }
      } catch {
        reject(new ApiError('Upload failed', xhr.status))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new ApiError('Network error during upload', 0))
    })

    xhr.open('POST', `${API_BASE_URL}/api/resumes/upload`)
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`)
    xhr.send(formData)
  })
}

export async function downloadResume(id: string, fileName: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/resumes/download/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(body?.message || 'Download failed', response.status)
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function deleteResume(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(body?.message || 'Delete failed', response.status)
  }
}
