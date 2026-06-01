/**
 * Shared API contract types — mirror backend envelope & cross-cutting shapes.
 * @see https://github.com/your-org/api — update when OpenAPI spec is available
 */

/** Standard success/error wrapper from the Radius API */
export interface ApiEnvelope<TData = unknown> {
	isSuccess: boolean;
	data?: TData;
	message?: string;
	error?: string;
}

/** Known SSO / auth error codes returned by the backend */
export type AuthErrorCode =
	| "SSO_INVALID_STATE"
	| "SSO_AUTHENTICATION_FAILED"
	| string;

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
