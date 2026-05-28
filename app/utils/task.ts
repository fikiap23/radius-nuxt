import { TASK_UNASSIGNED_VALUE } from "~/config/task";
import type { Task, TaskPriority, TaskStatus } from "~/types/task";

export function taskAssigneeToSelectValue(assigneeId: string | null) {
	return assigneeId ?? TASK_UNASSIGNED_VALUE;
}

export function taskAssigneeFromSelectValue(value: string) {
	return value === TASK_UNASSIGNED_VALUE ? null : value;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
	backlog: "Backlog",
	todo: "Todo",
	in_progress: "In progress",
	review: "Review",
	done: "Done",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
	urgent: "Urgent",
};

export function createTaskId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `task-${Date.now()}`;
}

export function createTaskChildId(prefix: string) {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `${prefix}-${Date.now()}`;
}

export function taskStatusLabel(status: TaskStatus) {
	return STATUS_LABELS[status];
}

export function taskPriorityLabel(priority: TaskPriority) {
	return PRIORITY_LABELS[priority];
}

export function taskStatusColor(
	status: TaskStatus,
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

export function taskPriorityColor(
	priority: TaskPriority,
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

export function formatTaskDueDate(iso: string | null) {
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

export function isoDateInputValue(iso: string | null) {
	if (!iso) {
		return "";
	}
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return date.toISOString().slice(0, 10);
}

export function dueAtFromDateInput(value: string): string | null {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}
	const date = new Date(`${trimmed}T12:00:00.000Z`);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return date.toISOString();
}

export function computeProjectTaskStats(tasks: Task[]) {
	const total = tasks.length;
	if (total === 0) {
		return { openTasks: 0, progress: 0 };
	}
	const done = tasks.filter(t => t.status === "done").length;
	const openTasks = total - done;
	const progress = Math.round((done / total) * 100);
	return { openTasks, progress };
}

export function formatFileSize(bytes: number) {
	if (bytes < 1024) {
		return `${bytes} B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatActivityTime(iso: string) {
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
