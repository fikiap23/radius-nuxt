import type { DashboardTaskPriority, DashboardTaskStatus } from "~/features/dashboard/types/dashboard";

const STATUS_LABELS: Record<DashboardTaskStatus, string> = {
	backlog: "Backlog",
	todo: "Todo",
	in_progress: "In progress",
	review: "Review",
	done: "Done",
};

const PRIORITY_LABELS: Record<DashboardTaskPriority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
	urgent: "Urgent",
};

export function dashboardStatusLabel(status: DashboardTaskStatus) {
	return STATUS_LABELS[status];
}

export function dashboardPriorityLabel(priority: DashboardTaskPriority) {
	return PRIORITY_LABELS[priority];
}

export function dashboardPriorityColor(
	priority: DashboardTaskPriority,
): "neutral" | "primary" | "warning" | "error" {
	switch (priority) {
		case "urgent":
			return "error";
		case "high":
			return "warning";
		case "medium":
			return "primary";
		default:
			return "neutral";
	}
}

export function dashboardStatusColor(
	status: DashboardTaskStatus,
): "neutral" | "primary" | "warning" | "success" {
	switch (status) {
		case "done":
			return "success";
		case "in_progress":
		case "review":
			return "primary";
		case "todo":
			return "warning";
		default:
			return "neutral";
	}
}

export function formatDashboardRelativeTime(iso: string) {
	const date = new Date(iso);
	const diffMs = date.getTime() - Date.now();
	const absSec = Math.round(Math.abs(diffMs) / 1000);
	const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

	if (absSec < 60) {
		return rtf.format(Math.round(diffMs / 1000), "second");
	}
	const absMin = Math.round(absSec / 60);
	if (absMin < 60) {
		return rtf.format(Math.round(diffMs / 60_000), "minute");
	}
	const absHr = Math.round(absMin / 60);
	if (absHr < 24) {
		return rtf.format(Math.round(diffMs / 3_600_000), "hour");
	}
	const absDay = Math.round(absHr / 24);
	if (absDay < 7) {
		return rtf.format(Math.round(diffMs / 86_400_000), "day");
	}
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

export function formatDashboardDueDate(iso: string | null) {
	if (!iso) {
		return null;
	}
	const date = new Date(iso);
	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfDue = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const diffDays = Math.round(
		(startOfDue.getTime() - startOfToday.getTime()) / 86_400_000,
	);

	if (diffDays === 0) {
		return "Today";
	}
	if (diffDays === 1) {
		return "Tomorrow";
	}
	if (diffDays === -1) {
		return "Yesterday";
	}
	if (diffDays < 0) {
		return `${Math.abs(diffDays)}d overdue`;
	}
	if (diffDays <= 7) {
		return `In ${diffDays}d`;
	}
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}
