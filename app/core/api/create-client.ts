import { ACCESS_TOKEN_KEY } from "~/constants/auth";
import { ApiClient } from "~/api/client";
import type { ApiClientOptions } from "~/api/types";

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
