"use client";
import Navbar from '@/components/Navbar/Navbar.component';
import styles from './page.module.scss';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth} from '@/config/firebaseConfig'
import {useRouter} from 'next/navigation'
import { createAuthSession } from "@/app/actions/auth";

const Login = () => {
    const router = useRouter();
    auth.languageCode = 'en';
    const provider = new GoogleAuthProvider();
    const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log(`User signed in: ${user.displayName} (${user.email}), UID: ${user.uid}`);
            const firebaseIdToken = await user.getIdToken();
            const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

            const response = await fetch(`${backendURL}/users/registered`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseIdToken}`
                },
                body: JSON.stringify({
                    uid: user.uid,
                })
            });
            const data = await response.json();

            if (!response.ok || !data.registered) {
                alert("Your account is not registered. Please contact the administrator.");
                await auth.signOut();
                router.push("/auth/register");
                return;
            }
            await createAuthSession(firebaseIdToken);
            router.push("/dashboard/projects");
        } catch (error) {
            console.error(`Google sign-in error: ${error}`);
        }
    }

    return (
        <>
            <Navbar loggedIn={false} />
            <div className={styles.container}>
                <h1>Login</h1>
                <p>Notice: Only Google authentication is available at the moment.</p>
                {/* Just a google auth for now */}
                <button className={styles.googleButton} onClick={handleGoogleSignIn}>
                    Login with Google
                </button>
            </div>
        </>
    )
}

export default Login