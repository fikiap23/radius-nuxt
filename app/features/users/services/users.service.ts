import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import { UsersRoutes, type UserDto } from "~/features/users/contracts/users.contract";

export function createUsersService(client: ApiClient) {
	return {
		getMe(): Promise<ApiResult<UserDto>> {
			return client.get<UserDto>(UsersRoutes.me);
		},
	};
}

export type UsersService = ReturnType<typeof createUsersService>;
