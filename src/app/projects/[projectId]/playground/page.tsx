"use client";
import React, { useState } from 'react'
import styles from "./page.module.scss";
import CodeBlock from '@/components/CodeBlock/CodeBlock.component';

const Playground = () => {
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);

  const [response, setResponse] = useState(null);

  const handleRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    try {
        const res = await fetch(`${BACKEND_URL}/search/query?query=${encodeURIComponent(query)}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            console.log('API request failed:', data.error || 'Unknown error');
        }
        console.log('API response:', data);
        setResponse(data);
    } catch (error)  {
        console.error('Error making API request:', error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.playground}>
        <div className={styles.requestUi}>
            <h1>Playground</h1>
            <p className={styles.subtitle}>Test your API endpoints here!</p>
            <div className={styles.requestForm}>
              <select value={apiKey} onChange={(e) => setApiKey(e.target.value)}>
                <option value="search">Search</option>
              </select>
              <input type="text" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <input type="text" placeholder="Query" value={query} onChange={(e) => setQuery(e.target.value)} />
              <input type="number" placeholder="Limit" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} />
              <button onClick={handleRequest}>Send Request</button>
            </div>
        </div>
        <div className={styles.code}>
            <h1>Code snippet</h1>
            <p className={styles.subtitle}>Copy and use this code in your project</p>

            <div className={styles.codeSnippet}>
                <CodeBlock apiKey={apiKey} query={query} limit={limit} response={response} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Playground