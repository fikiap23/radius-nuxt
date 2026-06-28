import { useApiClient } from "~/features/auth/composables/useApiClient";
import { createTaskService, type TaskService } from "~/features/task/services";

export function useTaskApi(): TaskService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
		_taskService?: TaskService;
	};

	if (!nuxtApp._taskService) {
		nuxtApp._taskService = createTaskService(client);
	}

	return nuxtApp._taskService;
}
