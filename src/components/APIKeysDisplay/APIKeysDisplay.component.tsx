"use client";
import React from 'react'
import styles from "./APIKeysDisplay.module.scss";
import { useRouter } from 'next/navigation';
import { auth } from "@/config/firebaseConfig";
import { toast } from 'react-toastify/unstyled';

const APIKeysDisplay = ({ apiKeys, datasetId }: { apiKeys: any[]; datasetId: string }) => {
    const router = useRouter();
    const handleCreateAPIKey = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error("You must be logged in to create an API key. Please log in and try again.");
            router.push("/auth/login");
            return;
        }
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const token = await user.getIdToken();
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
                {apiKeys.map((key) => (
                    <div className={styles.apiKeyItem} key={key.id}>
                        <div className={styles.apiKeyInfo}>
                            <span className={styles.apiKeyName}>{key.name}</span>
                            <span className={styles.apiKeyValue}>{key.api_key}</span>
                        </div>
                        <div className={styles.apiKeyActions}>
                            <button className={styles.viewButton}>View</button>
                            <button className={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default APIKeysDisplay;