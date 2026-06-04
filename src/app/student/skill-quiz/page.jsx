'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Brain, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, XCircle,
  Loader2, BookOpen, Award, Target, Zap, Code2, Database,
  Globe, Shield, Smartphone, Cloud, BarChart3, Cpu, Palette,
  RefreshCcw, ChevronRight, Trophy, TrendingUp, AlertTriangle,
  GraduationCap, Rocket, Star, Timer, CircleDot
} from 'lucide-react'

/* ── Topic Catalog ── */
const TOPICS = [
  { id: 'web-dev', name: 'Web Development', icon: Globe, color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.4)', subtopics: ['HTML & CSS', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Full Stack'] },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain, color: 'from-violet-500 to-purple-500', glow: 'rgba(139,92,246,0.4)', subtopics: ['Python for ML', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'Data Science'] },
  { id: 'data-science', name: 'Data Science', icon: BarChart3, color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.4)', subtopics: ['Python', 'Statistics', 'SQL', 'Data Visualization', 'Pandas', 'Big Data'] },
  { id: 'mobile', name: 'Mobile Development', icon: Smartphone, color: 'from-orange-500 to-amber-500', glow: 'rgba(245,158,11,0.4)', subtopics: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'Cross-Platform', 'Mobile UI'] },
  { id: 'devops', name: 'DevOps & Cloud', icon: Cloud, color: 'from-sky-500 to-blue-500', glow: 'rgba(14,165,233,0.4)', subtopics: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Infrastructure'] },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, color: 'from-red-500 to-rose-500', glow: 'rgba(239,68,68,0.4)', subtopics: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Web Security', 'OWASP', 'Pen Testing'] },
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: Cpu, color: 'from-indigo-500 to-blue-500', glow: 'rgba(99,102,241,0.4)', subtopics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Sorting', 'Linked Lists', 'System Design'] },
  { id: 'ui-ux', name: 'UI/UX Design', icon: Palette, color: 'from-pink-500 to-rose-500', glow: 'rgba(236,72,153,0.4)', subtopics: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility', 'Motion Design'] },
  { id: 'database', name: 'Database Engineering', icon: Database, color: 'from-amber-500 to-yellow-500', glow: 'rgba(245,158,11,0.4)', subtopics: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization'] },
  { id: 'programming', name: 'Programming Fundamentals', icon: Code2, color: 'from-teal-500 to-emerald-500', glow: 'rgba(20,184,166,0.4)', subtopics: ['Python', 'Java', 'C++', 'JavaScript', 'Go', 'Rust'] },
]

const DIFFICULTY_COLORS = {
  beginner: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  intermediate: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  advanced: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  expert: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
}

/* ── Main Component ── */
export default function SkillQuizPage() {
  const [phase, setPhase] = useState('topic') // topic | subtopic | loading | quiz | evaluating | results
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [quizMeta, setQuizMeta] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState(null)

  /* Timer */
  useEffect(() => {
    if (phase !== 'quiz') return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  /* Generate Quiz */
  const generateQuiz = useCallback(async (topic, subtopic) => {
    setPhase('loading')
    setError(null)
    try {
      const res = await fetch('/api/ai/skill-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.name, subtopic }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate quiz')
      }
      const data = await res.json()
      setQuestions(data.questions)
      setQuizMeta({ title: data.quiz_title, description: data.quiz_description })
      setAnswers({})
      setCurrentQ(0)
      setTimeLeft(data.questions.length * 60) // 1 minute per question
      setQuizStartTime(Date.now())
      setPhase('quiz')
    } catch (e) {
      setError(e.message)
      setPhase('topic')
    }
  }, [])

  /* Evaluate Quiz */
  const evaluateQuiz = useCallback(async () => {
    setPhase('evaluating')
    setError(null)
    try {
      const res = await fetch('/api/ai/skill-quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic.name + (selectedSubtopic ? ` — ${selectedSubtopic}` : ''),
          questions,
          answers,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to evaluate')
      }
      const data = await res.json()
      setResults(data)
      setPhase('results')
    } catch (e) {
      setError(e.message)
      setPhase('quiz')
    }
  }, [selectedTopic, selectedSubtopic, questions, answers])

  /* Handle answer selection */
  const selectAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  /* Reset */
  const resetQuiz = () => {
    setPhase('topic')
    setSelectedTopic(null)
    setSelectedSubtopic(null)
    setQuestions([])
    setAnswers({})
    setResults(null)
    setError(null)
    setCurrentQ(0)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen gradient-mesh-dark text-white relative overflow-hidden">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full particle-float"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: (i % 3) + 1.5,
              height: (i % 3) + 1.5,
              backgroundColor: i % 3 === 0 ? 'rgba(139,92,246,0.5)' : i % 3 === 1 ? 'rgba(59,130,246,0.5)' : 'rgba(6,182,212,0.4)',
              animationDelay: `${(i * 0.8) % 8}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="fixed inset-0 perspective-grid pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ═══════════ TOPIC SELECTION ═══════════ */}
        {phase === 'topic' && (
          <div className="space-y-8 tilt-in">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-2">
                <Brain className="w-4 h-4" />
                Smart Assessment
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Skill Assessment Quiz
              </h1>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Test your knowledge with AI-generated quiz questions. Get personalized course recommendations based on your performance.
              </p>
            </div>

            {error && (
              <div className="mx-auto max-w-xl p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Topic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {TOPICS.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic)
                    setPhase('subtopic')
                  }}
                  className="group relative p-5 rounded-2xl glass-card glass-card-hover text-left transition-all duration-300 tilt-in"
                  style={{ animationDelay: `${idx * 0.05}s`, transformStyle: 'preserve-3d' }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `inset 0 0 30px ${topic.glow}, 0 0 20px ${topic.glow}` }}
                  />
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-3 shadow-lg depth-breathe`}
                      style={{ transform: 'translateZ(12px)' }}
                    >
                      <topic.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-white/90" style={{ transform: 'translateZ(6px)' }}>
                      {topic.name}
                    </h3>
                    <p className="text-xs text-white/30 mt-1">{topic.subtopics.length} subtopics</p>
                  </div>
                  <ChevronRight className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ SUBTOPIC SELECTION ═══════════ */}
        {phase === 'subtopic' && selectedTopic && (
          <div className="space-y-6 tilt-in">
            <button onClick={() => setPhase('topic')} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to topics
            </button>

            <div className="text-center space-y-3">
              <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTopic.color} items-center justify-center shadow-2xl mx-auto depth-breathe`}>
                <selectedTopic.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">{selectedTopic.name}</h2>
              <p className="text-white/40">Choose a focus area or take the general assessment</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {/* General assessment option */}
              <button
                onClick={() => {
                  setSelectedSubtopic(null)
                  generateQuiz(selectedTopic, null)
                }}
                className="w-full group relative p-5 rounded-xl glass-card glass-card-hover text-left tilt-in flex items-center gap-4"
                style={{ animationDelay: '0s' }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedTopic.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">General {selectedTopic.name}</p>
                  <p className="text-xs text-white/40">Full spectrum assessment across all subtopics</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/50 ml-auto transition-all group-hover:translate-x-1" />
              </button>

              {selectedTopic.subtopics.map((sub, idx) => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubtopic(sub)
                    generateQuiz(selectedTopic, sub)
                  }}
                  className="w-full group relative p-4 rounded-xl glass-card glass-card-hover text-left tilt-in flex items-center gap-4"
                  style={{ animationDelay: `${(idx + 1) * 0.05}s` }}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <CircleDot className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 ml-auto transition-all group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ LOADING ═══════════ */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 tilt-in">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-violet-500/30 flex items-center justify-center glow-pulse">
                <Brain className="w-10 h-10 text-violet-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full orbit-ring border-2 border-transparent" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">Generating Your Quiz...</h3>
              <p className="text-white/40 text-sm">AI is crafting personalized questions for you</p>
              <div className="flex items-center justify-center gap-2 text-violet-400 text-sm mt-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating {selectedTopic?.name} questions
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ QUIZ ═══════════ */}
        {phase === 'quiz' && questions.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6 tilt-in">
            {/* Quiz header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-400" />
                  {quizMeta.title}
                </h2>
                <p className="text-sm text-white/40 mt-0.5">{quizMeta.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-mono flex items-center gap-1.5 ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-white/60 border border-white/10'}`}>
                  <Timer className="w-3.5 h-3.5" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-white/30">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-xs text-white/30">{Object.keys(answers).length} answered</span>
              </div>
            </div>

            {/* Question card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden glow-border-violet">
              <div className="absolute inset-0 holo-shimmer pointer-events-none" />

              <div className="relative z-10">
                {/* Difficulty badge */}
                {(() => {
                  const q = questions[currentQ]
                  const dc = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.beginner
                  return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${dc.bg} ${dc.text} border ${dc.border} mb-4`}>
                      {q.difficulty === 'beginner' && <Star className="w-3 h-3" />}
                      {q.difficulty === 'intermediate' && <TrendingUp className="w-3 h-3" />}
                      {q.difficulty === 'advanced' && <Zap className="w-3 h-3" />}
                      {q.difficulty === 'expert' && <Trophy className="w-3 h-3" />}
                      {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                    </span>
                  )
                })()}

                <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed" style={{ transform: 'translateZ(8px)' }}>
                  {questions[currentQ].question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQ].options.map((option, idx) => {
                    const isSelected = answers[questions[currentQ].id] === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => selectAnswer(questions[currentQ].id, option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group flex items-start gap-3 ${
                          isSelected
                            ? 'border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                              : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-sm leading-relaxed pt-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>
                          {option.text}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 hover:text-white/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {/* Question dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentQ
                        ? 'bg-violet-500 scale-125 shadow-lg shadow-violet-500/50'
                        : answers[q.id]
                        ? 'bg-emerald-500/60'
                        : 'bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ((p) => Math.min(questions.length - 1, p + 1))}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 hover:text-white/80 transition-all"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={evaluateQuiz}
                  disabled={Object.keys(answers).length < questions.length}
                  className="btn-3d flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" /> Submit Quiz
                </button>
              )}
            </div>

            {Object.keys(answers).length < questions.length && (
              <p className="text-center text-xs text-white/30">
                Answer all {questions.length} questions to submit • {questions.length - Object.keys(answers).length} remaining
              </p>
            )}
          </div>
        )}

        {/* ═══════════ EVALUATING ═══════════ */}
        {phase === 'evaluating' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 tilt-in">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 flex items-center justify-center glow-pulse">
                <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full orbit-ring border-2 border-transparent" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">Analyzing Your Results...</h3>
              <p className="text-white/40 text-sm">Evaluating your answers and finding the best courses for you</p>
              <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm mt-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Matching courses to your skill level
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ RESULTS ═══════════ */}
        {phase === 'results' && results && (
          <div className="max-w-4xl mx-auto space-y-8 tilt-in">
            {/* Score Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 ${
                  results.scorePercent >= 80 ? 'border-emerald-500/50' : results.scorePercent >= 50 ? 'border-blue-500/50' : 'border-amber-500/50'
                }`} style={{
                  boxShadow: results.scorePercent >= 80
                    ? '0 0 40px rgba(16,185,129,0.3), inset 0 0 40px rgba(16,185,129,0.1)'
                    : results.scorePercent >= 50
                    ? '0 0 40px rgba(59,130,246,0.3), inset 0 0 40px rgba(59,130,246,0.1)'
                    : '0 0 40px rgba(245,158,11,0.3), inset 0 0 40px rgba(245,158,11,0.1)'
                }}>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">{results.scorePercent}%</span>
                    <p className="text-xs text-white/40">{results.score}/{results.totalQuestions}</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    results.skillLevel === 'Advanced'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                      : results.skillLevel === 'Intermediate'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  }`}>
                    {results.skillLevel === 'Advanced' && <span>🏆 </span>}
                    {results.skillLevel === 'Intermediate' && <span>📈 </span>}
                    {results.skillLevel === 'Beginner' && <span>🌱 </span>}
                    {results.skillLevel}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedTopic?.name} Assessment Complete
                </h2>
                <p className="text-white/50 mt-2 max-w-xl mx-auto">{results.analysis}</p>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Beginner', data: results.breakdown?.beginner, icon: Star, cardClass: 'border-emerald-500/20 bg-emerald-500/5', iconClass: 'text-emerald-400' },
                { label: 'Intermediate', data: results.breakdown?.intermediate, icon: TrendingUp, cardClass: 'border-blue-500/20 bg-blue-500/5', iconClass: 'text-blue-400' },
                { label: 'Advanced', data: results.breakdown?.advanced, icon: Zap, cardClass: 'border-violet-500/20 bg-violet-500/5', iconClass: 'text-violet-400' },
                { label: 'Expert', data: results.breakdown?.expert, icon: Trophy, cardClass: 'border-amber-500/20 bg-amber-500/5', iconClass: 'text-amber-400' },
              ].map((item, idx) => (
                <div key={item.label} className={`rounded-xl border ${item.cardClass} p-4 text-center glass-card tilt-in`} style={{ animationDelay: `${idx * 0.08}s` }}>
                  <item.icon className={`w-5 h-5 ${item.iconClass} mx-auto mb-2`} />
                  <p className="text-xs text-white/40 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-white">{item.data?.correct ?? 0}/{item.data?.total ?? 0}</p>
                </div>
              ))}
            </div>

            {/* Phase 4: Adaptive Mastery Boost */}
            {results.remedialContent && (
              <div className="rounded-3xl border border-violet-500/30 bg-violet-600/5 p-6 sm:p-8 glass-card relative overflow-hidden tilt-in shadow-glow-violet mb-8" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 holo-scanline opacity-20 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 blur-[100px] rounded-full" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg depth-breathe">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Mastery Boost: {results.remedialContent.title}</h3>
                      <p className="text-violet-400 text-sm font-medium uppercase tracking-widest">Adaptive Remedial Insight Activated</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-400" />
                        Key Insight
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                        {results.remedialContent.lesson}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Brain className="w-4 h-4 text-cyan-400" />
                          Mental Model
                        </h4>
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 italic text-cyan-100 text-sm">
                          "{results.remedialContent.analogy}"
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber-400" />
                          Practice Challenge
                        </h4>
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-100 text-sm font-medium">
                          {results.remedialContent.challenge}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 glass-card">
                <h3 className="font-semibold text-emerald-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {(results.strengths || []).map((s, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                  {(!results.strengths || results.strengths.length === 0) && (
                    <li className="text-sm text-white/40">Keep practicing to identify strengths!</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 glass-card">
                <h3 className="font-semibold text-amber-400 flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5" /> Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {(results.weaknesses || []).map((w, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">→</span> {w}
                    </li>
                  ))}
                  {(!results.weaknesses || results.weaknesses.length === 0) && (
                    <li className="text-sm text-white/40">Great job — no major gaps found!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-400" />
                <h3 className="text-xl font-bold text-white">Recommended Courses For You</h3>
              </div>
              <p className="text-sm text-white/40">Based on your assessment, these courses will help you level up:</p>

              {results.recommendedCourses && results.recommendedCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.recommendedCourses.map((course, idx) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug || course.id}`}
                      className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 card-3d tilt-in"
                      style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden" style={{ transform: 'translateZ(10px)' }}>
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-violet-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1" style={{ transform: 'translateZ(5px)' }}>
                          <h4 className="font-semibold text-white text-sm truncate group-hover:text-violet-300 transition-colors">{course.title}</h4>
                          <p className="text-xs text-white/40 mt-0.5">{course.category || 'Course'}</p>
                        </div>
                      </div>
                      {course.description && (
                        <p className="text-xs text-white/30 line-clamp-2 mb-3">{course.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-violet-400">{course.price ? `$${course.price}` : 'Free'}</span>
                        <span className="text-xs text-white/30 group-hover:text-violet-400 flex items-center gap-1 transition-colors">
                          Enroll <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center glass-card">
                  <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 mb-3">No matching courses found in the catalog yet.</p>
                  <Link
                    href="/courses"
                    className="btn-3d inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-xl shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" /> Browse All Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Recommended Topics to Study */}
            {results.recommendedTopics && results.recommendedTopics.length > 0 && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 glass-card relative overflow-hidden">
                <div className="absolute inset-0 holo-shimmer pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-blue-400 flex items-center gap-2 mb-3">
                    <Rocket className="w-5 h-5" /> Topics to Explore Next
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.recommendedTopics.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={resetQuiz}
                className="btn-3d flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25"
              >
                <RefreshCcw className="w-4 h-4" /> Take Another Quiz
              </button>
              <Link
                href="/student"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
