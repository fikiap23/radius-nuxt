import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import {
	AuthRoutes,
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
	};
}

export type AuthService = ReturnType<typeof createAuthService>;
