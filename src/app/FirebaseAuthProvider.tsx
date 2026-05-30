'use client';
import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { createAuthSession, clearAuthSession } from '@/app/actions/auth';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await createAuthSession(token);
      } else {
        await clearAuthSession();
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}