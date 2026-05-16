<template>
	<AuthFormCard
		eyebrow="Account recovery"
		title="Forgot your password?"
		:description="emailSent
			? undefined
			: 'Enter your email and we\'ll send you a reset link.'"
	>
		<div
			v-if="emailSent"
			class="space-y-6 text-center"
			aria-live="polite"
		>
			<div
				class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary"
			>
				<UIcon
					name="i-lucide-mail-check"
					class="size-7"
				/>
			</div>
			<div class="space-y-2">
				<h2 class="font-display text-xl font-bold text-highlighted">
					Check your inbox
				</h2>
				<p class="text-sm text-muted leading-relaxed">
					If an account exists for
					<span class="font-medium text-default">{{ submittedEmail }}</span>,
					we sent a password reset link.
				</p>
			</div>
			<UButton
				to="/auth/login"
				label="Back to sign in"
				color="primary"
				block
			/>
		</div>

		<UForm
			v-else
			:schema="schema"
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

			<UAlert
				v-if="formError"
				color="error"
				variant="soft"
				icon="i-lucide-circle-alert"
				:title="formError"
			/>

			<UButton
				type="submit"
				label="Send reset link"
				block
				color="primary"
				:loading="loading"
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
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { APP_NAME } from "~/config/brand";

definePageMeta({
	layout: "auth",
	middleware: "guest",
});

useSeoMeta({
	title: `Forgot password — ${APP_NAME}`,
});

const toast = useToast();
const loading = ref(false);
const emailSent = ref(false);
const formError = ref<string | null>(null);
const submittedEmail = ref("");

const state = reactive({ email: "" });

const schema = z.object({
	email: z.email("Invalid email address"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(_event: FormSubmitEvent<Schema>) {
	loading.value = true;
	formError.value = null;

	try {
		await new Promise(resolve => setTimeout(resolve, 600));
		submittedEmail.value = state.email;
		emailSent.value = true;

		toast.add({
			title: "Check your inbox",
			description: "If an account exists, we sent a reset link.",
			color: "success",
			icon: "i-lucide-mail",
		});
	}
	catch {
		formError.value = "Could not send the reset link. Try again shortly.";
	}
	finally {
		loading.value = false;
	}
}
</script>
