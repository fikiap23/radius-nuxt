import type { Project, ProjectCoverPreset, ProjectStatus } from "~/features/project/types/project";

/**
 * Project API Contract Routes
 */
export const ProjectRoutes = {
	list: (workspaceId: string) => `/workspaces/${workspaceId}/projects`,
	create: (workspaceId: string) => `/workspaces/${workspaceId}/projects`,
	update: (projectId: string) => `/projects/${projectId}`,
	favorite: (projectId: string) => `/projects/${projectId}/favorite`,
	archive: (projectId: string) => `/projects/${projectId}/archive`,
	unarchive: (projectId: string) => `/projects/${projectId}/unarchive`,
	delete: (projectId: string) => `/projects/${projectId}`,
} as const;

/**
 * Request Bodies and Response Payloads for Project Endpoints
 */

/** GET /workspaces/:workspaceId/projects */
export type GetWorkspaceProjectsResponse = Project[];

/** POST /workspaces/:workspaceId/projects */
export interface CreateProjectBody {
	name: string;
	description?: string;
	icon?: string;
	cover?: ProjectCoverPreset;
	coverImageUrl?: string | null;
	status?: ProjectStatus;
}

export type CreateProjectResponse = Project;

/** PATCH /projects/:projectId */
export interface UpdateProjectBody {
	name?: string;
	description?: string;
	icon?: string;
	cover?: ProjectCoverPreset;
	coverImageUrl?: string | null;
	status?: ProjectStatus;
	isFavorite?: boolean;
}

export type UpdateProjectResponse = Project;

/** PATCH /projects/:projectId/favorite */
export interface ToggleFavoriteResponse {
	id: string;
	isFavorite: boolean;
}

/** PATCH /projects/:projectId/archive */
export interface ArchiveProjectResponse {
	id: string;
	archivedAt: string;
}

/** PATCH /projects/:projectId/unarchive */
export interface UnarchiveProjectResponse {
	id: string;
	archivedAt: null;
}

/** DELETE /projects/:projectId */
export interface DeleteProjectResponse {
	ok: boolean;
}
