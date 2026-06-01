/** Warm API client singleton (auth header + 401 handler) on app boot. */
export default defineNuxtPlugin(() => {
	useApiClient();
});
