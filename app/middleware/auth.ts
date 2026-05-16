export default defineNuxtRouteMiddleware((to) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated.value) {
		return navigateTo({
			path: "/auth/login",
			query: { redirect: to.fullPath },
		});
	}
});
