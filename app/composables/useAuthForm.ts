export function useAuthProviders() {
	return [
		{
			label: "Google",
			icon: "i-simple-icons-google",
			color: "neutral" as const,
			variant: "soft" as const,
			block: true,
			class: "transition-transform hover:scale-[1.02] active:scale-[0.98]",
			onClick: () => signInWithOAuth("google"),
		},
		{
			label: "GitHub",
			icon: "i-simple-icons-github",
			color: "neutral" as const,
			variant: "soft" as const,
			block: true,
			class: "transition-transform hover:scale-[1.02] active:scale-[0.98]",
			onClick: () => signInWithOAuth("github"),
		},
	];
}

export function signInWithOAuth(provider: "google" | "github") {
	if (import.meta.client) {
		window.location.assign(`/api/auth/${provider}`);
	}
}
