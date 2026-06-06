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
	/** HTML from rich text editor */
	description: string;
	icon: string;
	cover: ProjectCoverPreset;
	/** Data URL or remote URL for custom cover background */
	coverImageUrl: string | null;
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
	description?: string;
	icon?: string;
	cover?: ProjectCoverPreset;
	coverImageUrl?: string | null;
	coverImageTempKey?: string | null;
	status?: ProjectStatus;
}

export interface UpdateProjectPayload {
	name?: string;
	description?: string;
	icon?: string;
	cover?: ProjectCoverPreset;
	coverImageUrl?: string | null;
	coverImageTempKey?: string | null;
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
