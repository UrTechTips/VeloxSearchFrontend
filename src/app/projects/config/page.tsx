"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify/unstyled';
import { createClient } from '@/lib/supabase/client';

interface SchemaType {
    $schema: string;
    type: string;
    properties: Record<string, Record<string, any>>;
    required: string[];
}

const Config = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [schema, setSchema] = useState<SchemaType | null>(null);
    const [searchableFields, setSearchableFields] = useState<string[]>([]);
    const [semanticFields, setSemanticFields] = useState<string[]>([]);
    const [idField, setIdField] = useState<string>('');

    useEffect(() => {
        const fetchDatasetSchema = async () => {
            const datasetId = searchParams.get('datasetId');
            
            if (!datasetId) {
                alert('Dataset ID is missing. Please go back and select a dataset.');
                return;
            }
            try {
                const supabase = createClient();
                
                const {data: { session }, error} = await supabase.auth.getSession();
                if (!session || error) {
                    console.error('User not authenticated. Redirecting to login.');
                    return;
                }
                const token = session.access_token;
                const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                const res = await fetch(`${BACKEND_URL}/dataset/parse/${datasetId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok || !data.success) {
                    toast.error(data.message || "Failed to fetch dataset schema. Please try again later.");
                    console.error('Failed to fetch dataset schema:', data.message);
                    return;
                }
                setSchema(JSON.parse(data.schema));
            } catch (error) {
                toast.error("Error fetching dataset schema. Please try again later.");
                console.error('Error fetching dataset schema:', error);
            }
        }
        fetchDatasetSchema();
    }, [searchParams])

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const configJson = {
            id_field: idField,
            searchable_fields: searchableFields,
            vector_terms: semanticFields,
            length: 0, // Placeholder, backend can calculate this based on the dataset
        }
        const jsonString = JSON.stringify(configJson, null, 2);
        const datasetId = searchParams.get('datasetId');
        if (!datasetId) {
            alert('Dataset ID is missing. Please go back and select a dataset.');
            router.back();
        }
        
        try {
            const supabase = createClient();
            const {data: { session }, error} = await supabase.auth.getSession();
            if (!session || error) {
                alert('You must be logged in to save the configuration.');
                window.location.href = '/auth/login';
                return;
            }
            const token = session.access_token;
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${BACKEND_URL}/dataset/config`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: datasetId,
                    config: jsonString,
                }),
            })

            const data = await res.json();
            if (!res.ok || !data.success) {
                toast.error(data.message || "Failed to save configuration. Please try again later.");
                console.error('Failed to save configuration:', data);
                return;
            }
            router.push(`/projects/index?datasetId=${datasetId}`);
        } catch (error) {
            toast.error("Error saving configuration. Please try again later.");
            console.error('Error saving configuration:', error);
        }
    }

    return (
        <div className={styles.container}>
            <h1>Project Configuration</h1>
            <p className={styles.subtitle}>Configure how each field is indexed and queried.</p>
            <div className={styles.schema}>
                <div className={`${styles.fieldContainer} ${styles.headerRow}`}>
                    <div className={styles.fieldInfo}>
                        <h3>Field</h3>
                    </div>
                    <div className={styles.checkboxContainer}>
                        <label>Semantic Search</label>
                        <label>Searchable</label>
                        <label>ID Field</label>
                    </div>
                </div>
                {schema && schema.required.map((field: string, index: number) => (
                    <div key={index} className={styles.fieldContainer}>
                        <div className={styles.fieldInfo}>
                            <h4>{field}</h4>
                            <span className={styles.tag}>{schema.properties[field].type}</span>
                        </div>
                        <div className={styles.checkboxContainer}>
                            <input 
                                type="checkbox" 
                                name={`${field}-semantic`} 
                                checked={semanticFields.includes(field)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSemanticFields([...semanticFields, field]);
                                    } else {
                                        setSemanticFields(semanticFields.filter(f => f !== field));
                                    }
                                }}
                            />
                            <input 
                                type="checkbox" 
                                name={`${field}-searchable`} 
                                checked={searchableFields.includes(field)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSearchableFields([...searchableFields, field]);
                                    } else {
                                        setSearchableFields(searchableFields.filter(f => f !== field));
                                    }
                                }}
                            />
                            <input
                                type="radio"
                                name="id-field"
                                value={field}
                                checked={idField === field}
                                onChange={(e) => setIdField(e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button className={styles.saveButton} onClick={handleSave}>Next →</button>
        </div>
    )
}

export default Config