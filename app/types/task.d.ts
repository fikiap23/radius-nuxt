export type TaskStatus =
	| "backlog"
	| "todo"
	| "in_progress"
	| "review"
	| "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface TaskLabel {
	id: string;
	name: string;
	color: "neutral" | "primary" | "warning" | "success" | "error" | "info";
}

export interface TaskSubtask {
	id: string;
	title: string;
	done: boolean;
}

export interface TaskChecklistItem {
	id: string;
	text: string;
	checked: boolean;
}

export interface TaskAttachment {
	id: string;
	name: string;
	size: number;
	mimeType: string;
	uploadedAt: string;
}

export interface TaskActivityEntry {
	id: string;
	taskId: string;
	title: string;
	description?: string;
	occurredAt: string;
	icon: string;
}

export interface TaskComment {
	id: string;
	taskId: string;
	authorId: string | null;
	authorName: string;
	/** Plain text with mention tokens: @[Name](memberId) */
	body: string;
	mentionIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateTaskCommentPayload {
	body: string;
	authorId?: string | null;
	authorName: string;
}

export interface UpdateTaskCommentPayload {
	body: string;
}

export interface Task {
	id: string;
	projectId: string;
	workspaceId: string;
	title: string;
	description: string;
	status: TaskStatus;
	/** Kanban column; falls back to status-matched default column when null */
	columnId: string | null;
	priority: TaskPriority;
	dueAt: string | null;
	labelIds: string[];
	assigneeId: string | null;
	subtasks: TaskSubtask[];
	checklist: TaskChecklistItem[];
	attachments: TaskAttachment[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateTaskPayload {
	title: string;
	description?: string;
	status?: TaskStatus;
	columnId?: string | null;
	priority?: TaskPriority;
	dueAt?: string | null;
	labelIds?: string[];
	assigneeId?: string | null;
}

export interface UpdateTaskPayload {
	title?: string;
	description?: string;
	status?: TaskStatus;
	columnId?: string | null;
	priority?: TaskPriority;
	dueAt?: string | null;
	labelIds?: string[];
	assigneeId?: string | null;
	subtasks?: TaskSubtask[];
	checklist?: TaskChecklistItem[];
	attachments?: TaskAttachment[];
}

export interface TaskPersistedState {
	tasks: Task[];
	activities: TaskActivityEntry[];
	comments?: TaskComment[];
}

export type TaskListFilterStatus = "all" | TaskStatus;

export type TaskListFilterAssignee = "all" | "unassigned" | string;

export interface TaskListFilters {
	status: TaskListFilterStatus;
	assigneeId: TaskListFilterAssignee;
	labelId: string;
	query: string;
}
