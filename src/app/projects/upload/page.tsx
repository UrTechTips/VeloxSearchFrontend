"use client";
import React, { useState } from 'react'
import styles from './page.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import FileUploadComponent from '@/components/FileUpload/FileUpload';
import { auth } from '@/config/firebaseConfig';

interface UploadedFile {
  file: File;
  name: string;
  type: string;
  size: number;
}

const Upload = () => {
    const [file, setFile] = useState<UploadedFile | null>(null);    
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const handleNext = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const datasetId = searchParams.get('datasetId');
        const user = await auth.currentUser;

        if (!file) {
            alert('Please upload a dataset before proceeding.');
            return;
        }
        if (!datasetId) {
            alert('Dataset ID is missing. Please go back and select a dataset.');
            router.back();
            return;
        }
        
        try {
            const token = await user?.getIdToken();
            if (!token) {
                alert('You must be logged in to upload a dataset.');
                window.location.href = '/auth/login';
            }
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('id', datasetId);
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${BACKEND_URL}/dataset/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })
            const data = await res.json();
            if (!res.ok || !data.success) {
                console.error('Upload failed:', data);
                return;
            }
            router.push(`/projects/config?datasetId=${datasetId}`);
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    }

    return (
        <div className={styles.container}>
            <h1>Upload your dataset</h1>
            <h4>Drag and drop your dataset or paste your dataset</h4>
            <div className={styles.dragAndDrop}>
                <FileUploadComponent file={file} setFile={setFile} />
            </div>
            <div className={styles.seperator}></div>
            <div className={styles.paste}></div>
            <button className={styles.nextButton} onClick={handleNext}>Next</button>
        </div>
    )
}

export default Upload