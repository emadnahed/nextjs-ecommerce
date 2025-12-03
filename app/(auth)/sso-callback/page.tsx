'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function SSOCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const redirectUrl = searchParams.get('redirect_url') || '/';

    console.log('[SSO Callback] Handling redirect:', {
      isLoaded,
      userId,
      redirectUrl,
    });

    if (userId) {
      console.log('[SSO Callback] User authenticated, redirecting to:', redirectUrl);
      // Use window.location for hard navigation to ensure state is fresh
      window.location.href = redirectUrl;
    } else {
      console.log('[SSO Callback] No user, redirecting to sign-in');
      router.push('/sign-in');
    }
  }, [isLoaded, userId, searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
