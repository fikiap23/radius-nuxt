<template>
	<UBadge
		:label="label"
		:color="color"
		variant="subtle"
		:size="size"
	/>
</template>

<script setup lang="ts">
import type { ProjectStatus } from "~/types/project";
import { projectStatusLabel } from "~/utils/project";

const props = withDefaults(
	defineProps<{
		status: ProjectStatus;
		size?: "xs" | "sm" | "md";
	}>(),
	{
		size: "xs",
	},
);

const label = computed(() => projectStatusLabel(props.status));

const color = computed(() => {
	switch (props.status) {
		case "on_hold":
			return "warning" as const;
		case "completed":
			return "neutral" as const;
		default:
			return "primary" as const;
	}
});
</script>
