'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GripVertical, Plus, Trash2, Video } from 'lucide-react'
import { VideoUpload } from './video-upload'
import toast from 'react-hot-toast'

export function CourseEditor({ course, chapters: initialChapters }) {
  const router = useRouter()
  const [chapters, setChapters] = useState(initialChapters)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const moveChapter = (index, direction) => {
    const newChapters = [...chapters]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= newChapters.length) return
    ;[newChapters[index], newChapters[target]] = [newChapters[target], newChapters[index]]
    newChapters.forEach((c, i) => (c.position = i))
    setChapters(newChapters)
    saveOrder(newChapters)
  }

  const saveOrder = async (order) => {
    setSaving(true)
    try {
      for (let i = 0; i < order.length; i++) {
        await fetch(`/api/chapters/${order[i].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: i }),
        })
      }
      router.refresh()
    } catch {
      toast.error('Failed to reorder')
    } finally {
      setSaving(false)
    }
  }

  const updateChapter = async () => {
    if (!selectedChapter) return
    setSaving(true)
    try {
      const res = await fetch(`/api/chapters/${selectedChapter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      if (!res.ok) throw new Error()
      toast.success('Chapter updated')
      setChapters((prev) => prev.map((c) => (c.id === selectedChapter.id ? { ...c, title, description } : c)))
      setSelectedChapter({ ...selectedChapter, title, description })
      router.refresh()
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const addChapter = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: course.id, title: 'New Chapter', position: chapters.length }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error()
      setChapters((prev) => [...prev, { id: data.id, title: 'New Chapter', description: null, position: prev.length, mux_playback_id: null }])
      router.refresh()
    } catch {
      toast.error('Failed to add chapter')
    } finally {
      setSaving(false)
    }
  }

  const deleteChapter = async (id) => {
    if (!confirm('Delete this chapter?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/chapters/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setChapters((prev) => prev.filter((c) => c.id !== id))
      if (selectedChapter?.id === id) setSelectedChapter(null)
      router.refresh()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  const selectChapter = (ch) => {
    setSelectedChapter(ch)
    setTitle(ch.title)
    setDescription(ch.description ?? '')
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Chapters</h2>
          <Button size="sm" onClick={addChapter} disabled={saving}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <Card glass>
          <CardContent className="p-0">
            <div className="divide-y">
              {chapters.sort((a, b) => a.position - b.position).map((ch, i) => (
                <div
                  key={ch.id}
                  className={`flex items-center gap-2 p-3 cursor-pointer group ${selectedChapter?.id === ch.id ? 'bg-primary/10' : 'hover:bg-accent/50'}`}
                  onClick={() => selectChapter(ch)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{ch.title}</div>
                    {ch.mux_playback_id && <Video className="h-3 w-3 text-primary inline mr-1" />}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChapter(ch.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedChapter ? (
          <Card glass>
            <CardHeader>
              <CardTitle>Edit Chapter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chapter title" />
              </div>
              <div>
                <Label>Description</Label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Chapter description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <Label>Video</Label>
                <div className="mt-2">
                  <VideoUpload chapterId={selectedChapter.id} onComplete={() => {
                    setChapters((prev) => prev.map((c) => (c.id === selectedChapter.id ? { ...c, mux_playback_id: 'pending' } : c)))
                    router.refresh()
                  }} />
                </div>
                {selectedChapter.mux_playback_id && <p className="text-xs text-muted-foreground mt-2">Video: {selectedChapter.mux_playback_id}</p>}
              </div>
              <Button onClick={updateChapter} disabled={saving}>Save Chapter</Button>
            </CardContent>
          </Card>
        ) : (
          <Card glass>
            <CardContent className="py-12 text-center text-muted-foreground">Select a chapter to edit</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
