<template>
	<section
		:class="[
			'rounded-xl border border-muted bg-elevated shadow-card',
			props.padding === 'sm' && 'p-4',
			props.padding === 'md' && 'p-6',
			props.padding === 'lg' && 'p-8',
			props.interactive && 'transition-colors hover:bg-accented/50',
		]"
	>
		<header
			v-if="title || description || $slots.actions"
			class="mb-4 flex items-start justify-between gap-4"
		>
			<div class="space-y-1">
				<h2
					v-if="title"
					class="font-display text-lg font-bold text-highlighted"
				>
					{{ title }}
				</h2>
				<p
					v-if="description"
					class="text-sm text-muted"
				>
					{{ description }}
				</p>
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
/**
 * Example reusable surface component.
 * ✅ semantic: bg-elevated, text-highlighted, text-muted, border-muted
 * ❌ avoid: bg-white, text-gray-500, border-stone-200
 */
const props = withDefaults(
	defineProps<{
		title?: string;
		description?: string;
		padding?: "sm" | "md" | "lg";
		interactive?: boolean;
	}>(),
	{
		padding: "md",
		interactive: false,
	},
);
</script>
