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
		localStorage.removeItem(ACCESS_TOKEN_KEY);
	}

	function getAccessToken(): string | null {
		if (!import.meta.client) {
			return null;
		}
		return localStorage.getItem(ACCESS_TOKEN_KEY);
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

		const authApi = useAuthApi();

		try {
			const result = await authApi.completeGoogleSso({ code, state: savedState });

			sessionStorage.removeItem(OAUTH_STATE_KEY);

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

		const authApi = useAuthApi();

		try {
			const result = await authApi.completeGithubSso({ code, state: savedState });

			sessionStorage.removeItem(OAUTH_STATE_KEY);

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
		const authApi = useAuthApi();
		const result = await authApi.login({ email, password });

		if (!result.ok) {
			return {
				ok: false,
				error: formatAuthApiError(
					formatAuthNetworkError(result.error),
					result.code,
				),
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
		const authApi = useAuthApi();
		const result = await authApi.register(payload);

		if (!result.ok) {
			return {
				ok: false,
				error: formatAuthApiError(
					formatAuthNetworkError(result.error),
					result.code,
				),
			};
		}

		applyAuthTokenResponse(result.data);
		return { ok: true };
	}

	async function fetchCurrentUser(): Promise<AuthResult> {
		const usersApi = useUsersApi();
		const result = await usersApi.getMe();

		if (!result.ok) {
			return {
				ok: false,
				error: formatAuthApiError(result.error, result.code),
			};
		}

		setSession(mapUserDtoToAuthUser(result.data));
		return { ok: true };
	}

	async function hydrateSession(): Promise<void> {
		if (!import.meta.client) {
			return;
		}

		const token = getAccessToken();
		if (!token) {
			if (session.value?.user) {
				clearSession();
			}
			return;
		}

		const result = await fetchCurrentUser();
		if (!result.ok) {
			clearAccessToken();
			clearSession();
		}
	}

	async function loginWithOAuth(provider: OAuthProvider): Promise<AuthResult> {
		if (provider === "google") {
			return loginWithGoogle();
		}

		return loginWithGithub();
	}

	async function logout() {
		clearAccessToken();
		clearSession();
		await navigateTo("/auth/login");
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
