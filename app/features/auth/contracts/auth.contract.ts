/**
 * Authentication API contract
 */

import type { UserDto } from "~/features/users/contracts/users.contract";

export const AuthRoutes = {
	register: "/auth/register",
	login: "/auth/login",
	googleSsoUrl: "/auth/sso/google/url",
	googleSsoCallback: "/auth/sso/google/callback",
	githubSsoUrl: "/auth/sso/github/url",
	githubSsoCallback: "/auth/sso/github/callback",
} as const;

/** POST /auth/register, POST /auth/login */
export interface AuthRegisterBody {
	name: string;
	email: string;
	password: string;
}

export interface AuthLoginBody {
	email: string;
	password: string;
}

export interface TokenBundle {
	accessToken: string;
	tokenType: string;
	expiresIn: number;
}

export interface AuthTokenResponse extends TokenBundle {
	user: UserDto;
}

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

export type GoogleSsoCallbackResponse = AuthTokenResponse;

/** GET /auth/sso/github/url */
export type GithubSsoUrlQuery = GoogleSsoUrlQuery;

export type GithubSsoUrlResponse = GoogleSsoUrlResponse;

/** POST /auth/sso/github/callback */
export type GithubSsoCallbackBody = GoogleSsoCallbackBody;

export type GithubSsoCallbackResponse = GoogleSsoCallbackResponse;
