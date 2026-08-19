'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const user = session?.user as any;
  const isPro = user?.plan === 'pro';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/dashboard" className="text-2xl font-bold text-primary-600">ResumeAI</a>
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Back to Dashboard</a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{session?.user?.name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription</h2>
          <div className={`p-4 rounded-lg ${isPro ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </p>
                <p className="text-sm text-gray-600">
                  {isPro
                    ? 'Unlimited resume optimizations and cover letters'
                    : `${user?.creditsRemaining ?? 0} resume optimizations remaining this month`}
                </p>
              </div>
              {!isPro && (
                <Link
                  href="https://t.me/YourBotName?start=upgrade"
                  target="_blank"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Pro plan includes unlimited resume optimizations, cover letters, and priority support.
            Pay securely with Telegram Stars.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}
