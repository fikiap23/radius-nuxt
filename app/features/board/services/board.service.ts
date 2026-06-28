import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import { BoardRoutes } from "~/features/board/contracts/board.contract";
import type {
	CreateBoardColumnBody,
	CreateBoardColumnResponse,
	DeleteBoardColumnResponse,
	GetBoardColumnsResponse,
	ReorderBoardColumnsBody,
	ReorderBoardColumnsResponse,
	UpdateBoardColumnBody,
	UpdateBoardColumnResponse,
} from "~/features/board/contracts/board.contract";

export function createBoardService(client: ApiClient) {
	return {
		getColumns(projectId: string): Promise<ApiResult<GetBoardColumnsResponse>> {
			return client.get<GetBoardColumnsResponse>(BoardRoutes.list(projectId));
		},

		createColumn(
			projectId: string,
			body: CreateBoardColumnBody,
		): Promise<ApiResult<CreateBoardColumnResponse>> {
			return client.post<CreateBoardColumnResponse>(BoardRoutes.create(projectId), body);
		},

		updateColumn(
			projectId: string,
			columnId: string,
			body: UpdateBoardColumnBody,
		): Promise<ApiResult<UpdateBoardColumnResponse>> {
			return client.patch<UpdateBoardColumnResponse>(
				BoardRoutes.update(projectId, columnId),
				body,
			);
		},

		reorderColumns(
			projectId: string,
			body: ReorderBoardColumnsBody,
		): Promise<ApiResult<ReorderBoardColumnsResponse>> {
			return client.put<ReorderBoardColumnsResponse>(BoardRoutes.reorder(projectId), body);
		},

		deleteColumn(
			projectId: string,
			columnId: string,
		): Promise<ApiResult<DeleteBoardColumnResponse>> {
			return client.delete<DeleteBoardColumnResponse>(
				BoardRoutes.delete(projectId, columnId),
			);
		},
	};
}

export type BoardService = ReturnType<typeof createBoardService>;
