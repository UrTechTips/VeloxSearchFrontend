"use client";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify/unstyled';
import styles from "./APIKeysDisplay.module.scss";

const APIKeysDisplay = ({ apiKeys, datasetId }: { apiKeys: any[]; datasetId: string }) => {
    const [viewingKey, setViewingKey] = useState<boolean[]>(new Array(apiKeys.length).fill(false));
    const router = useRouter();
    const handleCreateAPIKey = async () => {
        const supabase = createClient();
        if (!supabase.auth.getSession()) {
            toast.error("You must be logged in to create an API key. Please log in and try again.");
            router.push("/auth/login");
            return;
        }
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);
        const name = prompt("Enter a name for the new API key:");
        if (!name) {
            toast.error("API key name is required. Please enter a name and try again.");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/apikey/generate?name=${encodeURIComponent(name)}&dataset_id=${encodeURIComponent(datasetId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                console.log("Error response from server:", data);
                toast.error(data.message || "Failed to create API key. Please try again later.");
                return;
            }
            console.log(data);
            toast.success("API key created successfully.");
        } catch (error) {
            console.error("Error creating API key:", error);
            toast.error("An error occurred while creating the API key. Please try again later.");
        }
    }

    const handleDeleteAPIKey = async (apiKeyId: string) => {
        const supabase = createClient();
        const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);
        const confirmDelete = confirm("Are you sure you want to delete this API key? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/apikey/deactivate`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ api_key_id: apiKeyId }),
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success("API key deleted successfully.");
                router.refresh(); 
            } else {
                toast.error(`Failed to delete the API key: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting API key:", error);
            toast.error("Failed to delete the API key. Please try again.");
        }
    }
    return (
        <>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>API Keys</h1>
                    <p className={styles.subtitle}>Manage your API keys here. You can create, view, and delete your API keys as needed.</p>
                </div>
                <button className={styles.createButton} onClick={handleCreateAPIKey}>
                    Create New API Key
                </button>
            </div>

            <div className={styles.apiKeysList}>
                <div className={` ${styles.apiKeyItem} ${styles.headerRow}`}>
                    <div className={styles.apiKeyInfo}>
                        <span className={styles.apiKeyName}>API Key Name</span>
                        <span className={styles.apiKeyValue}>API Key Value</span>
                    </div>
                    <div className={styles.apiKeyActions}>
                        <span>Actions</span>
                    </div>
                </div>
                {apiKeys.map((key, index) => (
                    <div className={styles.apiKeyItem} key={key.id}>
                        <div className={styles.apiKeyInfo}>
                            <span className={styles.apiKeyName}>{key.name}</span>
                            <span className={styles.apiKeyValue}>
                                {viewingKey[index] ? key.api_key : '••••••••••••••••'}
                            </span>
                        </div>
                        <div className={styles.apiKeyActions}>
                            <button className={styles.viewButton} onClick={() => {
                                const newViewingKey = [...viewingKey];
                                newViewingKey[index] = !newViewingKey[index];
                                setViewingKey(newViewingKey);
                            }}>
                                {viewingKey[index] ? 'Hide' : 'View'}
                            </button>
                            <button className={styles.deleteButton} onClick={() => handleDeleteAPIKey(key.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default APIKeysDisplay;