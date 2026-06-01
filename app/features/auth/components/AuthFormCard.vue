<template>
	<div class="auth-card auth-in w-full max-w-md">
		<div
			class="pointer-events-none absolute -inset-e-16 -top-16 size-40 rounded-full bg-primary/15 blur-3xl"
			aria-hidden="true"
		/>
		<div
			class="pointer-events-none absolute -bottom-12 -inset-s-10 size-32 rounded-full bg-secondary/15 blur-2xl"
			aria-hidden="true"
		/>

		<div class="relative space-y-6">
			<header
				v-if="eyebrow || title || description"
				class="space-y-2 auth-in auth-in-delay-1"
			>
				<p
					v-if="eyebrow"
					class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
				>
					<span class="size-1.5 rounded-full bg-primary animate-pulse" />
					{{ eyebrow }}
				</p>
				<h1
					v-if="title"
					class="font-display text-3xl font-extrabold tracking-tight text-default text-balance"
				>
					{{ title }}
				</h1>
				<p
					v-if="description"
					class="text-sm text-muted leading-relaxed"
				>
					{{ description }}
				</p>
			</header>

			<div class="auth-in auth-in-delay-2">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	eyebrow?: string;
	title?: string;
	description?: string;
}>();
</script>
