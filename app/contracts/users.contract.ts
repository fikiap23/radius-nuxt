/**
 * Users API contract
 */

export const UsersRoutes = {
	me: "/users/me",
} as const;

export interface UserDto {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string | null;
}
