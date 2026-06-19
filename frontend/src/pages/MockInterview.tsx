import { useState } from 'react'
import {
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Clock,
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import type { InterviewQuestion } from '../types'

const questions: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself and your experience as a software engineer.',
    category: 'Behavioral',
    difficulty: 'easy',
  },
  {
    id: '2',
    question: 'Describe a challenging technical problem you solved recently.',
    category: 'Technical',
    difficulty: 'medium',
  },
  {
    id: '3',
    question: 'How do you approach system design for a scalable web application?',
    category: 'System Design',
    difficulty: 'hard',
  },
  {
    id: '4',
    question: 'Explain the difference between REST and GraphQL APIs.',
    category: 'Technical',
    difficulty: 'medium',
  },
  {
    id: '5',
    question: 'Where do you see yourself in 5 years?',
    category: 'Behavioral',
    difficulty: 'easy',
  },
]

const difficultyVariant = {
  easy: 'success' as const,
  medium: 'warning' as const,
  hard: 'danger' as const,
}

export default function MockInterview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [answer, setAnswer] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [timer] = useState(0)

  const currentQuestion = questions[currentIndex]

  const startSession = () => {
    setSessionStarted(true)
    setCurrentIndex(0)
    setAnswer('')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setAnswer('')
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setAnswer('')
    }
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
          <div className="flex flex-col items-center py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/50">
              <MessageSquare className="h-10 w-10 text-primary-500" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Ready to practice?</h3>
            <p className="mt-2 max-w-md text-center text-sm text-muted">
              This session includes {questions.length} questions covering behavioral, technical, and
              system design topics. Take your time and answer thoughtfully.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['Behavioral', 'Technical', 'System Design'].map((cat) => (
                <Badge key={cat} variant="info">
                  {cat}
                </Badge>
              ))}
            </div>

            <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-muted-bg p-4">
                <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                <p className="text-xs text-muted">Questions</p>
              </div>
              <div className="rounded-lg bg-muted-bg p-4">
                <p className="text-2xl font-bold text-foreground">~30</p>
                <p className="text-xs text-muted">Minutes</p>
              </div>
            </div>

            <Button size="lg" className="mt-8" onClick={startSession} leftIcon={<Sparkles className="h-5 w-5" />}>
              Start Interview
            </Button>
          </div>
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
          <span>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
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
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="info">{currentQuestion.category}</Badge>
          <Badge variant={difficultyVariant[currentQuestion.difficulty]}>
            {currentQuestion.difficulty}
          </Badge>
        </div>

        <p className="text-lg font-medium leading-relaxed text-foreground">
          {currentQuestion.question}
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-foreground">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here or use voice input..."
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[160px] resize-y"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            variant={isRecording ? 'danger' : 'outline'}
            onClick={toggleRecording}
            leftIcon={isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          >
            {isRecording ? 'Stop Recording' : 'Voice Input'}
          </Button>
          {isRecording && (
            <span className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Recording...
            </span>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              setSessionStarted(false)
              setCurrentIndex(0)
              setAnswer('')
            }}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            End Session
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={nextQuestion} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next Question
            </Button>
          ) : (
            <Button onClick={() => setSessionStarted(false)}>Finish Interview</Button>
          )}
        </div>
      </div>

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
