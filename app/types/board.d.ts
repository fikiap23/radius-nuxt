import type { TaskStatus } from "~/types/task";

export interface BoardColumn {
	id: string;
	title: string;
	status: TaskStatus;
	wipLimit: number | null;
	order: number;
}

export interface BoardPersistedState {
	columnsByProject: Record<string, BoardColumn[]>;
}

export interface BoardFilters {
	assigneeId: "all" | "unassigned" | string;
	labelId: string;
	query: string;
}

export interface CreateBoardColumnPayload {
	title: string;
	status: TaskStatus;
	wipLimit?: number | null;
}

export interface UpdateBoardColumnPayload {
	title?: string;
	status?: TaskStatus;
	wipLimit?: number | null;
}
