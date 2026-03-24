'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Upload, Video, X, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadLecturePage() {
    const router = useRouter();
    const { user } = useUser();
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [courseId, setCourseId] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [courses, setCourses] = useState([]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setSelectedFile(file);
        } else {
            toast.error('Please select a valid video file');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !courseId || !chapterTitle) {
            toast.error('Please fill all fields and select a video');
            return;
        }

        setUploading(true);
        try {
            // Create form data
            const formData = new FormData();
            formData.append('video', selectedFile);
            formData.append('courseId', courseId);
            formData.append('title', chapterTitle);
            formData.append('userId', user.id);

            // Upload to API
            const res = await fetch('/api/mux/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Lecture uploaded successfully!');
                router.push(`/teacher/courses/${courseId}`);
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch (error) {
            toast.error('Upload failed. Please try again.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Upload Lecture Video</h1>
                <p className="text-white/50">Add video content to your courses</p>
            </div>

            {/* Upload Form */}
            <div className="space-y-6">
                {/* Course Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Select Course</label>
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="">Choose a course...</option>
                        <option value="demo-course-1">Demo Course 1</option>
                        <option value="demo-course-2">Demo Course 2</option>
                    </select>
                </div>

                {/* Chapter Title */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Chapter Title</label>
                    <input
                        type="text"
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                        placeholder="e.g., Introduction to React Hooks"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Video File</label>
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            selectedFile
                                ? 'border-violet-500 bg-violet-500/10'
                                : 'border-white/10 hover:border-white/20'
                        }`}
                    >
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                            <Video className="w-12 h-12 text-white/40 mx-auto mb-4" />
                            {selectedFile ? (
                                <div className="space-y-2">
                                    <p className="text-white font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-white/50">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedFile(null);
                                        }}
                                        className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto"
                                    >
                                        <X className="w-3 h-3" /> Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-white/60">
                                        Click to select a video or drag and drop
                                    </p>
                                    <p className="text-xs text-white/40">
                                        MP4, MOV, AVI up to 2GB
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile || !courseId || !chapterTitle}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                        uploading || !selectedFile || !courseId || !chapterTitle
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25'
                    }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading & Processing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload Lecture
                        </>
                    )}
                </button>

                {/* Info */}
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 space-y-2">
                    <p className="text-sm text-blue-300">
                        <strong>Note:</strong> Video uploads are processed automatically. After upload, the video will be available in your course immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
