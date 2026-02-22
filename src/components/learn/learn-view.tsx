'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, MessageCircle, BookOpen } from 'lucide-react';
import { VideoPlayer } from './video-player';
import { ChapterDiscussions } from './chapter-discussions';
import { AIStudyAssistant } from './ai-study-assistant';
import { ChapterQuiz } from './chapter-quiz';

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
  mux_playback_id: string | null;
  transcript: string | null;
}

interface LearnViewProps {
  course: { id: string; title: string; slug: string };
  chapters: Chapter[];
  enrollmentId: string | null;
  progressMap: Record<string, boolean>;
  isEnrolled: boolean;
  profileId: string | null;
}

export function LearnView({
  course,
  chapters,
  enrollmentId,
  progressMap,
  isEnrolled,
  profileId,
}: LearnViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(chapters[0] ?? null);
  const [showAssistant, setShowAssistant] = useState(false);

  const currentProgress = currentChapter ? progressMap[currentChapter.id] : false;

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
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } border-r bg-card/50 backdrop-blur-sm flex-shrink-0 overflow-hidden transition-all`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course.title}
          </h2>
          <nav className="space-y-1">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setCurrentChapter(ch)}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video + Player area */}
        <div className="flex-1 flex flex-col bg-black/95">
          <div className="relative aspect-video max-h-[70vh] bg-black">
            {currentChapter ? (
              <VideoPlayer
                playbackId={currentChapter.mux_playback_id}
                chapterId={currentChapter.id}
                enrollmentId={enrollmentId!}
                transcript={currentChapter.transcript}
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
              <ChevronDown
                className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
              />
            </Button>
          </div>

          {/* Chapter info */}
          {currentChapter && (
            <div className="p-6 border-b bg-background">
              <h3 className="text-xl font-semibold">{currentChapter.title}</h3>
              {currentChapter.description && (
                <p className="text-muted-foreground mt-1">{currentChapter.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Tabs: Discussion, Quiz, AI Assistant */}
        {currentChapter && (
          <div className="flex-1 overflow-auto border-t">
            <div className="flex border-b bg-muted/30">
              <button
                onClick={() => setShowAssistant(false)}
                className={`px-4 py-3 text-sm font-medium ${
                  !showAssistant ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Discussion
              </button>
              <button
                onClick={() => setShowAssistant(false)}
                className={`px-4 py-3 text-sm font-medium text-muted-foreground`}
              >
                Quiz
              </button>
              <button
                onClick={() => setShowAssistant(true)}
                className={`px-4 py-3 text-sm font-medium ${
                  showAssistant ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
                }`}
              >
                AI Assistant
              </button>
            </div>
            <div className="p-6">
              {showAssistant ? (
                <AIStudyAssistant
                  chapterId={currentChapter.id}
                  chapterTitle={currentChapter.title}
                  transcript={currentChapter.transcript}
                />
              ) : (
                <>
                  <ChapterDiscussions
                    chapterId={currentChapter.id}
                    profileId={profileId}
                  />
                  <div className="mt-8">
                    <ChapterQuiz
                      chapterId={currentChapter.id}
                      transcript={currentChapter.transcript}
                      enrollmentId={enrollmentId}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
