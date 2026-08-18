'use client';

import { Dataset } from '@/types/dataset';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './DatasetList.module.scss';

interface Props {
    datasets: Dataset[];
}

const INDEX_STATUS_COLORS: Record<string, string> = {
    indexed: '#16843e',
    queued: '#f59e0b',
    failed: '#ef4444',
    uploaded: '#2563eb',
    created: '#94a3b8',
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

export default function DatasetList({ datasets }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filtered = datasets.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className={styles.topBar}>
                <input
                    type="text"
                    placeholder="Search datasets..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button
                    className={styles.createBtn}
                    onClick={() => router.push('/projects/new')}
                >
                    + New Dataset
                </button>
            </div>

            <div className={styles.datasets}>
                {filtered.length === 0 && (
                    <p className={styles.empty}>No datasets found.</p>
                )}
                {filtered.map((dataset) => (
                    <div
                        key={dataset.id}
                        className={styles.card}
                        onClick={() => router.push(`/projects/${dataset.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && router.push(`/projects/${dataset.id}`)}
                    >
                        <div className={styles.cardHeader}>
                            <h3>{dataset.name}</h3>
                            <span
                                className={styles.indexBadge}
                                style={{ '--badge-color': INDEX_STATUS_COLORS[dataset.index_status] ?? '#505966' } as React.CSSProperties}
                            >
                                {dataset.index_status.replace('_', ' ')}
                            </span>
                        </div>

                        {dataset.description && (
                            <p className={styles.desc}>{dataset.description}</p>
                        )}

                        <div className={styles.cardMeta}>
                            <span>{dataset.length.toLocaleString()} records</span>
                            <span>Updated {formatDate(dataset.updated_at)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}