<template>
	<div
		class="app-stat-pill"
		:class="toneClass"
	>
		<div
			v-if="icon"
			class="app-stat-pill__icon"
		>
			<UIcon
				:name="icon"
				class="size-4"
				aria-hidden="true"
			/>
		</div>
		<div class="min-w-0">
			<p class="app-stat-pill__value">
				{{ value }}
			</p>
			<p class="app-stat-pill__label">
				{{ label }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		label: string;
		value: string | number;
		icon?: string;
		tone?: "default" | "primary" | "warning";
	}>(),
	{
		tone: "default",
	},
);

const toneClass = computed(() => `app-stat-pill--${props.tone}`);
</script>
