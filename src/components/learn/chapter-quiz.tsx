'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

interface ChapterQuizProps {
  chapterId: string;
  transcript: string | null;
  enrollmentId: string | null;
}

export function ChapterQuiz({
  chapterId,
  transcript,
  enrollmentId,
}: ChapterQuizProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/quizzes?chapter_id=${chapterId}`)
      .then((r) => r.json())
      .then((d) => setQuiz(d.questions ?? null))
      .catch(() => setQuiz(null));
  }, [chapterId]);

  const generateQuiz = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId, transcript }),
      });
      const data = await res.json();
      if (res.ok) setQuiz(data.questions ?? []);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!quiz?.length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter_id: chapterId,
          enrollment_id: enrollmentId,
          answers,
        }),
      });
      const data = await res.json();
      if (res.ok) setScore(data.score);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!quiz) {
    return (
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Chapter Quiz
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            No quiz yet. Generate one from the chapter transcript using AI.
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={generateQuiz} disabled={generating}>
            {generating ? 'Generating...' : 'Generate Quiz with AI'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (submitted && score !== null) {
    return (
      <Card glass>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            Score: {score} / {quiz.length}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setScore(null);
              setAnswers({});
            }}
            className="mt-4"
          >
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
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
        <Button onClick={handleSubmit} disabled={loading}>
          Submit Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
