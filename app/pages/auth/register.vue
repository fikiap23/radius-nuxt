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

			<template #password-field="{ state: formState, field }">
				<UFormField
					:label="field.label"
					:name="field.name"
					:required="field.required"
				>
					<UInput
						v-model="formState.password"
						type="password"
						:placeholder="field.placeholder"
						:autocomplete="field.autocomplete"
					/>
					<AuthPasswordStrength
						class="mt-2"
						:password="formState.password ?? ''"
					/>
				</UFormField>
			</template>

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
			</template>
		</UAuthForm>
	</AuthFormCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { APP_NAME } from "~/config/brand";
import { authFormUi } from "~/utils/auth-form-ui";

definePageMeta({
	layout: "auth",
	middleware: "guest",
});

useSeoMeta({
	title: `Sign up — ${APP_NAME}`,
	description: `Create your ${APP_NAME} account with Google, GitHub, or email.`,
});

const toast = useToast();
const { registerWithEmail } = useAuth();
const loading = ref(false);
const formError = ref<string | null>(null);
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
	{
		name: "acceptTerms",
		type: "checkbox",
		label: "I agree to the Terms and Privacy Policy",
		required: true,
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
		acceptTerms: z.literal(true, {
			error: "You must accept the Terms and Privacy Policy",
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
	loading.value = true;
	formError.value = null;

	try {
		const result = await registerWithEmail({
			name: event.data.name,
			email: event.data.email,
			password: event.data.password,
		});

		if (!result.ok) {
			formError.value = result.error;
			return;
		}

		toast.add({
			title: "Welcome aboard",
			description: `Nice to meet you, ${event.data.name}.`,
			color: "success",
			icon: "i-lucide-party-popper",
		});

		await navigateTo("/app");
	}
	catch {
		formError.value = "Something went wrong. Give it another shot in a moment.";
	}
	finally {
		loading.value = false;
	}
}
</script>
