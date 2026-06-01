<template>
	<AuthFormCard
		eyebrow="GitHub sign-in"
		:title="title"
		:description="description"
	>
		<div class="flex flex-col items-center gap-4 py-6">
			<UIcon
				v-if="status === 'loading'"
				name="i-lucide-loader-circle"
				class="size-10 text-primary animate-spin"
			/>
			<template v-else-if="status === 'error'">
				<UAlert
					color="error"
					variant="soft"
					icon="i-lucide-circle-alert"
					:title="errorMessage"
				/>
				<UButton
					to="/auth/login"
					label="Back to sign in"
					block
					color="primary"
					class="w-full"
				/>
			</template>
		</div>
	</AuthFormCard>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: `GitHub sign-in — ${APP_NAME}`,
	robots: "noindex, nofollow",
});

const route = useRoute();
const authStore = useAuthStore();

const status = ref<"loading" | "error">("loading");
const errorMessage = ref("Something went wrong.");

const title = computed(() =>
	status.value === "loading" ? "Completing sign-in…" : "Sign-in failed",
);

const description = computed(() =>
	status.value === "loading"
		? "Exchanging your GitHub authorization with the server."
		: "We could not finish GitHub sign-in.",
);

onMounted(async () => {
	const oauthError = typeof route.query.error === "string" ? route.query.error : null;
	if (oauthError) {
		status.value = "error";
		errorMessage.value = oauthError === "access_denied"
			? "You cancelled GitHub sign-in."
			: `GitHub returned an error: ${oauthError}`;
		return;
	}

	const code = typeof route.query.code === "string" ? route.query.code : null;
	if (!code) {
		status.value = "error";
		errorMessage.value = "Missing authorization code from GitHub.";
		return;
	}

	const result = await authStore.completeGithubCallback(code);

	if (!result.ok) {
		status.value = "error";
		errorMessage.value = result.error;
		return;
	}

	const redirect = typeof route.query.redirect === "string"
		? route.query.redirect
		: "/app";

	await navigateTo(redirect, { replace: true });
});
</script>
