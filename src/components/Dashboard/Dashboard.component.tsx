"use client"
import React from 'react'
import styles from './Dashboard.module.scss'

const Dashboard = ({ metadata } : { metadata : any}) => {
    const handleClick = async () => {}

    return (
        <>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{metadata.name}</h1>
                    <p className={styles.description}>{metadata.description}</p>
                </div>
                <button className={styles.button} onClick={handleClick}>Re-Index</button>
            </div>
            <div className={styles.statsBar}>
                <div className={styles.stat}>
                    <h1 className={styles.heading}>Total Documents:</h1>
                    <div className={styles.value}>
                        <h2>{metadata.length}</h2>
                        <p>Documents</p>
                    </div>
                </div>
                <div className={styles.stat}>
                    <h1 className={styles.heading}>Usage Rate:</h1>
                    <div className={styles.value}>
                        <h2>{metadata.usage_rate ? metadata.usage_rate : '0'}</h2>
                        <p>Requests<small> </small>/<small> </small> min</p>
                    </div>
                </div>
                <div className={styles.stat}>
                    <h1 className={styles.heading}>Usage Quota:</h1>
                    <div className={styles.value}>
                        <h2>{metadata.usage_quota ? metadata.usage_quota : '0'}</h2>
                        <p>Requests<small> </small>/<small> </small> day</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard