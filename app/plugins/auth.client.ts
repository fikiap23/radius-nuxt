/** Restore session from JWT via GET /users/me on client boot. */
export default defineNuxtPlugin(async () => {
	const authStore = useAuthStore();
	await authStore.hydrateSession();
});
