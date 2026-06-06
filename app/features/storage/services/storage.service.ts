import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import { StorageRoutes } from "~/features/storage/contracts/storage.contract";
import type {
	PresignUploadRequest,
	PresignUploadResponse,
} from "~/features/storage/contracts/storage.contract";

export function createStorageService(client: ApiClient) {
	return {
		presignUpload(body: PresignUploadRequest): Promise<ApiResult<PresignUploadResponse>> {
			return client.post<PresignUploadResponse>(StorageRoutes.presignUpload(), body);
		},
	};
}

export type StorageService = ReturnType<typeof createStorageService>;
