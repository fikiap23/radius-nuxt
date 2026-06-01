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
			<template
				v-if="formError"
				#validation
			>
				<UAlert
					color="error"
					variant="soft"
					icon="i-lucide-circle-alert"
					:title="formError"
				/>
			</template>

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
import { APP_NAME } from "~/core/config/brand";
import { authFormUi } from "~/features/auth/utils/auth-form-ui";

definePageMeta({
	layout: "auth",
	middleware: "guest",
});

useSeoMeta({
	title: `Sign in — ${APP_NAME}`,
	description: `Sign in to ${APP_NAME} with Google, GitHub, or email.`,
});

const route = useRoute();
const toast = useToast();
const { loginWithEmail } = useAuth();
const loading = ref(false);
const formError = ref<string | null>(null);
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
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(72, "Password must be at most 72 characters"),
	remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
	loading.value = true;
	formError.value = null;

	try {
		const result = await loginWithEmail(
			event.data.email,
			event.data.password,
			event.data.remember,
		);

		if (!result.ok) {
			formError.value = result.error;
			return;
		}

		toast.add({
			title: "You're in",
			description: "Your workspace is ready.",
			color: "success",
			icon: "i-lucide-hand-metal",
		});

		const redirect = typeof route.query.redirect === "string"
			? route.query.redirect
			: "/app";

		await navigateTo(redirect);
	}
	catch {
		formError.value = "Something went wrong. Please try again.";
	}
	finally {
		loading.value = false;
	}
}
</script>
