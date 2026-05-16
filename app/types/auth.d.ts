export interface AuthUser {
	id: string;
	name: string;
	email: string;
}

export interface AuthSession {
	user: AuthUser;
}

export type AuthResult = { ok: true } | { ok: false; error: string };

export type OAuthProvider = "google" | "github";
