"use client";
import { createClient } from '@/lib/supabase/client';
import Link from "next/link";
import { RedirectType, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-toastify';
import styles from './page.module.scss';

const loginContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { data: { session, user }, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError || !session) {
        throw new Error(authError?.message || "Authentication failed.");
      }

      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendURL}/users/registered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ uid: user.id })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.registered) {
        await supabase.auth.signOut();
        toast.error("Your account is not registered. Please register before logging in.");
        router.push("/auth/register");
        return;
      }

      const redirect = searchParams.get("redirectTo") || "/dashboard/projects";
      router.push(redirect);
      router.refresh();

    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleOauth = async (provider: string) => {
    setLoading(true);
    try {
      const redirect = searchParams.get("redirectTo") || "/dashboard/projects";
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`
        }
      });

      if (error) {
        throw new Error(error.message || "OAuth login failed.");
      }

      router.push(redirect);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <p>Welcome back! Please enter your details to log in.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <button onClick={() => handleOauth("Google")}>Continue with Google</button>
      <p>
        Don't have an account? <Link href="/auth/register">Register</Link>
      </p>
    </div>
  )
}

export default loginContainer