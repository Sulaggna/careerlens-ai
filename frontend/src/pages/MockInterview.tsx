import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import { fetchResumes } from '../services/resumeService'
import {
  startInterview,
  getInterviewQuestions,
  submitAnswer,
  completeInterview,
  type InterviewQuestion as APIInterviewQuestion,
  type InterviewFeedback,
} from '../services/interviewService'
import { ApiError } from '../contexts/AuthContext'

const difficultyVariant = {
  easy: 'success' as const,
  medium: 'warning' as const,
  hard: 'danger' as const,
}

export default function MockInterview() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [questions, setQuestions] = useState<APIInterviewQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    fetchResumes()
      .then((data) => setResumes(data))
      .catch(() => setResumes([]))
  }, [])

  const startSession = async () => {
    if (!selectedResumeId || !jobTitle) {
      setError('Please select a resume and enter a job title')
      return
    }

    setLoading(true)
    setError('')
    try {
      const session = await startInterview({
        resumeId: selectedResumeId,
        jobTitle,
        jobDescription,
        questionCount,
      })
      setSessionId(session.id)
      setSessionStarted(true)
      
      const questionsData = await getInterviewQuestions(session.id)
      setQuestions(questionsData)
      setCurrentIndex(0)
      setAnswer('')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to start interview. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const submitCurrentAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const currentQuestion = questions[currentIndex]
      await submitAnswer(sessionId, currentQuestion.id, answer)
      setAnswer('')
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        await completeSession()
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to submit answer. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const completeSession = async () => {
    setLoading(true)
    try {
      const sessionFeedback = await completeInterview(sessionId)
      setFeedback(sessionFeedback)
      setShowSummary(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to complete interview. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const endSession = () => {
    setSessionStarted(false)
    setSessionId('')
    setQuestions([])
    setCurrentIndex(0)
    setAnswer('')
    setFeedback(null)
    setShowSummary(false)
  }

  const currentQuestion = questions[currentIndex]

  if (showSummary && feedback) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Interview Complete!</h2>
          <p className="mt-2 text-muted">Here's your performance summary</p>
        </div>

        <Card>
          <div className="flex flex-col items-center py-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/50">
              <CheckCircle className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="mt-6 text-3xl font-bold text-foreground">{feedback.overallScore}/100</h3>
            <p className="mt-2 text-sm text-muted">Overall Score</p>
          </div>
        </Card>

        {feedback.strengths && (
          <Card>
            <CardHeader title="Strengths" />
            <p className="text-sm text-muted">{feedback.strengths}</p>
          </Card>
        )}

        {feedback.improvements && (
          <Card>
            <CardHeader title="Areas for Improvement" />
            <p className="text-sm text-muted">{feedback.improvements}</p>
          </Card>
        )}

        {feedback.recommendations && (
          <Card>
            <CardHeader title="Recommendations" />
            <p className="text-sm text-muted">{feedback.recommendations}</p>
          </Card>
        )}

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={endSession} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Start New Interview
          </Button>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  if (!sessionStarted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Mock Interview</h2>
          <p className="mt-2 text-muted">
            Practice with AI-generated interview questions tailored to your resume and target role.
          </p>
        </div>

        <Card>
          <CardHeader title="Setup Your Interview" />

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Select Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.resumeTitle || resume.originalFileName}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Target Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here for more relevant questions..."
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px] resize-y"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Number of Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={5}>5 Questions (~15 min)</option>
                <option value={10}>10 Questions (~30 min)</option>
                <option value={15}>15 Questions (~45 min)</option>
                <option value={20}>20 Questions (~60 min)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button
              className="w-full"
              size="lg"
              onClick={startSession}
              loading={loading}
              leftIcon={<Sparkles className="h-5 w-5" />}
            >
              Start Interview
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Interview Tips" />
          <ul className="space-y-2 text-sm text-muted">
            <li>• Use the STAR method for behavioral questions (Situation, Task, Action, Result)</li>
            <li>• Take a moment to think before answering — pauses are natural</li>
            <li>• Be specific with examples from your own experience</li>
            <li>• Ask clarifying questions if the question is ambiguous</li>
          </ul>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mock Interview</h2>
          <p className="mt-1 text-sm text-muted">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Clock className="h-4 w-4" />
          <span>{jobTitle}</span>
        </div>
      </div>

      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? 'bg-primary-500' : 'bg-muted-bg'
            }`}
          />
        ))}
      </div>

      <Card>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center gap-2">
          <Badge variant="info">{currentQuestion.category}</Badge>
          <Badge variant={difficultyVariant[currentQuestion.difficulty as keyof typeof difficultyVariant]}>
            {currentQuestion.difficulty}
          </Badge>
        </div>

        <p className="text-lg font-medium leading-relaxed text-foreground">
          {currentQuestion.questionText}
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[160px] resize-y"
          />
        </div>

        {currentQuestion.answer && currentQuestion.answer.feedback && (
          <div className="mt-4 rounded-lg bg-primary-50 p-4 dark:bg-primary-950/30">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-400">Previous Feedback:</p>
            <p className="mt-1 text-sm text-muted">{currentQuestion.answer.feedback}</p>
            <p className="mt-2 text-sm font-medium text-primary-700 dark:text-primary-400">Score: {currentQuestion.answer.score}/100</p>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1))
            setAnswer('')
          }}
          disabled={currentIndex === 0}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={endSession}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            End Session
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={submitCurrentAnswer}
              loading={submitting}
              rightIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
            >
              Submit & Next
            </Button>
          ) : (
            <Button
              onClick={submitCurrentAnswer}
              loading={submitting}
              rightIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            >
              Complete Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
