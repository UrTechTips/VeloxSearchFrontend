import styles from "./page.module.scss";
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth-utils';
import DatasetList from '@/components/DatasetList/DatasetList.component';
import { Dataset } from '@/types/dataset';
import { toast } from "react-toastify";

const Projects = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('__session')?.value;
    const user = getUserFromToken(token!);

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    let datasets: Dataset[] = [];
    try {
        const res = await fetch(`${backendURL}/dataset/list`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
            datasets = data.datasets;
        }
    } catch (err) {
        toast.error("Error fetching datasets. Please try again later.");
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Welcome back, <span>{user?.name}</span></h1>
                    <p>{datasets.length} dataset{datasets.length !== 1 ? 's' : ''} available</p>
                </div>
            </div>
            <DatasetList datasets={datasets} />
        </div>
    );
};

export default Projects;