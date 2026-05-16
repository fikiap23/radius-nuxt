export default defineNuxtRouteMiddleware(() => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated.value) {
		return navigateTo("/app");
	}
});
