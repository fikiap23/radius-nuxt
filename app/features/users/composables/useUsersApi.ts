import { createUsersService, type UsersService } from "~/features/users/services";

const USERS_SERVICE_STATE_KEY = "radius-users-api-service";

export function useUsersApi(): UsersService {
	const client = useApiClient();
	const service = useState<UsersService | null>(USERS_SERVICE_STATE_KEY, () => null);

	if (!service.value) {
		service.value = createUsersService(client);
	}

	return service.value;
}
