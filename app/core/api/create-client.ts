import { ACCESS_TOKEN_KEY } from "~/features/auth/constants/auth";
import { ApiClient } from "~/core/api/client";
import type { ApiClientOptions } from "~/core/api/types";

export function getApiBaseUrl(): string {
	const config = useRuntimeConfig();
	return config.public.apiBaseUrl as string;
}

export function createDefaultAccessTokenGetter(): () => string | null {
	return () => {
		if (!import.meta.client) {
			return null;
		}
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	};
}

export function createApiClient(overrides: Partial<ApiClientOptions> = {}): ApiClient {
	return new ApiClient({
		baseURL: getApiBaseUrl(),
		getAccessToken: createDefaultAccessTokenGetter(),
		...overrides,
	});
}
