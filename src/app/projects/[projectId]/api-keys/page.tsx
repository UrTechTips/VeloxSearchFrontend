import APIKeysDisplay from '@/components/APIKeysDisplay/APIKeysDisplay.component';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { toast } from 'react-toastify/unstyled';
import styles from "./page.module.scss";

const ApiKeys = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);

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
        toast.error("Error fetching API keys. Please try again later.");
    }

  return (
    <div className={styles.container}>
        <APIKeysDisplay apiKeys={apiKeys} datasetId={projectId} />
    </div>
  )
}

export default ApiKeys