"use client";
import Navbar from "@/components/Navbar/Navbar.component";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  const handleGetStarted = () => {
    router.push("/auth/register");
  }

  return (
    <>
    <Navbar loggedIn={false} />
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Velox Search</h1>
        <p>A simple to use and efficient search engine for your documents.</p>
        <div className={styles.cta}>
          <button className={styles.button} onClick={handleGetStarted}>Get Started</button>
          <button className={styles.button + ' ' + styles.secondary}>Learn More</button>
        </div>
      </div>
    </div>
    </>
  );
}
