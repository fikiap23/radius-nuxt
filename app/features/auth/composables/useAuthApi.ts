import { createAuthService, type AuthService } from "~/features/auth/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

export function useAuthApi(): AuthService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as any;

	if (!nuxtApp._authService) {
		nuxtApp._authService = createAuthService(client);
	}

	return nuxtApp._authService;
}
