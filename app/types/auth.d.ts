export interface AuthUser {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string | null;
}

export interface AuthSession {
	user: AuthUser;
}

export type AuthResult =
	| { ok: true; externalRedirect?: boolean }
	| { ok: false; error: string };

export type OAuthProvider = "google" | "github";
