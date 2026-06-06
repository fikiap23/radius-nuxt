import { createProjectService, type ProjectService } from "~/features/project/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

export function useProjectApi(): ProjectService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
		_projectService?: ProjectService;
	};

	if (!nuxtApp._projectService) {
		nuxtApp._projectService = createProjectService(client);
	}

	return nuxtApp._projectService;
}
