const AUTH_ERROR_MESSAGES: Record<string, string> = {
	EMAIL_ALREADY_EXISTS: "This email is already registered. Sign in instead.",
	INVALID_CREDENTIALS: "Double-check your email and password.",
	VALIDATION_ERROR: "Please check your input and try again.",
	USER_NOT_FOUND: "Your account could not be found. Sign in again.",
};

export function formatAuthApiError(error: string, code?: string): string {
	if (code && AUTH_ERROR_MESSAGES[code]) {
		return AUTH_ERROR_MESSAGES[code];
	}

	if (error && error !== "Request failed.") {
		return error;
	}

	return "Something went wrong. Please try again.";
}

export function formatAuthNetworkError(error: string): string {
	if (error.includes("fetch") || error.includes("Failed to fetch")) {
		return "Cannot reach the API. Is the backend running on port 8080?";
	}

	return formatAuthApiError(error);
}
