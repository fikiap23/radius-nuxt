import { useStorageApi } from "~/features/storage/composables/useStorageApi";
import type {
	PresignUploadContext,
	StorageUploadPurpose,
} from "~/features/storage/contracts/storage.contract";

export function useStorage() {
	const storageApi = useStorageApi();
	const uploading = ref(false);
	const error = ref<string | null>(null);

	async function upload(
		file: File,
		purpose: StorageUploadPurpose,
		context?: PresignUploadContext,
	) {
		uploading.value = true;
		error.value = null;

		try {
			const presignResult = await storageApi.presignUpload({
				fileName: file.name,
				contentType: file.type,
				purpose,
				...(context ? { context } : {}),
			});

			if (!presignResult.ok) {
				throw new Error(presignResult.error || "Failed to get presigned upload URL.");
			}

			const { uploadUrl, tempKey, method } = presignResult.data;

			// 2. Upload file to presigned URL
			const uploadResponse = await fetch(uploadUrl, {
				method: method || "PUT",
				body: file,
			});

			if (!uploadResponse.ok) {
				throw new Error(`Upload failed with status ${uploadResponse.status}`);
			}

			return { ok: true as const, tempKey };
		}
		catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Failed to upload file.";
			error.value = message;
			return { ok: false as const, error: message };
		}
		finally {
			uploading.value = false;
		}
	}

	return {
		upload,
		uploading,
		error,
	};
}
