import type { OAuthProvider } from "~/types/auth";

export function useAuthProviders() {
	const { loginWithOAuth } = useAuth();
	const oauthLoading = ref<OAuthProvider | null>(null);

	async function handleOAuth(provider: OAuthProvider) {
		oauthLoading.value = provider;

		try {
			const result = await loginWithOAuth(provider);

			if (!result.ok) {
				useToast().add({
					title: "Sign-in failed",
					description: result.error,
					color: "error",
					icon: "i-lucide-circle-alert",
				});
				return;
			}

			if (result.externalRedirect) {
				return;
			}

			await navigateTo("/app");
		}
		catch {
			useToast().add({
				title: "Sign-in failed",
				description: "Something went wrong. Please try again.",
				color: "error",
				icon: "i-lucide-circle-alert",
			});
		}
		finally {
			oauthLoading.value = null;
		}
	}

	return computed(() => [
		{
			label: "Google",
			icon: "i-simple-icons-google",
			color: "neutral" as const,
			variant: "soft" as const,
			block: true,
			class: "transition-transform hover:scale-[1.02] active:scale-[0.98]",
			loading: oauthLoading.value === "google",
			onClick: () => handleOAuth("google"),
		},
		{
			label: "GitHub",
			icon: "i-simple-icons-github",
			color: "neutral" as const,
			variant: "soft" as const,
			block: true,
			class: "transition-transform hover:scale-[1.02] active:scale-[0.98]",
			loading: oauthLoading.value === "github",
			onClick: () => handleOAuth("github"),
		},
	]);
}
