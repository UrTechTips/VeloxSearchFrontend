"use client"; // Marks this as a Client Component for interactivity

import styles from './Navbar.module.scss'
import Link from 'next/link'
import { auth } from '@/config/firebaseConfig';
import { clearAuthSession } from '@/app/actions/auth';

const Navbar = ({ loggedIn }: { loggedIn: boolean }) => {

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await clearAuthSession();
      
      window.location.href = '/auth/login';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/">
        <h1 className={styles.brand}>VeloxSearch</h1>
      </Link>
      <div className={styles.buttons}>
        {loggedIn ? (
          <>
            <Link href="/dashboard/projects" className={styles.link}>Projects</Link>
            {/* Added Logout Button */}
            <button onClick={handleLogout} className={styles.link}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className={styles.link}>Login</Link>
            <Link href="/auth/register" className={styles.link}>Get Started</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar;