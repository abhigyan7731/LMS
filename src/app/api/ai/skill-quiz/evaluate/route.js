import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic, questions, answers } = await request.json()

    if (!topic || !questions || !answers) {
      return NextResponse.json({ error: 'topic, questions, and answers are required' }, { status: 400 })
    }

    // Calculate score
    let correctCount = 0
    let beginnerCorrect = 0, beginnerTotal = 0
    let intermediateCorrect = 0, intermediateTotal = 0
    let advancedCorrect = 0, advancedTotal = 0

    const detailedResults = questions.map((q) => {
      const selectedId = answers[q.id]
      const correctOption = q.options.find((o) => o.isCorrect)
      const isCorrect = selectedId === correctOption?.id

      if (isCorrect) correctCount++

      switch (q.difficulty) {
        case 'beginner':
          beginnerTotal++; if (isCorrect) beginnerCorrect++; break
        case 'intermediate':
          intermediateTotal++; if (isCorrect) intermediateCorrect++; break
        case 'advanced':
          advancedTotal++; if (isCorrect) advancedCorrect++; break
      }

      return {
        questionId: q.id,
        question: q.question,
        difficulty: q.difficulty,
        selectedAnswer: selectedId,
        correctAnswer: correctOption?.id,
        isCorrect,
      }
    })

    const totalQuestions = questions.length
    const scorePercent = Math.round((correctCount / totalQuestions) * 100)

    // Determine skill level
    let skillLevel = 'Beginner'
    if (scorePercent >= 80 && advancedCorrect >= 2) {
      skillLevel = 'Advanced'
    } else if (scorePercent >= 50 && intermediateCorrect >= 1) {
      skillLevel = 'Intermediate'
    }

    // Generate analysis locally (no AI needed)
    const wrongQuestions = detailedResults.filter((r) => !r.isCorrect)

    let analysis = ''
    if (scorePercent >= 80) {
      analysis = `Excellent work! You scored ${scorePercent}% on the ${topic} assessment, demonstrating strong knowledge. You have a solid foundation and are ready for advanced topics.`
    } else if (scorePercent >= 50) {
      analysis = `Good effort! You scored ${scorePercent}% on the ${topic} assessment. You have a decent understanding but there are areas to improve. Focus on the topics you missed to level up.`
    } else {
      analysis = `You scored ${scorePercent}% on the ${topic} assessment. Don't worry — everyone starts somewhere! We recommend starting with beginner courses to build a strong foundation.`
    }

    // Determine strengths & weaknesses based on difficulty performance
    const strengths = []
    const weaknesses = []

    if (beginnerTotal > 0) {
      const pct = Math.round((beginnerCorrect / beginnerTotal) * 100)
      if (pct >= 75) strengths.push(`Strong grasp of ${topic} fundamentals (${pct}% on basic questions)`)
      else weaknesses.push(`Review ${topic} basics and core concepts`)
    }
    if (intermediateTotal > 0) {
      const pct = Math.round((intermediateCorrect / intermediateTotal) * 100)
      if (pct >= 66) strengths.push(`Good problem-solving skills at intermediate level (${pct}%)`)
      else weaknesses.push(`Practice applying concepts to intermediate-level problems`)
    }
    if (advancedTotal > 0) {
      const pct = Math.round((advancedCorrect / advancedTotal) * 100)
      if (pct >= 66) strengths.push(`Impressive performance on advanced topics (${pct}%)`)
      else weaknesses.push(`Explore advanced ${topic} topics and edge cases`)
    }

    if (strengths.length === 0) strengths.push('Keep practicing to build your knowledge!')
    if (weaknesses.length === 0) weaknesses.push('Great job — keep pushing to master every area!')

    // Recommended topics based on what they got wrong
    const recommendedTopics = [...new Set(
      wrongQuestions.slice(0, 5).map((q) => {
        // Extract category or use topic
        const cat = questions.find((qq) => qq.id === q.questionId)?.category
        return cat || topic
      })
    )]
    if (recommendedTopics.length === 0) recommendedTopics.push(topic)

    // Fetch matching courses from the platform
    const supabase = createAdminClient()
    const { data: allCourses } = await supabase
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, price, category')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    // Smart matching: search course titles and descriptions for keyword matches
    const keywords = [
      topic.toLowerCase(),
      ...recommendedTopics.map((t) => t.toLowerCase()),
    ]

    const scoredCourses = (allCourses || []).map((course) => {
      const titleLower = (course.title || '').toLowerCase()
      const descLower = (course.description || '').toLowerCase()
      const catLower = (course.category || '').toLowerCase()

      let matchScore = 0
      for (const kw of keywords) {
        const kwWords = kw.split(/[\s:&,]+/)
        for (const word of kwWords) {
          if (word.length < 3) continue
          if (titleLower.includes(word)) matchScore += 3
          if (descLower.includes(word)) matchScore += 1
          if (catLower.includes(word)) matchScore += 2
        }
      }
      return { ...course, matchScore }
    })

    // Sort by match score and return top matches
    const recommendedCourses = scoredCourses
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6)

    // If no keyword matches, return some courses as general recommendations
    const finalCourses = recommendedCourses.length > 0
      ? recommendedCourses
      : (allCourses || []).slice(0, 4)

    // Try to save assessment (table may not exist — non-fatal)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (profile) {
      try {
        await supabase.from('skill_assessments').insert({
          user_id: profile.id,
          topic,
          score: correctCount,
          total_questions: totalQuestions,
          score_percent: scorePercent,
          skill_level: skillLevel,
          strengths,
          weaknesses,
          detailed_results: detailedResults,
        })
      } catch (dbErr) {
        // Table might not exist — non-fatal
        console.warn('[skill-quiz/evaluate] Could not save assessment:', dbErr.message)
      }
    }

    return NextResponse.json({
      score: correctCount,
      totalQuestions,
      scorePercent,
      skillLevel,
      breakdown: {
        beginner: { correct: beginnerCorrect, total: beginnerTotal },
        intermediate: { correct: intermediateCorrect, total: intermediateTotal },
        advanced: { correct: advancedCorrect, total: advancedTotal },
      },
      analysis,
      strengths,
      weaknesses,
      recommendedTopics,
      recommendedCourses: finalCourses.map(({ matchScore, ...c }) => c),
    })
  } catch (e) {
    console.error('[skill-quiz/evaluate] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to evaluate quiz' },
      { status: 500 }
    )
  }
}
