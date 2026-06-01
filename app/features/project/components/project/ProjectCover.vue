<template>
	<div
		class="project-cover"
		:class="[
			`project-cover--${cover}`,
			sizeClass,
			roundedClass,
			coverImageUrl && 'project-cover--has-image',
		]"
		aria-hidden="true"
	>
		<div
			v-if="coverImageUrl"
			class="project-cover__image"
			:style="{ backgroundImage: `url(${coverImageUrl})` }"
		/>
		<slot />
	</div>
</template>

<script setup lang="ts">
import type { ProjectCoverPreset } from "~/types/project";

const props = withDefaults(
	defineProps<{
		cover: ProjectCoverPreset;
		coverImageUrl?: string | null;
		size?: "sm" | "md" | "lg" | "banner";
		rounded?: "md" | "lg" | "xl" | "none";
	}>(),
	{
		coverImageUrl: null,
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
