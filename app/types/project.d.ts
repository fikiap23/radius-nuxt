export type ProjectStatus = "active" | "on_hold" | "completed";

export type ProjectCoverPreset =
	| "emerald"
	| "ocean"
	| "sunset"
	| "violet"
	| "rose"
	| "slate";

export interface Project {
	id: string;
	workspaceId: string;
	name: string;
	icon: string;
	cover: ProjectCoverPreset;
	status: ProjectStatus;
	isFavorite: boolean;
	archivedAt: string | null;
	openTasks: number;
	progress: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProjectPayload {
	name: string;
	icon?: string;
	cover?: ProjectCoverPreset;
	status?: ProjectStatus;
}

export interface UpdateProjectPayload {
	name?: string;
	icon?: string;
	cover?: ProjectCoverPreset;
	status?: ProjectStatus;
	isFavorite?: boolean;
}

export interface ProjectPersistedState {
	projects: Project[];
}

export type ProjectListFilterStatus = "all" | ProjectStatus | "archived";

export interface ProjectListFilters {
	status: ProjectListFilterStatus;
	favoritesOnly: boolean;
	query: string;
	view: "grid" | "list";
}
