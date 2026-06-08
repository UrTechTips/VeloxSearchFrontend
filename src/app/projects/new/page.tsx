"use client";

import styles from './page.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebaseConfig';

const New = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const user = await auth.currentUser;

    try {
      const token = await user?.getIdToken();
      
      if (!token) {
        console.error("No active session token found.");
        return;
      }

      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

      const res = await fetch(`${backendURL}/dataset/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }, 
        body: JSON.stringify({
          database_name: name,
          description: desc
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Failed to create project:", data);
        return;
      }
      const datasetId = data.dataset_id;
      router.push(`/projects/upload?datasetId=${datasetId}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }

  return (
    <div className={styles.container}>
        <h1>Create a new project</h1>

        <div className={styles.infoInput}>
            <label htmlFor="projectName">Project Name:</label>
            <input 
              type="text" 
              id="projectName" 
              placeholder="Enter project name" 
              value={name}
              onChange={(e) => setName(e.target.value)} // Bind state
            />
            
            <label htmlFor="projectDescription">Project Description:</label>
            <textarea 
              id="projectDescription" 
              placeholder="Enter project description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}/>
            
            <button type="submit" onClick={handleCreate}>Create Project</button>
        </div>
    </div>
  );
}

export default New;