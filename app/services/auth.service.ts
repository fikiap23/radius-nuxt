import type { ApiClient } from "~/api/client";
import type { ApiResult } from "~/api/types";
import {
	AuthRoutes,
	type GoogleSsoCallbackBody,
	type GoogleSsoCallbackResponse,
	type GoogleSsoUrlResponse,
} from "~/contracts";

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
	};
}

export type AuthService = ReturnType<typeof createAuthService>;
