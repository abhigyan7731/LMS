'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, BookOpen, DollarSign, FileText, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export function TeacherCourseForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('0');
    const [isPublished, setIsPublished] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) { toast.error('Course title is required'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    price: parseFloat(price) || 0,
                    is_published: isPublished,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create course');
            toast.success('Course created! Now add your lectures.');
            router.push(`/teacher/courses/${data.id}`);
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        {
            id: 'title', label: 'Course Title', icon: BookOpen, required: true,
            render: () => (
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Complete Web Development Bootcamp"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-colors"
                />
            ),
        },
        {
            id: 'description', label: 'Description', icon: FileText, required: false,
            render: () => (
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="What will students learn? Describe your course..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                />
            ),
        },
        {
            id: 'price', label: 'Price (USD)', icon: DollarSign, required: false,
            render: () => (
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">$</span>
                    <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                </div>
            ),
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-5">
                {fields.map((field) => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                            <field.icon className="w-3.5 h-3.5" />
                            {field.label}
                            {field.required && <span className="text-red-400 text-xs">*</span>}
                        </label>
                        {field.render()}
                    </div>
                ))}

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Publish Immediately</p>
                            <p className="text-xs text-white/40">Make this course visible to students</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublished(!isPublished)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isPublished ? 'bg-emerald-500' : 'bg-white/10'}`}
                    >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isPublished ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                    ) : (
                        <><BookOpen className="w-4 h-4" /> Create Course</>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium rounded-xl transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
