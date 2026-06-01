import type { FetchOptions } from "ofetch";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Discriminated result — use in stores/UI instead of throwing for expected failures */
export type ApiResult<TData> =
	| { ok: true; data: TData }
	| { ok: false; error: string; status?: number; code?: string };

export interface ApiClientOptions {
	baseURL: string;
	getAccessToken?: () => string | null;
	defaultHeaders?: Record<string, string>;
	onUnauthorized?: () => void;
}

export interface ApiRequestOptions extends Omit<FetchOptions, "method" | "body"> {
	method?: HttpMethod;
	body?: unknown;
	/** Skip Authorization header (e.g. public SSO URL) */
	skipAuth?: boolean;
	/** Return raw envelope without unwrapping `data` */
	rawEnvelope?: boolean;
}
