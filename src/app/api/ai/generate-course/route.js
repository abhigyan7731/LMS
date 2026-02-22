import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'
import { slugify } from '@/lib/utils'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile || profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { topic } = await request.json()
    if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert course designer. Generate a structured course with:
1. A compelling title (based on the topic)
2. A 2-3 sentence description
3. Between 5-8 chapters, each with:
   - title
   - description (1-2 sentences)
   - position (0-indexed)

Respond with valid JSON only, no markdown. Format:
{
  "title": "string",
  "description": "string",
  "chapters": [
    { "title": "string", "description": "string", "position": 0 }
  ]
}`,
        },
        { role: 'user', content: `Create a course for the topic: ${topic}` },
      ],
      response_format: { type: 'json_object' },
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error('No response from AI')

    const parsed = JSON.parse(text)

    const slug = slugify(parsed.title) + '-' + Date.now().toString(36)

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        teacher_id: profile.id,
        title: parsed.title,
        slug,
        description: parsed.description,
        price: 0,
        is_published: false,
      })
      .select('id')
      .single()

    if (courseError) throw courseError

    if (parsed.chapters?.length) {
      await supabase.from('chapters').insert(
        parsed.chapters.map((c) => ({
          course_id: course.id,
          title: c.title,
          description: c.description,
          position: c.position,
        }))
      )
    }

    return NextResponse.json({ courseId: course.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}
