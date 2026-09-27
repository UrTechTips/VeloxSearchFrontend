"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify/unstyled";
import styles from "./page.module.scss";

const Index = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [started, setStarted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [closed, setClosed] = useState(false);

    const handleStart = async () => {
        const datasetId = searchParams.get("datasetId");
        if (!datasetId) {
            toast.error("Dataset ID is missing");
            router.back();
            return;
        }
        const supabase = createClient();
        if (!supabase.auth.getSession()) {
            toast.error("You must be logged in to index a dataset");
            window.location.href = "/auth/login";
            return;
        }
        try {
            const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const ws = new WebSocket(`${BACKEND_URL.replace(/^http/, "ws")}/index/`);

            ws.onopen = () => {
                ws.send(JSON.stringify({ token, id: datasetId }));
            }

            ws.onmessage = (event: MessageEvent) => {
                const message = JSON.parse(event.data).message;
                console.log("Received message:", message);
                setLogs((prevLogs) => [...prevLogs, message]);
                setProgress(message.progress);
            }

            ws.onerror = (error) => {
                // Print why error happened Like error message or something
                console.log("WebSocket error:", error);
                toast.error("An error occurred while connecting to the indexing service. Please try again later.");
            }

            ws.onclose = () => {
                console.log("WebSocket connection closed");
                setClosed(true);
            }
            
            setStarted(true);
        } catch (error) {
            toast.error("An error occurred while starting the indexing process. Please try again later.");
            console.error("Error starting indexing:", error);
        }
    };
    return (
        <div className={styles.container}>
            <h1>Indexing the dataset</h1>
            <p className={styles.subtitle}>Index your dataset to improve search performance.</p>
            {started ? (
                <div className={styles.indexConsole}>
                    <div className={styles.progress}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    </div>
                    {logs.map((log, index) => (
                        <span className={styles.log} key={index}>
                            {log}
                        </span>
                    ))}
            </div>
            ) : (
                <button className={styles.startButton} onClick={handleStart}>Start Indexing</button>
            )}
            {closed && <button className={styles.nextButton} onClick={() => router.push("/dashboard/projects")}>Go to Projects</button>}
        </div>
    )
}

export default Index