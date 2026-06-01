import type { TaskLabel, TaskPriority, TaskStatus } from "~/features/task/types/task";

/** USelect item value for no assignee (empty string is reserved to clear selection). */
export const TASK_UNASSIGNED_VALUE = "unassigned";

export const TASK_STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
	{ label: "Backlog", value: "backlog" },
	{ label: "Todo", value: "todo" },
	{ label: "In progress", value: "in_progress" },
	{ label: "Review", value: "review" },
	{ label: "Done", value: "done" },
];

export const TASK_PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
	{ label: "Low", value: "low" },
	{ label: "Medium", value: "medium" },
	{ label: "High", value: "high" },
	{ label: "Urgent", value: "urgent" },
];

export const TASK_LABEL_PRESETS: TaskLabel[] = [
	{ id: "label-bug", name: "Bug", color: "error" },
	{ id: "label-feature", name: "Feature", color: "primary" },
	{ id: "label-design", name: "Design", color: "info" },
	{ id: "label-docs", name: "Docs", color: "neutral" },
	{ id: "label-urgent", name: "Urgent", color: "warning" },
];
