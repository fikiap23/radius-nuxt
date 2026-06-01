import { useApiClient } from "~/composables/useApiClient";
import { useAuthApi } from "~/composables/useAuthApi";
import { useUsersApi } from "~/composables/useUsersApi";

/**
 * API facade — single entry for HTTP client and domain services.
 *
 * @example
 * const { client, auth, users } = useApi()
 * const result = await users.getMe()
 */
export function useApi() {
	const client = useApiClient();

	return {
		client,
		auth: useAuthApi(),
		users: useUsersApi(),
	};
}
