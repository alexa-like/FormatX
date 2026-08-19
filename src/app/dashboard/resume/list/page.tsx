'use client';

export const dynamic = 'force-dynamic';



import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResumeListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resume/list');
      const data = await response.json();
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setResumes(resumes.filter((r: any) => r._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete resume');
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
            <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
              ResumeAI
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <Link
            href="/dashboard/resume/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            + New Resume
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No resumes yet</p>
            <Link
              href="/dashboard/resume/new"
              className="text-primary-600 hover:underline"
            >
              Create your first resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume: any) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {resume.title || 'Untitled Resume'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resume.personalInfo?.fullName || 'No name'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {resume.experience?.length || 0} experiences
                  </span>
                  <span>
                    {resume.skills?.length || 0} skills
                  </span>
                </div>
                {resume.atsScore && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">ATS Score: </span>
                    <span
                      className={`font-semibold ${
                        resume.atsScore >= 80
                          ? 'text-green-600'
                          : resume.atsScore >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {resume.atsScore}
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/resume/${resume._id}`}
                    className="flex-1 text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
