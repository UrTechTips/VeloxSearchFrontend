"use client";
import { useState } from "react";
import styles from './page.module.scss';
import { toast } from 'react-toastify';
import { createClient } from '@/lib/supabase/client';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const RegisterContainer = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();
            const {data, error} = await supabase.auth.signUp({ email, password });

            if (error) {
                throw new Error(error?.message || "Authentication failed.");
            }

            if (data.session) {
                const redirect = searchParams.get("redirectTo") || "/dashboard/projects";
                router.push(redirect);
                router.refresh();
            } else {
                setCheckEmail(true);
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred during registration.");
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

    if (checkEmail) {
        return (
            <div className={styles.container}>
                <h1>Check Your Email</h1>
                <p>We've sent a confirmation email to {email}. Please check your inbox and follow the instructions to complete your registration.</p>
                <Link href="/auth/login">Back to Login</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Register</h1>
            <p>Register to access your account.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <input 
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <button onClick={() => handleOauth("Google")}>Continue with Google</button>
            <p>
                Already have an account? <Link href="/auth/login">Login here</Link>
            </p>
        </div>
    )
}

export default RegisterContainer