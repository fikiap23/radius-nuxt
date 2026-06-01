import type { AuthTokenResponse } from "~/features/auth/contracts/auth.contract";
import { useAuthApi } from "~/features/auth/composables/useAuthApi";
import { ACCESS_TOKEN_KEY, OAUTH_STATE_KEY } from "~/features/auth/constants/auth";
import type { AuthResult, AuthSession, AuthUser, OAuthProvider } from "~/features/auth/types/auth";
import { formatAuthApiError, formatAuthNetworkError } from "~/features/auth/utils/auth-errors";
import { mapUserDtoToAuthUser } from "~/features/auth/utils/auth-mapper";
import { useUsersApi } from "~/features/users/composables/useUsersApi";

const SESSION_COOKIE = "radius-session";

export const useAuthStore = defineStore("auth", () => {
	const session = useCookie<AuthSession | null>(SESSION_COOKIE, {
		default: () => null,
		sameSite: "lax",
	});

	/** Bumped on logout so in-flight /users/me cannot restore session afterward. */
	const authGeneration = ref(0);

	const user = computed(() => session.value?.user ?? null);
	const isAuthenticated = computed(() => Boolean(session.value?.user));

	function setSession(authUser: AuthUser) {
		session.value = { user: authUser };
	}

	function clearSession() {
		session.value = null;
	}

	function setAccessToken(token: string) {
		if (!import.meta.client) {
			return;
		}
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
	}

	function clearAccessToken() {
		if (!import.meta.client) {
			return;
		}
		try {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
		}
		catch {
			// Storage may be blocked (private mode, etc.)
		}
	}

	function getAccessToken(): string | null {
		if (!import.meta.client) {
			return null;
		}
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	}

	function clearAuth() {
		authGeneration.value += 1;
		clearSession();
		clearAccessToken();
		if (import.meta.client) {
			sessionStorage.removeItem(OAUTH_STATE_KEY);
		}
	}

	function isAuthStale(epoch: number) {
		return epoch !== authGeneration.value;
	}

	function applyAuthTokenResponse(data: AuthTokenResponse) {
		setAccessToken(data.accessToken);
		setSession(mapUserDtoToAuthUser(data.user));
	}

	function getOAuthCallbackRedirectUri(provider: OAuthProvider): string {
		const path = `/auth/callback/${provider}`;
		if (import.meta.client) {
			return `${window.location.origin}${path}`;
		}
		return path;
	}

	async function fetchGoogleAuthUrl(): Promise<
		{ ok: true; data: { authUrl: string; state: string } } | { ok: false; error: string }
	> {
		const authApi = useAuthApi();
		const result = await authApi.getGoogleSsoUrl(getOAuthCallbackRedirectUri("google"));

		if (!result.ok) {
			return {
				ok: false,
				error: result.error || "Could not start Google sign-in.",
			};
		}

		if (!result.data.authUrl || !result.data.state) {
			return { ok: false, error: "Invalid Google sign-in response from server." };
		}

		return { ok: true, data: result.data };
	}

	async function loginWithGoogle(): Promise<AuthResult> {
		if (!import.meta.client) {
			return { ok: false, error: "Google sign-in is only available in the browser." };
		}

		const urlResult = await fetchGoogleAuthUrl();
		if (!urlResult.ok) {
			return { ok: false, error: formatAuthNetworkError(urlResult.error) };
		}

		sessionStorage.setItem(OAUTH_STATE_KEY, urlResult.data.state);
		window.location.href = urlResult.data.authUrl;

		return { ok: true, externalRedirect: true };
	}

	async function completeGoogleCallback(code: string): Promise<AuthResult> {
		if (!import.meta.client) {
			return { ok: false, error: "Callback can only run in the browser." };
		}

		const savedState = sessionStorage.getItem(OAUTH_STATE_KEY);
		if (!savedState) {
			return {
				ok: false,
				error: "Missing sign-in state. Start again from the login page.",
			};
		}

		const epoch = authGeneration.value;
		const authApi = useAuthApi();

		try {
			const result = await authApi.completeGoogleSso({ code, state: savedState });

			sessionStorage.removeItem(OAUTH_STATE_KEY);

			if (isAuthStale(epoch)) {
				return { ok: false, error: "Sign-in was cancelled." };
			}

			if (!result.ok) {
				return {
					ok: false,
					error: result.error || "Google sign-in failed.",
				};
			}

			applyAuthTokenResponse(result.data);

			return { ok: true };
		}
		catch {
			sessionStorage.removeItem(OAUTH_STATE_KEY);
			return {
				ok: false,
				error: "Google sign-in failed. The code may have expired.",
			};
		}
	}

	async function fetchGithubAuthUrl(): Promise<
		{ ok: true; data: { authUrl: string; state: string } } | { ok: false; error: string }
	> {
		const authApi = useAuthApi();
		const result = await authApi.getGithubSsoUrl(getOAuthCallbackRedirectUri("github"));

		if (!result.ok) {
			return {
				ok: false,
				error: result.error || "Could not start GitHub sign-in.",
			};
		}

		if (!result.data.authUrl || !result.data.state) {
			return { ok: false, error: "Invalid GitHub sign-in response from server." };
		}

		return { ok: true, data: result.data };
	}

	async function loginWithGithub(): Promise<AuthResult> {
		if (!import.meta.client) {
			return { ok: false, error: "GitHub sign-in is only available in the browser." };
		}

		const urlResult = await fetchGithubAuthUrl();
		if (!urlResult.ok) {
			return { ok: false, error: formatAuthNetworkError(urlResult.error) };
		}

		sessionStorage.setItem(OAUTH_STATE_KEY, urlResult.data.state);
		window.location.href = urlResult.data.authUrl;

		return { ok: true, externalRedirect: true };
	}

	async function completeGithubCallback(code: string): Promise<AuthResult> {
		if (!import.meta.client) {
			return { ok: false, error: "Callback can only run in the browser." };
		}

		const savedState = sessionStorage.getItem(OAUTH_STATE_KEY);
		if (!savedState) {
			return {
				ok: false,
				error: "Missing sign-in state. Start again from the login page.",
			};
		}

		const epoch = authGeneration.value;
		const authApi = useAuthApi();

		try {
			const result = await authApi.completeGithubSso({ code, state: savedState });

			sessionStorage.removeItem(OAUTH_STATE_KEY);

			if (isAuthStale(epoch)) {
				return { ok: false, error: "Sign-in was cancelled." };
			}

			if (!result.ok) {
				return {
					ok: false,
					error: result.error || "GitHub sign-in failed.",
				};
			}

			applyAuthTokenResponse(result.data);

			return { ok: true };
		}
		catch {
			sessionStorage.removeItem(OAUTH_STATE_KEY);
			return {
				ok: false,
				error: "GitHub sign-in failed. The code may have expired.",
			};
		}
	}

	async function loginWithEmail(
		email: string,
		password: string,
		_remember?: boolean,
	): Promise<AuthResult> {
		const epoch = authGeneration.value;
		const authApi = useAuthApi();
		const result = await authApi.login({ email, password });

		if (isAuthStale(epoch)) {
			return { ok: false, error: "Sign-in was cancelled." };
		}

		if (!result.ok) {
			return {
				ok: false,
				error: formatAuthNetworkError(result.error),
			};
		}

		applyAuthTokenResponse(result.data);
		return { ok: true };
	}

	async function registerWithEmail(payload: {
		name: string;
		email: string;
		password: string;
	}): Promise<AuthResult> {
		const epoch = authGeneration.value;
		const authApi = useAuthApi();
		const result = await authApi.register(payload);

		if (isAuthStale(epoch)) {
			return { ok: false, error: "Registration was cancelled." };
		}

		if (!result.ok) {
			return {
				ok: false,
				error: formatAuthNetworkError(result.error),
			};
		}

		applyAuthTokenResponse(result.data);
		return { ok: true };
	}

	async function fetchCurrentUser(): Promise<AuthResult> {
		const epoch = authGeneration.value;
		const usersApi = useUsersApi();
		const result = await usersApi.getMe();

		if (epoch !== authGeneration.value) {
			return { ok: false, error: "Aborted" };
		}

		if (!result.ok) {
			return {
				ok: false,
				error: formatAuthApiError(result.error),
			};
		}

		setSession(mapUserDtoToAuthUser(result.data));
		return { ok: true };
	}

	async function hydrateSession(): Promise<void> {
		if (!import.meta.client) {
			return;
		}

		const epoch = authGeneration.value;

		const token = getAccessToken();
		if (!token) {
			if (session.value?.user) {
				clearSession();
			}
			return;
		}

		const result = await fetchCurrentUser();
		if (epoch !== authGeneration.value) {
			return;
		}

		if (!result.ok) {
			clearAuth();
		}
	}

	async function loginWithOAuth(provider: OAuthProvider): Promise<AuthResult> {
		if (provider === "google") {
			return loginWithGoogle();
		}

		return loginWithGithub();
	}

	async function logout() {
		clearAuth();
		await navigateTo("/auth/login", { replace: true });
	}

	return {
		session,
		user,
		isAuthenticated,
		getAccessToken,
		loginWithEmail,
		registerWithEmail,
		loginWithOAuth,
		loginWithGoogle,
		completeGoogleCallback,
		loginWithGithub,
		completeGithubCallback,
		fetchCurrentUser,
		hydrateSession,
		logout,
	};
});
