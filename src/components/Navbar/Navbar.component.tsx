"use client";

import styles from './Navbar.module.scss'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const supabase = createClient();  
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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