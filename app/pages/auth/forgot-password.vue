<template>
	<AuthFormCard
		eyebrow="Account recovery"
		title="Forgot your password?"
		description="Enter your email and we'll send you a reset link."
	>
		<UForm
			:state="state"
			class="space-y-4"
			@submit="onSubmit"
		>
			<UFormField
				label="Email"
				name="email"
				required
			>
				<UInput
					v-model="state.email"
					type="email"
					placeholder="you@company.com"
					autocomplete="email"
				/>
			</UFormField>
			<UButton
				type="submit"
				label="Send reset link"
				block
				color="primary"
			/>
			<p class="text-center text-sm text-muted">
				<ULink
					to="/auth/login"
					class="text-primary font-medium hover:underline"
				>
					Back to sign in
				</ULink>
			</p>
		</UForm>
	</AuthFormCard>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({ layout: "auth" });

useSeoMeta({
	title: `Forgot password — ${APP_NAME}`,
});

const toast = useToast();
const state = reactive({ email: "" });

async function onSubmit() {
	// TODO: connect to password reset API
	toast.add({
		title: "Check your inbox",
		description: "If an account exists, we sent a reset link.",
		color: "success",
		icon: "i-lucide-mail",
	});
}
</script>
