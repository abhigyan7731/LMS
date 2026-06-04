'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, MessageCircle, BookOpen, Trophy, HelpCircle, X } from 'lucide-react'
import { VideoPlayer } from './video-player'
import { ChapterDiscussions } from './chapter-discussions'
import { AIStudyAssistant } from './ai-study-assistant'
import { ChapterQuiz } from './chapter-quiz'
import { cn } from '@/lib/utils'

export function LearnView({ course, chapters, enrollmentId, progressMap, isEnrolled, profileId }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(chapters[0] ?? null)
  const [activeTab, setActiveTab] = useState('discussion') // 'discussion' | 'quiz' | 'assistant'

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true)
    }
  }, [])

  const currentProgress = currentChapter ? progressMap[currentChapter.id] : false

  const allChaptersCompleted = useMemo(
    () => chapters.length > 0 && chapters.every((ch) => progressMap[ch.id]),
    [chapters, progressMap]
  )
  const lastChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null

  if (!isEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Enroll to Access</CardTitle>
            <p className="text-muted-foreground">Enroll in this course to watch lessons and track progress.</p>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/courses/${course.slug}`}>View Course & Enroll</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "border-r bg-card/50 backdrop-blur-sm flex-shrink-0 overflow-hidden transition-all duration-300 z-50",
          "fixed inset-y-0 left-0 md:relative md:translate-x-0",
          sidebarOpen 
            ? "w-80 translate-x-0" 
            : "w-0 -translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2 truncate">
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{course.title}</span>
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Video lectures</p>
          <nav className="space-y-1">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentChapter(ch);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentChapter?.id === ch.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-accent'
                }`}
              >
                {progressMap[ch.id] ? (
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 flex-shrink-0" />
                )}
                <span className="truncate">{ch.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col bg-black/95">
          <div className="relative aspect-video max-h-[70vh] bg-black">
            {currentChapter ? (
              <VideoPlayer
                playbackId={currentChapter.mux_playback_id}
                chapterId={currentChapter.id}
                enrollmentId={enrollmentId}
                transcript={currentChapter.transcript}
                onVideoEnded={
                  lastChapter && currentChapter.id === lastChapter.id
                    ? () => setActiveTab('quiz')
                    : undefined
                }
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60">
                Select a chapter
              </div>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 left-4 z-10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
            </Button>
          </div>

          {currentChapter && (
            <div className="p-6 border-b bg-background">
              <h3 className="text-xl font-semibold">{currentChapter.title}</h3>
              {currentChapter.description && (
                <p className="text-muted-foreground mt-1">{currentChapter.description}</p>
              )}
            </div>
          )}
        </div>

        {currentChapter && (
          <div className="flex-1 overflow-auto border-t">
            {/* Course complete banner + final quiz CTA */}
            {allChaptersCompleted && (
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    You&apos;ve completed all video lectures. Take the final quiz to complete the course.
                  </span>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setActiveTab('quiz')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Take Final Quiz
                </Button>
              </div>
            )}

            <div className="flex border-b bg-muted/30">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'discussion' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Discussion
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'quiz' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
                }`}
              >
                <HelpCircle className="h-4 w-4 inline mr-2" />
                {allChaptersCompleted && lastChapter && currentChapter?.id === lastChapter.id ? 'Final Quiz' : 'Quiz'}
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'assistant' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
                }`}
              >
                AI Assistant
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'assistant' ? (
                <AIStudyAssistant
                  chapterId={currentChapter.id}
                  chapterTitle={currentChapter.title}
                  transcript={currentChapter.transcript}
                />
              ) : activeTab === 'quiz' ? (
                <ChapterQuiz
                  chapterId={currentChapter.id}
                  transcript={currentChapter.transcript}
                  enrollmentId={enrollmentId}
                />
              ) : (
                <ChapterDiscussions chapterId={currentChapter.id} profileId={profileId} />
              )}

              {/* When course complete, show final quiz section if not already on it */}
              {allChaptersCompleted && lastChapter && currentChapter?.id !== lastChapter.id && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-500" />
                    Final Quiz
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You&apos;ve completed all lectures. Take the final quiz to complete the course.
                  </p>
                  <ChapterQuiz
                    chapterId={lastChapter.id}
                    transcript={lastChapter.transcript}
                    enrollmentId={enrollmentId}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
