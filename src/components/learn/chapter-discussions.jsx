'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send } from 'lucide-react'

export function ChapterDiscussions({ chapterId, profileId }) {
  const [discussions, setDiscussions] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/discussions?chapter_id=${chapterId}`)
      .then((r) => r.json())
      .then((data) => setDiscussions(Array.isArray(data) ? data : []))
      .catch(() => setDiscussions([]))
  }, [chapterId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || !profileId) return
    setLoading(true)
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId, content: content.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setDiscussions((prev) => [data, ...prev])
        setContent('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Q&A</CardTitle>
        <p className="text-sm text-muted-foreground">Ask questions about this chapter</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {profileId && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Ask a question..." />
            <Button type="submit" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
        <div className="space-y-3">
          {discussions.map((d) => (
            <div key={d.id} className="p-3 rounded-lg bg-muted/50 border-l-4 border-primary/50">
              <p className="text-sm">{d.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(d.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
