"use client";

import styles from './page.module.scss';
import { useState } from 'react';
import { getAuthToken } from '@/app/actions/auth'; // Import the server action

const New = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const token = await getAuthToken();
      
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
      console.log(data);
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