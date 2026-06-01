import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import {
	AuthRoutes,
	type GithubSsoCallbackBody,
	type GithubSsoCallbackResponse,
	type GithubSsoUrlResponse,
	type GoogleSsoCallbackBody,
	type GoogleSsoCallbackResponse,
	type GoogleSsoUrlResponse,
} from "~/features/auth/contracts/auth.contract";

export function createAuthService(client: ApiClient) {
	return {
		getGoogleSsoUrl(redirectUri: string): Promise<ApiResult<GoogleSsoUrlResponse>> {
			return client.get<GoogleSsoUrlResponse>(AuthRoutes.googleSsoUrl, {
				query: { redirect_uri: redirectUri },
				skipAuth: true,
			});
		},

		completeGoogleSso(
			body: GoogleSsoCallbackBody,
		): Promise<ApiResult<GoogleSsoCallbackResponse>> {
			return client.post<GoogleSsoCallbackResponse>(AuthRoutes.googleSsoCallback, body, {
				skipAuth: true,
			});
		},

		getGithubSsoUrl(redirectUri: string): Promise<ApiResult<GithubSsoUrlResponse>> {
			return client.get<GithubSsoUrlResponse>(AuthRoutes.githubSsoUrl, {
				query: { redirect_uri: redirectUri },
				skipAuth: true,
			});
		},

		completeGithubSso(
			body: GithubSsoCallbackBody,
		): Promise<ApiResult<GithubSsoCallbackResponse>> {
			return client.post<GithubSsoCallbackResponse>(AuthRoutes.githubSsoCallback, body, {
				skipAuth: true,
			});
		},
	};
}

export type AuthService = ReturnType<typeof createAuthService>;
