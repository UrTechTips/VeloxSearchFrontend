"use client";
import { use } from "react";
import { toast } from "react-toastify";
import styles from "./page.module.scss";
import { DeleteConfirm, CouponUpgrade } from "./pageDialogues";

const Page = ({ params }: { params: Promise<{ projectId: string }> }) => {
	const { projectId } = use(params);

	const handleDeleteProject = () => {
		console.log(`Project ${projectId} deleted`);
	};

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
					<button className={styles.reuploadButton}>Re-upload</button>
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