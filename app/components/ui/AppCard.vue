<template>
	<section
		:class="[
			'app-card',
			variantClass,
			props.padding === 'sm' && 'p-4',
			props.padding === 'md' && 'p-5 sm:p-6',
			props.padding === 'lg' && 'p-6 sm:p-8',
			props.interactive && 'app-card--interactive',
		]"
	>
		<header
			v-if="title || description || icon || $slots.actions"
			class="mb-4 flex items-start justify-between gap-4"
		>
			<div class="flex min-w-0 items-start gap-3">
				<span
					v-if="icon"
					class="app-card__icon-badge shrink-0"
					aria-hidden="true"
				>
					<UIcon
						:name="icon"
						class="size-4.5"
					/>
				</span>
				<div class="min-w-0 space-y-1">
					<h2
						v-if="title"
						class="font-display text-lg font-bold tracking-tight text-highlighted"
					>
						{{ title }}
					</h2>
					<p
						v-if="description"
						class="text-sm leading-relaxed text-muted"
					>
						{{ description }}
					</p>
				</div>
			</div>
			<div
				v-if="$slots.actions"
				class="shrink-0"
			>
				<slot name="actions" />
			</div>
		</header>

		<slot />
	</section>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		title?: string;
		description?: string;
		icon?: string;
		variant?: "surface" | "muted" | "ghost";
		padding?: "sm" | "md" | "lg";
		interactive?: boolean;
	}>(),
	{
		variant: "surface",
		padding: "md",
		interactive: false,
	},
);

const variantClass = computed(() => `app-card--${props.variant}`);
</script>
