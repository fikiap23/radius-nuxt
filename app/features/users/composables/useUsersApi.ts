import { createUsersService, type UsersService } from "~/features/users/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

export function useUsersApi(): UsersService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as any;

	if (!nuxtApp._usersService) {
		nuxtApp._usersService = createUsersService(client);
	}

	return nuxtApp._usersService;
}
