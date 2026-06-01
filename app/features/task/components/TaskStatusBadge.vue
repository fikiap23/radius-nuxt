<template>
	<UBadge
		:label="taskStatusLabel(status)"
		:color="taskStatusColor(status)"
		variant="subtle"
		:size="size"
	/>
</template>

<script setup lang="ts">
import type { TaskStatus } from "~/features/task/types/task";
import { taskStatusColor, taskStatusLabel } from "~/features/task/utils/task";

withDefaults(
	defineProps<{
		status: TaskStatus;
		size?: "xs" | "sm" | "md";
	}>(),
	{ size: "xs" },
);
</script>
