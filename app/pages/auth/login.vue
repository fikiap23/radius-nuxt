<template>
	<AuthFormCard
		eyebrow="Sign in"
		title="Welcome back"
		description="Access your workspace, boards, and assigned tasks."
	>
		<UAuthForm
			:schema="schema"
			:fields="fields"
			:providers="providers"
			:loading="loading"
			:ui="{ ...authFormUi }"
			separator="or continue with email"
			:submit="{
				label: 'Sign in',
				block: true,
				color: 'primary',
				class:
					'font-semibold shadow-md shadow-primary/25 transition-transform hover:scale-[1.01] active:scale-[0.99]',
			}"
			@submit="onSubmit"
		>
			<template #password-hint>
				<ULink
					to="/auth/forgot-password"
					class="text-primary text-sm font-medium hover:underline underline-offset-4"
				>
					Forgot password?
				</ULink>
			</template>

			<template #footer>
				<p class="text-center text-sm text-muted">
					Don't have an account?
					<ULink
						to="/auth/register"
						class="text-primary font-semibold hover:underline underline-offset-4"
					>
						Create one
					</ULink>
				</p>
			</template>
		</UAuthForm>
	</AuthFormCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { APP_NAME } from "~/config/brand";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: `Sign in — ${APP_NAME}`,
	description: `Sign in to ${APP_NAME} with Google, GitHub, or email.`,
});

const toast = useToast();
const loading = ref(false);
const providers = useAuthProviders();

const fields: AuthFormField[] = [
	{
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "you@company.com",
		required: true,
		autocomplete: "email",
	},
	{
		name: "password",
		type: "password",
		label: "Password",
		placeholder: "Your password",
		required: true,
		autocomplete: "current-password",
	},
	{
		name: "remember",
		type: "checkbox",
		label: "Keep me signed in",
	},
];

const schema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
	remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(_event: FormSubmitEvent<Schema>) {
	loading.value = true;

	try {
		// TODO: connect to login API (e.g. Better Auth, Nuxt Auth, or custom)
		await new Promise(resolve => setTimeout(resolve, 800));

		toast.add({
			title: "You're in",
			description: "Your workspace is ready.",
			color: "success",
			icon: "i-lucide-hand-metal",
		});

		await navigateTo("/");
	}
	catch {
		toast.add({
			title: "Couldn't sign you in",
			description: "Double-check your email and password.",
			color: "error",
			icon: "i-lucide-circle-alert",
		});
	}
	finally {
		loading.value = false;
	}
}
</script>
