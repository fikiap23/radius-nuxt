import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import { TaskRoutes } from "~/features/task/contracts/task.contract";
import type {
	CreateTaskAttachmentBody,
	CreateTaskAttachmentResponse,
	CreateTaskBody,
	CreateTaskResponse,
	DeleteTaskAttachmentResponse,
	DeleteTaskResponse,
	GetProjectTasksResponse,
	GetTaskActivitiesResponse,
	UpdateTaskBody,
	UpdateTaskResponse,
} from "~/features/task/contracts/task.contract";

export function createTaskService(client: ApiClient) {
	return {
		getTasks(projectId: string): Promise<ApiResult<GetProjectTasksResponse>> {
			return client.get<GetProjectTasksResponse>(TaskRoutes.list(projectId));
		},

		createTask(
			projectId: string,
			body: CreateTaskBody,
		): Promise<ApiResult<CreateTaskResponse>> {
			return client.post<CreateTaskResponse>(TaskRoutes.create(projectId), body);
		},

		updateTask(
			taskId: string,
			body: UpdateTaskBody,
		): Promise<ApiResult<UpdateTaskResponse>> {
			return client.patch<UpdateTaskResponse>(TaskRoutes.update(taskId), body);
		},

		deleteTask(taskId: string): Promise<ApiResult<DeleteTaskResponse>> {
			return client.delete<DeleteTaskResponse>(TaskRoutes.delete(taskId));
		},

		getActivities(taskId: string): Promise<ApiResult<GetTaskActivitiesResponse>> {
			return client.get<GetTaskActivitiesResponse>(TaskRoutes.activities(taskId));
		},

		createAttachment(
			taskId: string,
			body: CreateTaskAttachmentBody,
		): Promise<ApiResult<CreateTaskAttachmentResponse>> {
			return client.post<CreateTaskAttachmentResponse>(
				TaskRoutes.createAttachment(taskId),
				body,
			);
		},

		deleteAttachment(
			taskId: string,
			attachmentId: string,
		): Promise<ApiResult<DeleteTaskAttachmentResponse>> {
			return client.delete<DeleteTaskAttachmentResponse>(
				TaskRoutes.deleteAttachment(taskId, attachmentId),
			);
		},
	};
}

export type TaskService = ReturnType<typeof createTaskService>;
