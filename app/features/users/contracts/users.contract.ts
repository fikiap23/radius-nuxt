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
	emailVerifiedAt?: string | null;
	avatarUrl?: string | null;
	lastLoginAt?: string | null;
	timezone?: string | null;
	locale?: string;
	createdAt?: string;
	updatedAt?: string;
}
