import { createAuthService, type AuthService } from "~/services";

const AUTH_SERVICE_STATE_KEY = "radius-auth-api-service";

export function useAuthApi(): AuthService {
	const client = useApiClient();
	const service = useState<AuthService | null>(AUTH_SERVICE_STATE_KEY, () => null);

	if (!service.value) {
		service.value = createAuthService(client);
	}

	return service.value;
}
