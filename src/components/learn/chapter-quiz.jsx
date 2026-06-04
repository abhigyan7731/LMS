'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, AlertTriangle, Loader2 } from 'lucide-react'

export function ChapterQuiz({ chapterId, transcript, enrollmentId }) {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    setInitialLoading(true)
    setError(null)
    setQuiz(null)
    setSubmitted(false)
    setScore(null)
    setAnswers({})
    fetch(`/api/quizzes?chapter_id=${chapterId}`)
      .then((r) => r.json())
      .then((d) => {
        setQuiz(d.questions ?? null)
      })
      .catch(() => setQuiz(null))
      .finally(() => setInitialLoading(false))
  }, [chapterId])

  const generateQuiz = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId, transcript }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz')
      }
      if (data.questions && data.questions.length > 0) {
        setQuiz(data.questions)
      } else {
        throw new Error('No questions were generated. Please try again.')
      }
    } catch (e) {
      setError(e.message || 'Failed to generate quiz. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!quiz?.length) return
    setLoading(true)
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId, enrollment_id: enrollmentId, answers }),
      })
      const data = await res.json()
      if (res.ok) setScore(data.score)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Card glass>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading quiz...</span>
        </CardContent>
      </Card>
    )
  }

  if (!quiz) {
    return (
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Chapter Quiz
          </CardTitle>
          <p className="text-sm text-muted-foreground">No quiz yet. Generate one using AI based on the chapter content.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button onClick={generateQuiz} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Quiz with AI'
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (submitted && score !== null) {
    return (
      <Card glass>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Score: {score} / {quiz.length}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              setScore(null)
              setAnswers({})
            }}
            className="mt-4"
          >
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Chapter Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.map((q) => (
          <div key={q.id} className="space-y-2">
            <p className="font-medium">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border hover:bg-accent/50"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
        <Button onClick={handleSubmit} disabled={loading}>Submit Quiz</Button>
      </CardContent>
    </Card>
  )
}
