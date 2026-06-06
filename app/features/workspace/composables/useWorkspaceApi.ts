import { createWorkspaceService, type WorkspaceService } from "~/features/workspace/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

export function useWorkspaceApi(): WorkspaceService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
		_workspaceService?: WorkspaceService;
	};

	if (!nuxtApp._workspaceService) {
		nuxtApp._workspaceService = createWorkspaceService(client);
	}

	return nuxtApp._workspaceService;
}
