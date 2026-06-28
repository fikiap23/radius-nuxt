export const StorageRoutes = {
	presignUpload: () => "/storage/presign-upload",
} as const;

export type StorageUploadPurpose = "project_cover" | "task_attachment";

export interface PresignUploadContext {
	taskId?: string;
}

export interface PresignUploadRequest {
	fileName: string;
	contentType: string;
	purpose: StorageUploadPurpose;
	context?: PresignUploadContext;
}

export interface PresignUploadResponse {
	uploadUrl: string;
	tempKey: string;
	expiresIn: number;
	method: string;
}
