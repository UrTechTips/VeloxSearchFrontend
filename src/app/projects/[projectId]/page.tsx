import React from 'react'
import styles from './page.module.scss'
import { cookies } from 'next/headers';

const ProjectDashboard = async ({ params }: { params: Promise<{ projectId: string }>}) => {
    const cookieStore = await cookies();
    const { projectId } = await params;
    const token = cookieStore.get('__session')?.value;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    console.log("TOKEN FOUND:", !!token); 
    console.log("PROJECT ID VALUE:", projectId);
    console.log("EXACT FETCH URL:", `${BACKEND_URL.replace(/\/$/, "")}/dataset/get/${projectId}`);
    const res = await fetch(`${BACKEND_URL}/dataset/get/${projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();
    console.log(data);
    const metadata = data.metadata?.metadata;
    return (
        <div className={styles.container}>
            {metadata ? <h1>{metadata.name}</h1> : <h1>Project not found</h1>}
        </div>
    )
}

export default ProjectDashboard