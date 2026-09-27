"use client";
import { use } from "react";
import { toast } from "react-toastify";
import styles from "./page.module.scss";
import { DeleteConfirm, CouponUpgrade } from "./pageDialogues";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DeleteDatasetResponse {
	message: string;
	success: boolean;
}

const Page = ({ params }: { params: Promise<{ projectId: string }> }) => {
	const router = useRouter();
	const { projectId } = use(params);

	const handleDeleteProject = async () => {
		const supabase = createClient();
		const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);
		try {
			const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
			console.log(`URL Call: ${apiUrl}/dataset/delete/${projectId}`);
			const res = await fetch(`${apiUrl}/dataset/delete/${projectId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});
			const data: DeleteDatasetResponse = await res.json();
			if (data.success == true) {
				toast.success("Project deleted successfully!");
				router.push("/dashboard/projects");
			} else {
				toast.error(`Failed to delete the project: ${data.message}`);
			}
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete the project. Please try again.");
		}
	};

	const handleReUpload = () => {
		router.push(`/projects/upload?datasetId=${projectId}`);
	}

	const handleUpgradeProject = (couponCode: string) => {
		if (!couponCode) {
			toast.error("Please enter a valid coupon code.");
			return;
		}

		if (couponCode.toUpperCase() === "HANUMAN") {
			toast.success("Project upgraded successfully to the Elite Plan!!!");
		} else {
			toast.error("Invalid coupon code. Please try again.");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.settings}>
				<h1>Settings</h1>
				<hr />

				<div className={styles.setting}>
					<div>
						<h3>Upgrade Project</h3>
						<p>
							Upgrade your project to access enhanced features and
							improved performance. Click the button below to
							explore upgrade options.
						</p>
					</div>
					<button
						className={styles.upgradeButton}
						onClick={() =>
							toast.info(
								<CouponUpgrade
									closeToast={toast.dismiss}
									onConfirm={handleUpgradeProject}
								/>,
								{ autoClose: false, closeOnClick: false }
							)
						}
					>
						Upgrade
					</button>
				</div>

				<div className={styles.setting}>
					<div>
						<h3>Re-upload Dataset</h3>
						<p>
							Re-uploading the dataset will overwrite the existing
							one. Please ensure you have a backup before proceeding.
						</p>
					</div>
					<button className={styles.reuploadButton} onClick={handleReUpload}>Re-upload</button>
				</div>

				<div className={styles.setting}>
					<div>
						<h3>Delete Project</h3>
						<p>
							Warning: This action cannot be undone. Please
							proceed with caution.
						</p>
					</div>
					<button
						className={styles.deleteButton}
						onClick={() =>
							toast.error(
								<DeleteConfirm
									closeToast={toast.dismiss}
									onConfirm={handleDeleteProject}
									projectId={projectId}
								/>,
								{ autoClose: false, closeOnClick: false }
							)
						}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default Page;