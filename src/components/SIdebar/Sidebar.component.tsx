"use client";
import { usePathname, useRouter } from 'next/navigation';
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);
  const active = pathParts[2] || 'dashboard';
  return (
    <div className={styles.container}>
        <div className={`${styles.element} ${active === 'dashboard' ? styles.active : ''}`}
          onClick={() => router.push(`${pathname.split("/").slice(0, 3).join("/")}/`)}>
          <span>Dashboard</span>
        </div>
        <div className={`${styles.element} ${active === 'api-keys' ? styles.active : ''}`}
          onClick={() => router.push(`${pathname.split("/").slice(0, 3).join("/")}/api-keys`)}>
          <span>Api Keys</span>
        </div>
        <div className={`${styles.element} ${active === 'playground' ? styles.active : ''}`}
          onClick={() => router.push(`${pathname.split("/").slice(0, 3).join("/")}/playground`)}>
          <span>Playground</span>
        </div>
        <div className={`${styles.element} ${active === 'settings' ? styles.active : ''}`}
          onClick={() => router.push(`${pathname.split("/").slice(0, 3).join("/")}/settings`)}>
          <span>Settings</span>
        </div>
    </div>
  )
}

export default Sidebar