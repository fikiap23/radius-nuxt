/**
 * Thin wrapper around Pinia auth store — keeps existing call sites stable.
 * Prefer `useAuthStore()` in new code (stores, middleware, complex flows).
 */
export function useAuth() {
	const store = useAuthStore();
	const { user, isAuthenticated } = storeToRefs(store);

	return {
		user,
		isAuthenticated,
		getAccessToken: store.getAccessToken,
		loginWithEmail: store.loginWithEmail,
		registerWithEmail: store.registerWithEmail,
		loginWithOAuth: store.loginWithOAuth,
		loginWithGoogle: store.loginWithGoogle,
		logout: store.logout,
	};
}
