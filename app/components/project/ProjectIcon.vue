<template>
	<span
		class="project-icon"
		:class="sizeClass"
		aria-hidden="true"
	>
		<UIcon
			:name="icon"
			class="size-[1.1em]"
		/>
	</span>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		icon: string;
		size?: "sm" | "md" | "lg";
	}>(),
	{
		size: "md",
	},
);

const sizeClass = computed(() => `project-icon--${props.size}`);
</script>
