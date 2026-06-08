import React from 'react'
import styles from "./page.module.scss";
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth-utils';
import APIKeysDisplay from '@/components/APIKeysDisplay/APIKeysDisplay.component';

const ApiKeys = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('__session')?.value;
    // const user = getUserFromToken(token!);

    let apiKeys: any[] = [];
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    try {
        const res = await fetch(`${backendURL}/apikey/list?dataset_id=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json();
        apiKeys = data.api_keys || [];
        console.log(data);
    } catch (err) {
        console.error("Error fetching API keys", err);
    }

  return (
    <div className={styles.container}>
        <APIKeysDisplay apiKeys={apiKeys} datasetId={projectId} />
    </div>
  )
}

export default ApiKeys