import type { ApiEnvelope, ApiErrorBody } from "~/core/types";

export class ApiClientError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly body?: ApiErrorBody | ApiEnvelope<unknown>;

	constructor(
		message: string,
		options?: { status?: number; code?: string; body?: ApiErrorBody | ApiEnvelope<unknown> },
	) {
		super(message);
		this.name = "ApiClientError";
		this.status = options?.status;
		this.code = options?.code;
		this.body = options?.body;
	}
}

export function isApiClientError(error: unknown): error is ApiClientError {
	return error instanceof ApiClientError;
}

export function getApiErrorMessage(
	body: ApiEnvelope<unknown> | ApiErrorBody | null | undefined,
	fallback: string,
): string {
	if (!body) {
		return fallback;
	}
	return body.message ?? body.error ?? fallback;
}

export function parseFetchError(error: unknown, fallback: string): ApiClientError {
	if (isApiClientError(error)) {
		return error;
	}

	const fetchError = error as {
		status?: number;
		statusCode?: number;
		data?: ApiEnvelope<unknown>;
		message?: string;
	};

	const status = fetchError.status ?? fetchError.statusCode;
	const body = fetchError.data;
	const message = getApiErrorMessage(body, fetchError.message ?? fallback);

	return new ApiClientError(message, {
		status,
		code: body?.error,
		body,
	});
}
