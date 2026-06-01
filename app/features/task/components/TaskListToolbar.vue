<template>
	<div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
		<div class="flex flex-wrap items-center gap-2">
			<UInput
				:model-value="filters.query"
				icon="i-lucide-search"
				placeholder="Search tasks…"
				size="sm"
				class="w-full min-w-[12rem] sm:w-56"
				@update:model-value="emit('update:filters', { ...filters, query: String($event ?? '') })"
			/>
			<USelect
				:model-value="filters.status"
				:items="statusItems"
				value-key="value"
				size="sm"
				class="w-36"
				@update:model-value="emit('update:filters', { ...filters, status: $event as TaskListFilters['status'] })"
			/>
			<USelect
				:model-value="filters.assigneeId"
				:items="assigneeItems"
				value-key="value"
				size="sm"
				class="w-40"
				@update:model-value="emit('update:filters', { ...filters, assigneeId: String($event ?? 'all') })"
			/>
			<USelect
				v-if="labelItems.length > 1"
				:model-value="filters.labelId"
				:items="labelItems"
				value-key="value"
				size="sm"
				class="w-36"
				@update:model-value="emit('update:filters', { ...filters, labelId: String($event ?? 'all') })"
			/>
		</div>

		<UButton
			label="New task"
			icon="i-lucide-plus"
			size="sm"
			@click="emit('create')"
		/>
	</div>
</template>

<script setup lang="ts">
import { TASK_STATUS_OPTIONS } from "~/features/task/config/task";
import type { TaskLabel, TaskListFilters } from "~/features/task/types/task";

const props = defineProps<{
	filters: TaskListFilters;
	assigneeItems: { label: string; value: string }[];
	labelOptions: TaskLabel[];
}>();

const emit = defineEmits<{
	"update:filters": [filters: TaskListFilters];
	create: [];
}>();

const statusItems = computed(() => [
	{ label: "All statuses", value: "all" },
	...TASK_STATUS_OPTIONS,
]);

const labelItems = computed(() => [
	{ label: "All labels", value: "all" },
	...props.labelOptions.map(l => ({ label: l.name, value: l.id })),
]);
</script>
