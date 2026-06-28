import type {
	CreateTaskPayload,
	Task,
	TaskActivityEntry,
	TaskAttachment,
	UpdateTaskPayload,
} from "~/features/task/types/task";

/**
 * Task API contract routes
 */
export const TaskRoutes = {
	list: (projectId: string) => `/projects/${projectId}/tasks`,
	create: (projectId: string) => `/projects/${projectId}/tasks`,
	update: (taskId: string) => `/tasks/${taskId}`,
	delete: (taskId: string) => `/tasks/${taskId}`,
	activities: (taskId: string) => `/tasks/${taskId}/activities`,
	createAttachment: (taskId: string) => `/tasks/${taskId}/attachments`,
	deleteAttachment: (taskId: string, attachmentId: string) =>
		`/tasks/${taskId}/attachments/${attachmentId}`,
} as const;

/** GET /projects/:projectId/tasks */
export type GetProjectTasksResponse = Task[];

/** POST /projects/:projectId/tasks */
export type CreateTaskBody = CreateTaskPayload;
export type CreateTaskResponse = Task;

/** PATCH /tasks/:taskId */
export type UpdateTaskBody = UpdateTaskPayload;
export type UpdateTaskResponse = Task;

/** DELETE /tasks/:taskId */
export interface DeleteTaskResponse {
	ok: boolean;
}

/** GET /tasks/:taskId/activities */
export type GetTaskActivitiesResponse = TaskActivityEntry[];

/** POST /tasks/:taskId/attachments */
export interface CreateTaskAttachmentBody {
	tempKey: string;
	fileName: string;
	contentType: string;
	size: number;
}

export type CreateTaskAttachmentResponse = TaskAttachment;

/** DELETE /tasks/:taskId/attachments/:attachmentId */
export interface DeleteTaskAttachmentResponse {
	ok: boolean;
}
