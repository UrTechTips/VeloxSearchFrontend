"use client";
import React from "react";
import styles from "./page.module.scss";

// ── Shared types ──────────────────────────────────────────────────────────────

interface BaseDialogProps {
	closeToast: () => void;
}

// ── Delete confirmation ───────────────────────────────────────────────────────

interface DeleteConfirmProps extends BaseDialogProps {
	onConfirm: () => void;
	projectId: string;
}

export const DeleteConfirm = ({
	closeToast,
	onConfirm,
	projectId,
}: DeleteConfirmProps) => {
	const [value, setValue] = React.useState("");
	const confirmed = value === "DELETE";

	const handleConfirm = () => {
		onConfirm();
		closeToast();
	};

	return (
		<div className={styles.dialog}>
			<p className={styles.title}>
				Are you sure you want to delete{" "}
				<strong className={styles.emphasis}>{projectId}</strong>?
			</p>

			<div className={styles.inputGroup}>
				<input
					className={styles.input}
					type="text"
					placeholder="DELETE"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<label className={styles.hint}>
					Type <strong>DELETE</strong> to confirm
				</label>
			</div>

			<div className={styles.actions}>
				<button
					className={styles.confirmButton}
					onClick={handleConfirm}
					disabled={!confirmed}
				>
					Delete project
				</button>
				<button className={styles.cancelButton} onClick={closeToast}>
					Cancel
				</button>
			</div>
		</div>
	);
};

// ── Coupon / upgrade ──────────────────────────────────────────────────────────

interface CouponUpgradeProps extends BaseDialogProps {
	onConfirm: (couponCode: string) => void;
}

export const CouponUpgrade = ({
	closeToast,
	onConfirm,
}: CouponUpgradeProps) => {
	const [value, setValue] = React.useState("");

	const handleConfirm = () => {
		onConfirm(value);
		closeToast();
	};

	return (
		<div className={styles.dialog}>
			<p className={styles.title}>
				Enter a coupon code to unlock a free upgrade.
			</p>

			<div className={styles.inputGroup}>
				<input
					className={styles.input}
					type="text"
					placeholder="COUPON-CODE"
					value={value}
					onChange={(e) => setValue(e.target.value.toUpperCase())}
				/>
				<label className={styles.hint}>Leave blank to upgrade at full price</label>
			</div>

			<div className={styles.actions}>
				<button className={styles.confirmButton} onClick={handleConfirm}>
					Confirm upgrade
				</button>
				<button className={styles.cancelButton} onClick={closeToast}>
					Cancel
				</button>
			</div>
		</div>
	);
};