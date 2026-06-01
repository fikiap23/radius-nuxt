import { createApiClient } from "~/api";
import type { ApiClient } from "~/api";

const API_CLIENT_STATE_KEY = "radius-api-client";

export function useApiClient(): ApiClient {
	const client = useState<ApiClient | null>(API_CLIENT_STATE_KEY, () => null);

	if (!client.value) {
		const authStore = useAuthStore();

		client.value = createApiClient({
			onUnauthorized: () => {
				if (authStore.isAuthenticated) {
					void authStore.logout();
				}
			},
		});
	}

	return client.value;
}
