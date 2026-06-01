import { useAuthApi } from "~/features/auth/composables/useAuthApi";
import { ACCESS_TOKEN_KEY, OAUTH_STATE_KEY } from "~/features/auth/constants/auth";
import type { AuthResult, AuthSession, AuthUser, OAuthProvider } from "~/features/auth/types/auth";
import { mapUserDtoToAuthUser } from "~/features/auth/utils/auth-mapper";

const SESSION_COOKIE = "radius-session";
const MOCK_DELAY_MS = 600;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function createId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `user-${Date.now()}`;
}

function createUser(
	partial: Pick<AuthUser, "name" | "email"> & Partial<Pick<AuthUser, "id" | "avatarUrl">>,
): AuthUser {
	return {
		id: partial.id ?? createId(),
		name: partial.name,
		email: partial.email,
		avatarUrl: partial.avatarUrl ?? null,
	};
}

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
			const message = urlResult.error.includes("fetch")
				? "Cannot reach the API. Is the backend running on port 8080?"
				: urlResult.error;
			return { ok: false, error: message };
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

			setAccessToken(result.data.accessToken);
			setSession(mapUserDtoToAuthUser(result.data.user));

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
			const message = urlResult.error.includes("fetch")
				? "Cannot reach the API. Is the backend running on port 8080?"
				: urlResult.error;
			return { ok: false, error: message };
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

			setAccessToken(result.data.accessToken);
			setSession(mapUserDtoToAuthUser(result.data.user));

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
		await delay();

		if (password === "wrong") {
			return {
				ok: false,
				error: "Double-check your email and password.",
			};
		}

		const name = email.split("@")[0] ?? "User";
		setSession(
			createUser({
				name: name.charAt(0).toUpperCase() + name.slice(1),
				email,
			}),
		);

		return { ok: true };
	}

	async function registerWithEmail(payload: {
		name: string;
		email: string;
		password: string;
	}): Promise<AuthResult> {
		await delay();

		if (payload.password === "wrong") {
			return {
				ok: false,
				error: "Could not create your account. Try a different password.",
			};
		}

		setSession(
			createUser({
				name: payload.name,
				email: payload.email,
			}),
		);

		return { ok: true };
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
		logout,
	};
});
