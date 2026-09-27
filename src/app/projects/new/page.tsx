"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify/unstyled';
import styles from './page.module.scss';

const New = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const supabase = createClient();

    try {
      const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);

      if (!token) {
        toast.error("You must be logged in to create a project. Please log in and try again.");
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
        toast.error(data.message || "Failed to create project. Please try again later.");
        console.error("Failed to create project:", data);
        return;
      }
      const datasetId = data.dataset_id;
      router.push(`/projects/upload?datasetId=${datasetId}`);
    } catch (error) {
      toast.error("Failed to create project. Please try again later."); 
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
            
            <button className={styles.createButton} type="submit" onClick={handleCreate}>Create Project</button>
        </div>
    </div>
  );
}

export default New;