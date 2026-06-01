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
import type { TaskPriority } from "~/features/task/types/task";
import { taskPriorityColor, taskPriorityLabel } from "~/features/task/utils/task";

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
