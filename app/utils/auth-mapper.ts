import type { UserDto } from "~/contracts";
import type { AuthUser } from "~/types/auth";

export function mapUserDtoToAuthUser(dto: UserDto): AuthUser {
	return {
		id: dto.id,
		name: dto.name,
		email: dto.email,
		avatarUrl: dto.avatarUrl ?? null,
	};
}
