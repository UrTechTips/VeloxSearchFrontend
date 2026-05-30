"use client";
import Navbar from '@/components/Navbar/Navbar.component';
import styles from './page.module.scss';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth} from '@/config/firebaseConfig'
import { useRouter } from 'next/navigation'

const Register = () => {
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

            const response = await fetch(`${backendURL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseIdToken}`
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName
                })
            });
            const data = await response.json();
            console.log(`Backend response: ${JSON.stringify(data)}`);

            if (!response.ok || !data.success) {
                alert("Registration failed. Please try again.");
                await auth.signOut();
                return;
            }

            console.log("User registered successfully.");
            router.push("/dashboard/projects");
        } catch (error) {
            console.error(`Google sign-in error: ${error}`);
        }
    }

    return (
        <>
            <Navbar loggedIn={false} />
            <div className={styles.container}>
                <h1>Register</h1>
                <p>Notice: Only Google authentication is available at the moment.</p>
                {/* Just a google auth for now */}
                <button className={styles.googleButton} onClick={handleGoogleSignIn}>
                    Register with Google
                </button>
            </div>
        </>
    )
}

export default Register