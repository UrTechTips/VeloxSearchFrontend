'use server';
import { cookies } from "next/headers";

export async function createAuthSession(idToken: string) {
    const cookieStore = await cookies();

    cookieStore.set('__session', idToken, {
        maxAge: 60 * 60 * 24 * 5,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    console.log("Auth session created with token:", idToken); // Debug log
}

export async function clearAuthSession() {
    const cookieStore = await cookies();
    cookieStore.delete("__session");
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('__session')?.value || null;
}