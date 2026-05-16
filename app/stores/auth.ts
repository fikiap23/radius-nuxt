import type { AuthResult, AuthSession, AuthUser, OAuthProvider } from "~/types/auth";

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
	partial: Pick<AuthUser, "name" | "email"> & Partial<Pick<AuthUser, "id">>,
): AuthUser {
	return {
		id: partial.id ?? createId(),
		name: partial.name,
		email: partial.email,
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
		await delay();

		const labels: Record<OAuthProvider, string> = {
			google: "Google User",
			github: "GitHub User",
		};

		setSession(
			createUser({
				name: labels[provider],
				email: `${provider}@radius.mock`,
			}),
		);

		return { ok: true };
	}

	async function logout() {
		clearSession();
		await navigateTo("/auth/login");
	}

	return {
		session,
		user,
		isAuthenticated,
		loginWithEmail,
		registerWithEmail,
		loginWithOAuth,
		logout,
	};
});
