export function formatAuthApiError(message: string): string {
	if (message && message !== "Request failed.") {
		return message;
	}

	return "Something went wrong. Please try again.";
}

export function formatAuthNetworkError(error: string): string {
	if (error.includes("fetch") || error.includes("Failed to fetch")) {
		return "Cannot reach the API. Is the backend running on port 8080?";
	}

	return formatAuthApiError(error);
}
