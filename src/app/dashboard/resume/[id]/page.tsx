'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResumeBuilder from '@/components/ResumeBuilder';
import ATSScore from '@/components/ATSScore';
import toast from 'react-hot-toast';

export default function EditResumePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (params.id) {
      fetchResume(params.id as string);
    }
  }, [params.id]);

  const fetchResume = async (id: string) => {
    try {
      const response = await fetch(`/api/resume/${id}`);
      const data = await response.json();

      if (data.success) {
        setResume(data.resume);
      } else {
        toast.error('Resume not found');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (resumeData: any) => {
    const response = await fetch(`/api/resume/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData),
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Resume updated!');
      return resumeData;
    } else {
      throw new Error(data.error);
    }
  };

  const handleOptimize = async () => {
    if (!resume?._id) {
      toast.error('Resume not loaded');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setOptimizing(true);
    try {
      const response = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resume._id,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Resume optimized!');
      } else {
        toast.error(data.error || 'Failed to optimize resume');
      }
    } catch (error) {
      toast.error('Failed to optimize resume');
    } finally {
      setOptimizing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/dashboard" className="text-2xl font-bold text-primary-600">
              ResumeAI
            </a>
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume Builder */}
          <div>
            <ResumeBuilder initialData={resume} onSave={handleSave} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ATS Score */}
            {resume?._id && (
              <ATSScore resumeId={resume._id} initialScore={resume.atsScore} />
            )}

            {/* AI Optimization */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">AI Optimization</h3>
              <p className="text-gray-600 text-sm mb-4">
                Paste a job description to optimize your resume for that specific position.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                placeholder="Paste the job description here..."
              />
              <button
                onClick={handleOptimize}
                disabled={optimizing}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                {optimizing ? 'Optimizing...' : 'Optimize for Job'}
              </button>
            </div>

            {/* Delete Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this resume?')) {
                    const response = await fetch(`/api/resume/${params.id}`, {
                      method: 'DELETE',
                    });

                    const data = await response.json();

                    if (data.success) {
                      toast.success('Resume deleted');
                      router.push('/dashboard');
                    } else {
                      toast.error('Failed to delete resume');
                    }
                  }
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
