import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import { ProjectRoutes } from "~/features/project/contracts/project.contract";
import type {
	GetWorkspaceProjectsResponse,
	CreateProjectBody,
	CreateProjectResponse,
	UpdateProjectBody,
	UpdateProjectResponse,
	ToggleFavoriteResponse,
	ArchiveProjectResponse,
	UnarchiveProjectResponse,
	DeleteProjectResponse,
} from "~/features/project/contracts/project.contract";

export function createProjectService(client: ApiClient) {
	return {
		getProjects(workspaceId: string): Promise<ApiResult<GetWorkspaceProjectsResponse>> {
			return client.get<GetWorkspaceProjectsResponse>(ProjectRoutes.list(workspaceId));
		},

		createProject(workspaceId: string, body: CreateProjectBody): Promise<ApiResult<CreateProjectResponse>> {
			return client.post<CreateProjectResponse>(ProjectRoutes.create(workspaceId), body);
		},

		updateProject(projectId: string, body: UpdateProjectBody): Promise<ApiResult<UpdateProjectResponse>> {
			return client.patch<UpdateProjectResponse>(ProjectRoutes.update(projectId), body);
		},

		toggleFavorite(projectId: string): Promise<ApiResult<ToggleFavoriteResponse>> {
			return client.patch<ToggleFavoriteResponse>(ProjectRoutes.favorite(projectId));
		},

		archiveProject(projectId: string): Promise<ApiResult<ArchiveProjectResponse>> {
			return client.patch<ArchiveProjectResponse>(ProjectRoutes.archive(projectId));
		},

		unarchiveProject(projectId: string): Promise<ApiResult<UnarchiveProjectResponse>> {
			return client.patch<UnarchiveProjectResponse>(ProjectRoutes.unarchive(projectId));
		},

		deleteProject(projectId: string): Promise<ApiResult<DeleteProjectResponse>> {
			return client.delete<DeleteProjectResponse>(ProjectRoutes.delete(projectId));
		},
	};
}

export type ProjectService = ReturnType<typeof createProjectService>;
