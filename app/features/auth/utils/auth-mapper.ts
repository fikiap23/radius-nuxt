import type { UserDto } from "~/features/users/contracts/users.contract";
import type { AuthUser } from "~/features/auth/types/auth";

export function mapUserDtoToAuthUser(dto: UserDto): AuthUser {
	return {
		id: dto.id,
		name: dto.name,
		email: dto.email,
		avatarUrl: dto.avatarUrl ?? null,
	};
}
