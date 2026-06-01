/**
 * Authentication API contract
 */

import type { UserDto } from "~/features/users/contracts/users.contract";

export const AuthRoutes = {
	googleSsoUrl: "/auth/sso/google/url",
	googleSsoCallback: "/auth/sso/google/callback",
	githubSsoUrl: "/auth/sso/github/url",
	githubSsoCallback: "/auth/sso/github/callback",
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

/** GET /auth/sso/github/url */
export type GithubSsoUrlQuery = GoogleSsoUrlQuery;

export type GithubSsoUrlResponse = GoogleSsoUrlResponse;

/** POST /auth/sso/github/callback */
export type GithubSsoCallbackBody = GoogleSsoCallbackBody;

export type GithubSsoCallbackResponse = GoogleSsoCallbackResponse;
