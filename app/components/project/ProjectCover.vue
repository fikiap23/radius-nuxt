<template>
	<div
		class="project-cover"
		:class="[
			`project-cover--${cover}`,
			sizeClass,
			roundedClass,
		]"
		aria-hidden="true"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
import type { ProjectCoverPreset } from "~/types/project";

const props = withDefaults(
	defineProps<{
		cover: ProjectCoverPreset;
		size?: "sm" | "md" | "lg" | "banner";
		rounded?: "md" | "lg" | "xl" | "none";
	}>(),
	{
		size: "md",
		rounded: "lg",
	},
);

const sizeClass = computed(() => {
	switch (props.size) {
		case "sm":
			return "project-cover--sm";
		case "lg":
			return "project-cover--lg";
		case "banner":
			return "project-cover--banner";
		default:
			return "project-cover--md";
	}
});

const roundedClass = computed(() =>
	props.rounded === "none" ? "" : `project-cover--rounded-${props.rounded}`,
);
</script>
