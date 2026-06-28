import { createBoardService, type BoardService } from "~/features/board/services";
import { useApiClient } from "~/features/auth/composables/useApiClient";

export function useBoardApi(): BoardService {
	const client = useApiClient();
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
		_boardService?: BoardService;
	};

	if (!nuxtApp._boardService) {
		nuxtApp._boardService = createBoardService(client);
	}

	return nuxtApp._boardService;
}
