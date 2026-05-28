<template>
	<UBadge
		v-if="showBadge"
		:label="taskPriorityLabel(priority)"
		:color="taskPriorityColor(priority)"
		variant="outline"
		:size="size"
	/>
</template>

<script setup lang="ts">
import type { TaskPriority } from "~/types/task";
import { taskPriorityColor, taskPriorityLabel } from "~/utils/task";

const props = withDefaults(
	defineProps<{
		priority: TaskPriority;
		size?: "xs" | "sm" | "md";
	}>(),
	{ size: "xs" },
);

const showBadge = computed(
	() => props.priority === "high" || props.priority === "urgent",
);
</script>
