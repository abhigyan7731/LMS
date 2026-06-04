'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Send, Bot, X, MessageSquare, Sparkles, Users } from 'lucide-react';
const MentorAvatar = dynamic(() => import('@/components/3d/mentor-avatar'), { ssr: false });
import GhostPresence from './ghost-presence';
import { Button } from '@/components/ui/button'; 

interface VideoPlayerProps {
  playbackId: string | null;
  chapterId: string;
  enrollmentId: string;
  title: string;
  transcript?: string | null;
  onVideoEnded?: () => void;
}

export function VideoPlayer({
  playbackId,
  chapterId,
  enrollmentId,
  title,
  transcript,
  onVideoEnded,
}: VideoPlayerProps) {
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onTimeUpdate = useCallback(async (time: number) => {
    // Only update progress every 10 seconds to save API calls
    if (Math.floor(time) % 10 === 0) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment_id: enrollmentId,
          chapter_id: chapterId,
          watched_seconds: Math.floor(time),
        }),
      });
    }
  }, [enrollmentId, chapterId]);

  const onEnded = useCallback(async () => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        chapter_id: chapterId,
        completed: true,
      }),
    });
    onVideoEnded?.();
  }, [enrollmentId, chapterId, onVideoEnded]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setIsTalking(true);

    try {
      const resp = await fetch('/api/ai/study-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter_title: title,
          transcript: transcript,
          messages: [...messages, userMsg],
        }),
      });

      const data = await resp.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural network right now." }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Error: Could not reach the AI core." }]);
    } finally {
      setIsLoading(false);
      setIsTalking(false);
    }
  };

  if (!playbackId) {
    return (
      <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground rounded-2xl border border-white/5">
        <div className="text-center">
          <p>No video for this chapter yet</p>
          <p className="text-sm">Teacher will add video soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Video Side */}
      <div className="flex-1 space-y-4">
        <div className="w-full aspect-video bg-black relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
          <video
            className="w-full h-full"
            controls
            playsInline
            onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
            onEnded={onEnded}
          >
            <source
              src={`https://stream.mux.com/${playbackId}.m3u8`}
              type="application/x-mpegURL"
            />
          </video>
          
          {/* Ghost Presence Overlay */}
          <div className="absolute top-4 right-4 z-20">
            <GhostPresence channelId={chapterId} userName="Student" />
          </div>
          
          {/* AI Mentor Toggle Button */}
          {!isMentorOpen && (
            <button
              onClick={() => setIsMentorOpen(true)}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 btn-3d"
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm font-semibold">Invoke Mentor</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Mentor Sidepanel */}
      {isMentorOpen && (
        <div className="w-full lg:w-[320px] xl:w-[380px] h-[500px] lg:h-auto flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden tilt-in shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Holographic Assistant</h3>
            </div>
            <button onClick={() => setIsMentorOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white/40" />
            </button>
          </div>

          {/* Avatar Section */}
          <div className="h-48 flex-shrink-0 border-b border-white/5 bg-gradient-to-b from-transparent to-violet-950/20">
            <MentorAvatar isTalking={isTalking} />
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth min-h-0">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-white/40 italic">Ask me anything about "{title}"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white/10 text-white/90 rounded-bl-none border border-white/10'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your mentor..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all text-white placeholder:text-white/20"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all btn-3d"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
