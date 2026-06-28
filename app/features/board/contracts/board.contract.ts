import type {
	BoardColumn,
	CreateBoardColumnPayload,
	UpdateBoardColumnPayload,
} from "~/features/board/types/board";

/**
 * Board column API contract routes
 */
export const BoardRoutes = {
	list: (projectId: string) => `/projects/${projectId}/board/columns`,
	create: (projectId: string) => `/projects/${projectId}/board/columns`,
	update: (projectId: string, columnId: string) =>
		`/projects/${projectId}/board/columns/${columnId}`,
	reorder: (projectId: string) => `/projects/${projectId}/board/columns/reorder`,
	delete: (projectId: string, columnId: string) =>
		`/projects/${projectId}/board/columns/${columnId}`,
} as const;

/** GET /projects/:projectId/board/columns */
export type GetBoardColumnsResponse = BoardColumn[];

/** POST /projects/:projectId/board/columns */
export type CreateBoardColumnBody = CreateBoardColumnPayload;
export type CreateBoardColumnResponse = BoardColumn;

/** PATCH /projects/:projectId/board/columns/:columnId */
export type UpdateBoardColumnBody = UpdateBoardColumnPayload;
export type UpdateBoardColumnResponse = BoardColumn;

/** PUT /projects/:projectId/board/columns/reorder */
export interface ReorderBoardColumnsBody {
	columnIds: string[];
}

export interface ReorderBoardColumnsResponse {
	ok: boolean;
}

/** DELETE /projects/:projectId/board/columns/:columnId */
export interface DeleteBoardColumnResponse {
	ok: boolean;
	fallbackColumnId: string;
}
