import type {
	ApiEnvelope,
	ApiErrorBody,
	ApiFailureResponse,
} from "~/core/types";

export class ApiClientError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly type?: string;
	readonly body?: ApiEnvelope<unknown> | ApiFailureResponse | ApiErrorBody;

	constructor(
		message: string,
		options?: {
			status?: number;
			code?: string;
			type?: string;
			body?: ApiEnvelope<unknown> | ApiFailureResponse | ApiErrorBody;
		},
	) {
		super(message);
		this.name = "ApiClientError";
		this.status = options?.status;
		this.code = options?.code;
		this.type = options?.type;
		this.body = options?.body;
	}
}

export function isApiClientError(error: unknown): error is ApiClientError {
	return error instanceof ApiClientError;
}

export function isApiFailureResponse(body: unknown): body is ApiFailureResponse {
	if (!body || typeof body !== "object" || !("error" in body)) {
		return false;
	}

	const nested = (body as ApiFailureResponse).error;
	return (
		typeof nested === "object"
		&& nested !== null
		&& typeof nested.message === "string"
	);
}

export function isApiEnvelope(body: unknown): body is ApiEnvelope<unknown> {
	return (
		typeof body === "object"
		&& body !== null
		&& "isSuccess" in body
		&& typeof (body as ApiEnvelope<unknown>).isSuccess === "boolean"
	);
}

/** Normalize `invalid_credentials` → `INVALID_CREDENTIALS` for app-level maps */
export function normalizeApiErrorCode(code?: string): string | undefined {
	if (!code) {
		return undefined;
	}

	return code.trim().toUpperCase().replace(/-/g, "_");
}

export function getApiErrorCode(body: unknown): string | undefined {
	if (isApiFailureResponse(body)) {
		return normalizeApiErrorCode(body.error.code);
	}

	if (isApiEnvelope(body) && body.error) {
		return normalizeApiErrorCode(body.error);
	}

	return undefined;
}

export function getApiErrorType(body: unknown): string | undefined {
	if (isApiFailureResponse(body)) {
		return body.error.type;
	}

	return undefined;
}

export function getApiErrorMessage(
	body: unknown,
	fallback: string,
): string {
	if (!body || typeof body !== "object") {
		return fallback;
	}

	if (isApiFailureResponse(body)) {
		return body.error.message || fallback;
	}

	if (isApiEnvelope(body)) {
		if (!body.isSuccess) {
			return body.message ?? body.error ?? fallback;
		}
	}

	if ("message" in body && typeof (body as { message?: string }).message === "string") {
		return (body as { message: string }).message;
	}

	return fallback;
}

export function parseFetchError(error: unknown, fallback: string): ApiClientError {
	if (isApiClientError(error)) {
		return error;
	}

	const fetchError = error as {
		status?: number;
		statusCode?: number;
		data?: unknown;
		message?: string;
	};

	const status = fetchError.status ?? fetchError.statusCode;
	const body = fetchError.data;
	const message = getApiErrorMessage(body, fetchError.message ?? fallback);
	const code = getApiErrorCode(body);
	const type = getApiErrorType(body);

	return new ApiClientError(message, {
		status,
		code,
		type,
		body: body as ApiEnvelope<unknown> | ApiFailureResponse | ApiErrorBody | undefined,
	});
}
