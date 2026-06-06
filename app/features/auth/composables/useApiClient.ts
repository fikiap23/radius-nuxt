import { createApiClient } from "~/core/api";
import type { ApiClient } from "~/core/api";
import { useAuthStore } from "~/features/auth/stores/auth";

export function useApiClient(): ApiClient {
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
		_apiClient?: ApiClient;
	};

	if (!nuxtApp._apiClient) {
		const authStore = useAuthStore();

		nuxtApp._apiClient = createApiClient({
			onUnauthorized: () => {
				if (authStore.isAuthenticated) {
					void authStore.logout();
				}
			},
		});
	}

	return nuxtApp._apiClient;
}
