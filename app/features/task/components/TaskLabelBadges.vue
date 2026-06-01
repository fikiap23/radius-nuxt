<template>
	<div
		v-if="labels.length"
		class="flex flex-wrap gap-1"
	>
		<UBadge
			v-for="label in labels"
			:key="label.id"
			:label="label.name"
			:color="label.color"
			variant="subtle"
			size="xs"
		/>
	</div>
</template>

<script setup lang="ts">
import { TASK_LABEL_PRESETS } from "~/features/task/config/task";

const props = defineProps<{
	labelIds: string[];
}>();

const labels = computed(() =>
	TASK_LABEL_PRESETS.filter(l => props.labelIds.includes(l.id)),
);
</script>
