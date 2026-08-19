'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
            <p className="text-gray-600">{message}</p>
            <Link href="/login" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
              Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
            <p className="text-gray-600">{message}</p>
            <Link href="/login" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
              Go to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
