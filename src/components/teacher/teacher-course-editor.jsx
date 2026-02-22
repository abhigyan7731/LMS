'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BookOpen, Video, Users, Globe, Lock,
    Plus, Trash2, GripVertical, Check, X,
    Upload, Loader2, ChevronDown, ChevronUp,
    Edit3, Save, Eye, DollarSign
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

// Video Upload Sub-component
function LectureUpload({ chapterId, onComplete, hasVideo }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState('');
    const [done, setDone] = useState(hasVideo);

    const onDrop = async (files) => {
        const file = files[0];
        if (!file || !file.type.startsWith('video/')) return;

        setUploading(true);
        setProgress('Getting upload URL...');
        try {
            const res = await fetch('/api/mux/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chapter_id: chapterId }),
            });
            const { uploadUrl, uploadId } = await res.json();
            if (!res.ok || !uploadUrl) throw new Error('Failed to get upload URL');

            setProgress('Uploading video...');
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

            setProgress('Processing...');
            const completeRes = await fetch('/api/mux/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upload_id: uploadId, chapter_id: chapterId }),
            });
            if (!completeRes.ok) throw new Error('Processing failed');

            setDone(true);
            toast.success('Video uploaded successfully!');
            onComplete?.();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Upload failed');
            setProgress('');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': ['.mp4', '.webm', '.mov'] },
        maxFiles: 1,
        disabled: uploading,
    });

    if (done) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-400">Video uploaded</p>
                    <p className="text-xs text-white/40">Processing may take a few minutes</p>
                </div>
                <button
                    onClick={() => setDone(false)}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                    Replace
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragActive
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'
                } ${uploading ? 'pointer-events-none' : ''}`}
        >
            <input {...getInputProps()} />
            {uploading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    <p className="text-sm text-violet-300 font-medium">{progress}</p>
                    <p className="text-xs text-white/30">Do not close this page</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-white/30" />
                    <p className="text-sm text-white/60">
                        {isDragActive ? 'Drop video here...' : 'Drop video or click to upload'}
                    </p>
                    <p className="text-xs text-white/30">MP4, WebM, MOV</p>
                </div>
            )}
        </div>
    );
}

// Chapter Item Sub-component
function ChapterItem({ chapter, index, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, isFirst, isLast, saving }) {
    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 group ${isSelected
                    ? 'bg-violet-600/20 border border-violet-500/30'
                    : 'border border-transparent hover:bg-white/5 hover:border-white/10'
                }`}
            onClick={() => onSelect(chapter)}
        >
            <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? 'text-violet-200' : 'text-white/70'}`}>
                    {chapter.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    {chapter.mux_playback_id && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <Video className="w-2.5 h-2.5" /> Video ready
                        </span>
                    )}
                    <span className="text-xs text-white/25">Lecture {index + 1}</span>
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                    disabled={isFirst || saving}
                    className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                >
                    <ChevronUp className="w-3 h-3" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                    disabled={isLast || saving}
                    className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                >
                    <ChevronDown className="w-3 h-3" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(chapter.id); }}
                    disabled={saving}
                    className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 disabled:opacity-20 transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

// Main Course Editor
export function TeacherCourseEditor({ course, chapters: initialChapters, enrollmentCount }) {
    const router = useRouter();
    const [chapters, setChapters] = useState(initialChapters);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [saving, setSaving] = useState(false);

    // Course edit state
    const [courseTitle, setCourseTitle] = useState(course.title);
    const [courseDesc, setCourseDesc] = useState(course.description ?? '');
    const [coursePrice, setCoursePrice] = useState(String(course.price ?? 0));
    const [isPublished, setIsPublished] = useState(course.is_published ?? false);
    const [editingCourse, setEditingCourse] = useState(false);

    // Chapter edit state
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterDesc, setChapterDesc] = useState('');

    const selectChapter = (ch) => {
        setSelectedChapter(ch);
        setChapterTitle(ch.title);
        setChapterDesc(ch.description ?? '');
    };

    const addChapter = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/chapters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: course.id,
                    title: `Lecture ${chapters.length + 1}`,
                    position: chapters.length,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error();
            const newChapter = {
                id: data.id,
                title: `Lecture ${chapters.length + 1}`,
                description: null,
                position: chapters.length,
                mux_playback_id: null,
            };
            setChapters((prev) => [...prev, newChapter]);
            selectChapter(newChapter);
            toast.success('Lecture added');
            router.refresh();
        } catch {
            toast.error('Failed to add lecture');
        } finally {
            setSaving(false);
        }
    };

    const updateChapter = async () => {
        if (!selectedChapter) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/chapters/${selectedChapter.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: chapterTitle, description: chapterDesc }),
            });
            if (!res.ok) throw new Error();
            setChapters((prev) =>
                prev.map((c) =>
                    c.id === selectedChapter.id ? { ...c, title: chapterTitle, description: chapterDesc } : c
                )
            );
            setSelectedChapter({ ...selectedChapter, title: chapterTitle, description: chapterDesc });
            toast.success('Lecture updated');
            router.refresh();
        } catch {
            toast.error('Failed to update lecture');
        } finally {
            setSaving(false);
        }
    };

    const deleteChapter = async (id) => {
        if (!confirm('Delete this lecture?')) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/chapters/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setChapters((prev) => prev.filter((c) => c.id !== id));
            if (selectedChapter?.id === id) setSelectedChapter(null);
            toast.success('Lecture deleted');
            router.refresh();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    const moveChapter = async (index, dir) => {
        const newChapters = [...chapters.sort((a, b) => a.position - b.position)];
        const target = dir === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= newChapters.length) return;
        [newChapters[index], newChapters[target]] = [newChapters[target], newChapters[index]];
        newChapters.forEach((c, i) => (c.position = i));
        setChapters([...newChapters]);
        setSaving(true);
        try {
            for (const ch of newChapters) {
                await fetch(`/api/chapters/${ch.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ position: ch.position }),
                });
            }
            router.refresh();
        } catch {
            toast.error('Failed to reorder');
        } finally {
            setSaving(false);
        }
    };

    const saveCourse = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/courses/${course.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: courseTitle,
                    description: courseDesc || null,
                    price: parseFloat(coursePrice) || 0,
                    is_published: isPublished,
                }),
            });
            if (!res.ok) throw new Error();
            toast.success('Course settings saved');
            setEditingCourse(false);
            router.refresh();
        } catch {
            toast.error('Failed to save course');
        } finally {
            setSaving(false);
        }
    };

    const sortedChapters = [...chapters].sort((a, b) => a.position - b.position);

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <BookOpen className="w-7 h-7 text-violet-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <h1 className="text-xl font-bold text-white">{course.title}</h1>
                                <p className="text-sm text-white/40 mt-0.5">{course.description || 'No description'}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {isPublished ? 'Published' : 'Draft'}
                                </span>
                                <button
                                    onClick={() => setEditingCourse(!editingCourse)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors"
                                >
                                    <Edit3 className="w-3 h-3" /> Edit
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
                            <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> {chapters.length} lectures</span>
                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {enrollmentCount} students</span>
                            <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> ${course.price}</span>
                        </div>
                    </div>
                </div>

                {/* Course Edit Form */}
                {editingCourse && (
                    <div className="border-t border-white/5 p-5 space-y-4 bg-white/3">
                        <h3 className="text-sm font-semibold text-white/70">Course Settings</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="text-xs font-medium text-white/50 block mb-1.5">Course Title</label>
                                <input
                                    value={courseTitle}
                                    onChange={(e) => setCourseTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-colors"
                                    placeholder="Course title..."
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-medium text-white/50 block mb-1.5">Description</label>
                                <textarea
                                    value={courseDesc}
                                    onChange={(e) => setCourseDesc(e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                                    placeholder="Describe your course..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-white/50 block mb-1.5">Price (USD)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={coursePrice}
                                    onChange={(e) => setCoursePrice(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div
                                        onClick={() => setIsPublished(!isPublished)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${isPublished ? 'bg-emerald-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isPublished ? 'left-6' : 'left-1'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{isPublished ? 'Published' : 'Draft'}</p>
                                        <p className="text-xs text-white/40">{isPublished ? 'Visible to students' : 'Hidden from students'}</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={saveCourse}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingCourse(false)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Lectures & Upload */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Lecture List */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">Lectures</h2>
                        <button
                            onClick={addChapter}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Add Lecture
                        </button>
                    </div>

                    {sortedChapters.length > 0 ? (
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-2 space-y-1">
                            {sortedChapters.map((ch, i) => (
                                <ChapterItem
                                    key={ch.id}
                                    chapter={ch}
                                    index={i}
                                    isSelected={selectedChapter?.id === ch.id}
                                    onSelect={selectChapter}
                                    onDelete={deleteChapter}
                                    onMoveUp={() => moveChapter(i, 'up')}
                                    onMoveDown={() => moveChapter(i, 'down')}
                                    isFirst={i === 0}
                                    isLast={i === sortedChapters.length - 1}
                                    saving={saving}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                            <Video className="w-8 h-8 text-white/20 mx-auto mb-2" />
                            <p className="text-sm text-white/40">No lectures yet</p>
                            <button
                                onClick={addChapter}
                                className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                Add your first lecture →
                            </button>
                        </div>
                    )}
                </div>

                {/* Chapter Editor / Upload Area */}
                <div className="lg:col-span-3">
                    {selectedChapter ? (
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-white">Edit Lecture</h3>
                                    <span className="text-xs text-white/30">Lecture {sortedChapters.findIndex(c => c.id === selectedChapter.id) + 1}</span>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-white/50 block mb-1.5">Lecture Title</label>
                                    <input
                                        value={chapterTitle}
                                        onChange={(e) => setChapterTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
                                        placeholder="Lecture title..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-white/50 block mb-1.5">Description (optional)</label>
                                    <textarea
                                        value={chapterDesc}
                                        onChange={(e) => setChapterDesc(e.target.value)}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                                        placeholder="What will students learn in this lecture?"
                                    />
                                </div>

                                <button
                                    onClick={updateChapter}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    Save Lecture
                                </button>
                            </div>

                            {/* Video Upload */}
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
                                <div>
                                    <h3 className="font-semibold text-white">Upload Video</h3>
                                    <p className="text-xs text-white/40 mt-0.5">Upload the video for this lecture</p>
                                </div>
                                <LectureUpload
                                    chapterId={selectedChapter.id}
                                    hasVideo={!!selectedChapter.mux_playback_id}
                                    onComplete={() => {
                                        setChapters((prev) =>
                                            prev.map((c) =>
                                                c.id === selectedChapter.id ? { ...c, mux_playback_id: 'pending' } : c
                                            )
                                        );
                                        setSelectedChapter({ ...selectedChapter, mux_playback_id: 'pending' });
                                        router.refresh();
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
                            <Video className="w-12 h-12 text-white/15 mb-3" />
                            <p className="text-white/40 font-medium">Select a lecture to edit</p>
                            <p className="text-white/25 text-sm mt-1">Or add a new lecture to get started</p>
                            <button
                                onClick={addChapter}
                                disabled={saving}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-sm rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Lecture
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
