'use client';

export const dynamic = 'force-dynamic';



import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchResumes();
      fetchCoverLetters();
    }
  }, [session]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resume/list');
      const data = await response.json();
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Failed to fetch resumes');
    }
  };

  const fetchCoverLetters = async () => {
    try {
      const response = await fetch('/api/cover-letter/list');
      const data = await response.json();
      if (data.success) {
        setCoverLetters(data.coverLetters);
      }
    } catch (error) {
      console.error('Failed to fetch cover letters');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              ResumeAI
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{session?.user?.name || session?.user?.email}</span>
              <Link
                href="/dashboard/settings"
                className="text-gray-500 hover:text-gray-700"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/dashboard/resume/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            + New Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Resumes</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{resumes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Cover Letters</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{coverLetters.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Plan</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2 capitalize">Free</p>
          </div>
        </div>

        {/* Recent Resumes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Resumes</h2>
            <Link href="/dashboard/resume/list" className="text-primary-600 hover:underline">
              View All
            </Link>
          </div>
          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No resumes yet</p>
              <Link
                href="/dashboard/resume/new"
                className="text-primary-600 hover:underline"
              >
                Create your first resume
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.slice(0, 5).map((resume: any) => (
                <div
                  key={resume._id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-semibold">{resume.title || 'Untitled Resume'}</h3>
                    <p className="text-sm text-gray-500">
                      {resume.personalInfo?.fullName || 'No name'} • Last updated: {' '}
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/resume/${resume._id}`}
                      className="text-primary-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/resume/new"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">Create New Resume</h3>
            <p className="text-gray-600">
              Build a new ATS-optimized resume from scratch
            </p>
          </Link>
          <Link
            href="/dashboard/cover-letter/new"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">Generate Cover Letter</h3>
            <p className="text-gray-600">
              Create a tailored cover letter for any job
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
