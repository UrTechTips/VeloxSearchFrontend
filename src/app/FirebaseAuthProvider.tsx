'use client';
import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { createAuthSession, clearAuthSession } from '@/app/actions/auth';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const { token, expirationTime } = await user.getIdTokenResult();

        const expiresAt = new Date(expirationTime).getTime();
        const isExpired = expiresAt < Date.now();

        // Only force-refresh if the token is actually stale
        const freshToken = isExpired
          ? await user.getIdToken(true)
          : token;

        await createAuthSession(freshToken);
      } else {
        await clearAuthSession();
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}