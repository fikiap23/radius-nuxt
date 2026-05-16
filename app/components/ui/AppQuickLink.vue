<template>
	<NuxtLink
		:to="to"
		class="app-quick-link group"
	>
		<span
			class="app-quick-link__icon"
			:class="iconToneClass"
			aria-hidden="true"
		>
			<UIcon
				:name="icon"
				class="size-5"
			/>
		</span>

		<span class="min-w-0 flex-1">
			<span class="app-quick-link__title">{{ title }}</span>
			<span
				v-if="description"
				class="app-quick-link__description"
			>
				{{ description }}
			</span>
		</span>

		<UIcon
			name="i-lucide-arrow-up-right"
			class="app-quick-link__arrow size-4 shrink-0"
			aria-hidden="true"
		/>
	</NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		to: string;
		title: string;
		description?: string;
		icon: string;
		tone?: "primary" | "neutral" | "warning";
	}>(),
	{
		tone: "neutral",
	},
);

const iconToneClass = computed(() => `app-quick-link__icon--${props.tone}`);
</script>
