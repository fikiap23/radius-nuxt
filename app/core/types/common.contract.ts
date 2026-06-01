/**
 * Shared API contract types — mirror backend envelope & cross-cutting shapes.
 */

/** Standard success wrapper from the Radius API */
export interface ApiEnvelope<TData = unknown> {
	isSuccess: boolean;
	data?: TData;
	message?: string;
	/** Legacy flat error code when `isSuccess` is false */
	error?: string;
}

/** Nested error object on failed HTTP responses (4xx/5xx) */
export interface ApiErrorDetail {
	type: string;
	code: string;
	message: string;
}

export interface ApiFailureResponse {
	error: ApiErrorDetail;
}

/** Known SSO / auth error codes returned by the backend */
export type AuthErrorCode =
	| "SSO_INVALID_STATE"
	| "SSO_AUTHENTICATION_FAILED"
	| "INVALID_CREDENTIALS"
	| "EMAIL_ALREADY_EXISTS"
	| "VALIDATION_ERROR"
	| "USER_NOT_FOUND"
	| string;

/** @deprecated Use ApiFailureResponse or ApiEnvelope */
export interface ApiErrorBody {
	isSuccess: false;
	message?: string;
	error?: string;
}

export interface PaginationMeta {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export interface PaginatedData<TItem> {
	items: TItem[];
	meta: PaginationMeta;
}
