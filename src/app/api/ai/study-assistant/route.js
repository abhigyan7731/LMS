import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { chapter_title, transcript, messages } = body

    const lastUser = messages?.filter((m) => m.role === 'user').pop()
    if (!lastUser?.content) return NextResponse.json({ error: 'No question' }, { status: 400 })

    const context = transcript
      ? `Chapter: ${chapter_title}\n\nTranscript/Content:\n${transcript.slice(0, 6000)}`
      : `Chapter: ${chapter_title}. (No transcript available - answer based on general knowledge.)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful study assistant. Answer the student's question based ONLY on the chapter content provided. If the answer isn't in the content, say so. Be concise and educational.`,
        },
        { role: 'user', content: `Context:\n${context}\n\nStudent question: ${lastUser.content}` },
      ],
    })

    const reply = completion.choices[0]?.message?.content ?? 'I could not generate a response.'
    return NextResponse.json({ reply })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}
