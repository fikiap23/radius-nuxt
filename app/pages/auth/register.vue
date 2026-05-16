<template>
	<AuthFormCard
		eyebrow="Get started"
		title="Create your account"
		description="Create your workspace and invite your team when you're ready."
	>
		<UAuthForm
			:schema="schema"
			:fields="fields"
			:providers="providers"
			:loading="loading"
			:ui="{ ...authFormUi }"
			separator="or use your email"
			:submit="{
				label: 'Create account',
				block: true,
				color: 'primary',
				class:
					'font-semibold shadow-md shadow-primary/25 transition-transform hover:scale-[1.01] active:scale-[0.99]',
			}"
			@submit="onSubmit"
		>
			<template #footer>
				<p class="text-center text-sm text-muted">
					Already have an account?
					<ULink
						to="/auth/login"
						class="text-primary font-semibold hover:underline underline-offset-4"
					>
						Sign in
					</ULink>
				</p>
				<p class="mt-4 text-center text-xs text-muted leading-relaxed">
					By signing up, you agree to our
					<ULink
						to="/terms"
						class="text-primary hover:underline underline-offset-4"
					>
						Terms
					</ULink>
					and
					<ULink
						to="/privacy"
						class="text-primary hover:underline underline-offset-4"
					>
						Privacy Policy
					</ULink>
					.
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
	title: `Sign up — ${APP_NAME}`,
	description: `Create your ${APP_NAME} account with Google, GitHub, or email.`,
});

const toast = useToast();
const loading = ref(false);
const providers = useAuthProviders();

const fields: AuthFormField[] = [
	{
		name: "name",
		type: "text",
		label: "Full name",
		placeholder: "Alex Rivera",
		required: true,
		autocomplete: "name",
	},
	{
		name: "email",
		type: "email",
		label: "Work email",
		placeholder: "you@company.com",
		required: true,
		autocomplete: "email",
	},
	{
		name: "password",
		type: "password",
		label: "Password",
		placeholder: "8+ characters",
		required: true,
		autocomplete: "new-password",
	},
	{
		name: "confirmPassword",
		type: "password",
		label: "Confirm password",
		placeholder: "Same as above",
		required: true,
		autocomplete: "new-password",
	},
];

const schema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.email("Invalid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Include at least one uppercase letter")
			.regex(/[0-9]/, "Include at least one number"),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
	loading.value = true;

	try {
		// TODO: connect to register API (e.g. Better Auth, Nuxt Auth, or custom)
		await new Promise(resolve => setTimeout(resolve, 800));

		toast.add({
			title: "You're on the list",
			description: `Nice to meet you, ${event.data.name}.`,
			color: "success",
			icon: "i-lucide-party-popper",
		});

		await navigateTo("/auth/login");
	}
	catch {
		toast.add({
			title: "Something went wrong",
			description: "Give it another shot in a moment.",
			color: "error",
			icon: "i-lucide-circle-alert",
		});
	}
	finally {
		loading.value = false;
	}
}
</script>
