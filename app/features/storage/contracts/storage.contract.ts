export const StorageRoutes = {
	presignUpload: () => "/storage/presign-upload",
} as const;

export type StorageUploadPurpose = "project_cover";

export interface PresignUploadRequest {
	fileName: string;
	contentType: string;
	purpose: StorageUploadPurpose;
}

export interface PresignUploadResponse {
	uploadUrl: string;
	tempKey: string;
	expiresIn: number;
	method: string;
}
