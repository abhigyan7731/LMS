import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Open Trivia Database (opentdb.com) — FREE, no API key needed.
 * Category IDs we use:
 *   18 = Science: Computers
 *   19 = Science: Mathematics
 *   17 = Science & Nature
 *   9  = General Knowledge
 *   30 = Science: Gadgets
 *   22 = Geography
 *   23 = History
 *   25 = Art
 */
const CATEGORY_MAP = {
  'Web Development': 18,
  'AI & Machine Learning': 18,
  'Data Science': 19,
  'Mobile Development': 18,
  'DevOps & Cloud': 18,
  'Cybersecurity': 18,
  'Data Structures & Algorithms': 19,
  'UI/UX Design': 25,
  'Database Engineering': 18,
  'Programming Fundamentals': 18,
  'Science & Nature': 17,
  'General Knowledge': 9,
  'Mathematics': 19,
  'History': 23,
  'Geography': 22,
  'Gadgets & Technology': 30,
}

// Decode HTML entities from OpenTDB responses
function decodeHTML(html) {
  const entities = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&#039;': "'", '&eacute;': 'é',
    '&ouml;': 'ö', '&uuml;': 'ü', '&aacute;': 'á',
    '&iacute;': 'í', '&ntilde;': 'ñ', '&Eacute;': 'É',
    '&lrm;': '', '&rlm;': '', '&shy;': '',
  }
  return html.replace(/&[\w#]+;/g, (m) => entities[m] || m)
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic } = await request.json()
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    // Find the best matching OpenTDB category
    const categoryId = CATEGORY_MAP[topic] || CATEGORY_MAP['General Knowledge'] || 9

    // Fetch questions from OpenTDB — 10 questions, multiple choice
    // Mix difficulties: 4 easy, 3 medium, 3 hard
    const fetchQuestions = async (difficulty, amount) => {
      const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`OpenTDB API error: ${res.status}`)
      const data = await res.json()
      if (data.response_code !== 0) {
        // Fallback: try without category filter
        const fallbackUrl = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
        const fallbackRes = await fetch(fallbackUrl)
        const fallbackData = await fallbackRes.json()
        return fallbackData.results || []
      }
      return data.results || []
    }

    // Fetch different difficulties
    let allQuestions = []
    try {
      const [easy, medium, hard] = await Promise.all([
        fetchQuestions('easy', 4),
        fetchQuestions('medium', 3),
        fetchQuestions('hard', 3),
      ])
      allQuestions = [...easy, ...medium, ...hard]
    } catch (e) {
      // If parallel fails (rate limit), try sequential with single request
      const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`
      const res = await fetch(url)
      const data = await res.json()
      allQuestions = data.results || []
    }

    if (allQuestions.length === 0) {
      // Last resort: fetch without category
      const url = `https://opentdb.com/api.php?amount=10&type=multiple`
      const res = await fetch(url)
      const data = await res.json()
      allQuestions = data.results || []
    }

    // Transform OpenTDB format → our quiz format
    const difficultyMap = { easy: 'beginner', medium: 'intermediate', hard: 'advanced' }

    const questions = allQuestions.slice(0, 10).map((q, idx) => {
      const correctAnswer = decodeHTML(q.correct_answer)
      const incorrectAnswers = q.incorrect_answers.map(decodeHTML)
      const allOptions = shuffleArray([
        { id: 'correct', text: correctAnswer, isCorrect: true },
        ...incorrectAnswers.map((text, i) => ({ id: `wrong_${i}`, text, isCorrect: false })),
      ]).map((opt, i) => ({ ...opt, id: String.fromCharCode(97 + i) }))

      // Reassign isCorrect after shuffling and re-id'ing
      const correctText = correctAnswer
      const options = allOptions.map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.text === correctText,
      }))

      return {
        id: `q${idx + 1}`,
        question: decodeHTML(q.question),
        difficulty: difficultyMap[q.difficulty] || 'intermediate',
        category: decodeHTML(q.category),
        options,
      }
    })

    return NextResponse.json({
      quiz_title: `${topic} Assessment`,
      quiz_description: `Test your ${topic} knowledge with questions from the internet`,
      questions,
    })
  } catch (e) {
    console.error('[skill-quiz] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
