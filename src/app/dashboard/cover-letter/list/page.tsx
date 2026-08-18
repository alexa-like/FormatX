'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CoverLetterListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const fetchCoverLetters = async () => {
    try {
      const response = await fetch('/api/cover-letter/list');
      const data = await response.json();
      if (data.success) {
        setCoverLetters(data.coverLetters);
      }
    } catch (error) {
      console.error('Failed to fetch cover letters');
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">My Cover Letters</h1>
          <Link
            href="/dashboard/cover-letter/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            + New Cover Letter
          </Link>
        </div>

        {coverLetters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No cover letters yet</p>
            <Link
              href="/dashboard/cover-letter/new"
              className="text-primary-600 hover:underline"
            >
              Generate your first cover letter
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {coverLetters.map((letter: any) => (
              <div
                key={letter._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{letter.jobTitle}</h3>
                    <p className="text-gray-600">{letter.company}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(letter.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm capitalize">
                    {letter.tone}
                  </span>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {letter.content?.substring(0, 200)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
