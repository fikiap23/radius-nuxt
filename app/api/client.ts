import type { ApiEnvelope } from "~/contracts";
import { getApiErrorMessage, parseFetchError } from "~/api/errors";
import type {
	ApiClientOptions,
	ApiRequestOptions,
	ApiResult,
	HttpMethod,
} from "~/api/types";

function joinUrl(base: string, path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}
	const normalizedBase = base.replace(/\/$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${normalizedBase}${normalizedPath}`;
}

function buildHeaders(
	options: ApiClientOptions,
	requestOptions: ApiRequestOptions,
): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: "application/json",
		...options.defaultHeaders,
		...(requestOptions.headers as Record<string, string> | undefined),
	};

	if (!requestOptions.skipAuth && options.getAccessToken) {
		const token = options.getAccessToken();
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
	}

	if (
		requestOptions.body
		&& typeof requestOptions.body === "object"
		&& !(requestOptions.body instanceof FormData)
		&& !headers["Content-Type"]
	) {
		headers["Content-Type"] = "application/json";
	}

	return headers;
}

export class ApiClient {
	constructor(private readonly options: ApiClientOptions) {}

	get baseURL(): string {
		return this.options.baseURL;
	}

	async request<TData>(
		method: HttpMethod,
		path: string,
		requestOptions: ApiRequestOptions = {},
	): Promise<ApiResult<TData>> {
		const { skipAuth: _skipAuth, rawEnvelope: _rawEnvelope, ...fetchOptions } = requestOptions;
		const url = joinUrl(this.options.baseURL, path);

		try {
			const response = await $fetch<ApiEnvelope<TData>>(url, {
				...fetchOptions,
				method,
				headers: buildHeaders(this.options, requestOptions),
				body: requestOptions.body as Record<string, unknown> | BodyInit | null | undefined,
			});

			if (requestOptions.rawEnvelope) {
				return { ok: true, data: response as unknown as TData };
			}

			if (!response.isSuccess) {
				return {
					ok: false,
					error: getApiErrorMessage(response, "Request failed."),
					code: response.error,
				};
			}

			if (response.data === undefined) {
				return {
					ok: false,
					error: getApiErrorMessage(response, "Response did not include data."),
					code: response.error,
				};
			}

			return { ok: true, data: response.data };
		}
		catch (error: unknown) {
			const parsed = parseFetchError(error, "Network request failed.");
			const status = parsed.status;

			if (status === 401 && this.options.onUnauthorized) {
				this.options.onUnauthorized();
			}

			return {
				ok: false,
				error: parsed.message,
				status,
				code: parsed.code,
			};
		}
	}

	get<TData>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
		return this.request<TData>("GET", path, { ...options, method: "GET" });
	}

	post<TData>(
		path: string,
		body?: ApiRequestOptions["body"],
		options?: Omit<ApiRequestOptions, "method" | "body">,
	) {
		return this.request<TData>("POST", path, { ...options, method: "POST", body });
	}

	put<TData>(
		path: string,
		body?: ApiRequestOptions["body"],
		options?: Omit<ApiRequestOptions, "method" | "body">,
	) {
		return this.request<TData>("PUT", path, { ...options, method: "PUT", body });
	}

	patch<TData>(
		path: string,
		body?: ApiRequestOptions["body"],
		options?: Omit<ApiRequestOptions, "method" | "body">,
	) {
		return this.request<TData>("PATCH", path, { ...options, method: "PATCH", body });
	}

	delete<TData>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
		return this.request<TData>("DELETE", path, { ...options, method: "DELETE" });
	}
}
