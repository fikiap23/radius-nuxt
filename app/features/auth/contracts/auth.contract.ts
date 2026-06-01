/**
 * Authentication API contract
 */

import type { UserDto } from "~/features/users/contracts/users.contract";

export const AuthRoutes = {
	googleSsoUrl: "/auth/sso/google/url",
	googleSsoCallback: "/auth/sso/google/callback",
} as const;

/** GET /auth/sso/google/url */
export interface GoogleSsoUrlQuery {
	redirect_uri: string;
}

export interface GoogleSsoUrlResponse {
	authUrl: string;
	state: string;
}

/** POST /auth/sso/google/callback */
export interface GoogleSsoCallbackBody {
	code: string;
	state: string;
}

export interface TokenBundle {
	accessToken: string;
	tokenType: string;
	expiresIn: number;
}

export interface GoogleSsoCallbackResponse extends TokenBundle {
	user: UserDto;
}
