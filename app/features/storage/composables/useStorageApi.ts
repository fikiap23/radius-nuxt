import { createStorageService, type StorageService } from "~/features/storage/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

export function useStorageApi(): StorageService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
		_storageService?: StorageService;
	};

	if (!nuxtApp._storageService) {
		nuxtApp._storageService = createStorageService(client);
	}

	return nuxtApp._storageService;
}
