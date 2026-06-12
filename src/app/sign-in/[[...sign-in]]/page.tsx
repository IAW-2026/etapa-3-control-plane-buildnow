'use client';

import { SignIn, useAuth } from '@clerk/nextjs';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-primary">
            BuildNow Control Plane
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Administrá la plataforma desde un único lugar.
          </p>
        </div>
      </div>

      <SignIn
        routing="hash"
        appearance={{
          elements: {
            header: 'hidden',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
          },
        }}
      />
    </main>
  );
}