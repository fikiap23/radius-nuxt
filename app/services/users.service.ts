import type { ApiClient } from "~/api/client";
import type { ApiResult } from "~/api/types";
import { UsersRoutes, type UserDto } from "~/contracts";

export function createUsersService(client: ApiClient) {
	return {
		getMe(): Promise<ApiResult<UserDto>> {
			return client.get<UserDto>(UsersRoutes.me);
		},
	};
}

export type UsersService = ReturnType<typeof createUsersService>;
