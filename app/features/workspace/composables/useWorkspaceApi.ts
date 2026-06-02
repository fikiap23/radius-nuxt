import { createWorkspaceService, type WorkspaceService } from "~/features/workspace/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

const WORKSPACE_SERVICE_STATE_KEY = "radius-workspace-api-service";

export function useWorkspaceApi(): WorkspaceService {
	const client = useApiClient();
	const service = useState<WorkspaceService | null>(WORKSPACE_SERVICE_STATE_KEY, () => null);

	if (!service.value) {
		service.value = createWorkspaceService(client);
	}

	return service.value;
}
