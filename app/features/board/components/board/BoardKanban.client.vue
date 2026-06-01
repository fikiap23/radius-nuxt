<template>
	<div class="kanban-board">
		<BoardColumn
			v-for="column in columns"
			:key="column.id"
			:column="column"
			:tasks="tasksByColumn[column.id] ?? []"
			:count="columnCounts[column.id] ?? 0"
			:wip-exceeded="isWipExceeded(column)"
			:assignee-name-for="assigneeNameFor"
			:quick-saving="quickSavingColumnId === column.id"
			@change="onColumnChange"
			@open="emit('open', $event)"
			@quick-create="onQuickCreate"
			@settings="emit('settings', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import type { BoardColumn } from "~/types/board";
import type { Task } from "~/types/task";

const props = defineProps<{
	projectId: string;
	columns: BoardColumn[];
	tasksByColumn: Record<string, Task[]>;
	columnCounts: Record<string, number>;
	assigneeNameFor: (assigneeId: string | null) => string | null;
}>();

const emit = defineEmits<{
	open: [taskId: string];
	settings: [columnId: string];
}>();

const { moveTaskToColumn, quickCreateTask, isWipExceeded } = useBoard(
	() => props.projectId,
);
const toast = useToast();

const quickSavingColumnId = ref<string | null>(null);

async function onColumnChange(
	evt: { added?: { element: Task } },
	columnId: string,
) {
	if (!evt.added) {
		return;
	}
	const task = evt.added.element;
	const column = props.columns.find(c => c.id === columnId);
	if (!column) {
		return;
	}
	if (task.status === column.status && task.columnId === column.id) {
		return;
	}
	const result = await moveTaskToColumn(task.id, columnId);
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
	}
}

async function onQuickCreate(title: string, columnId: string) {
	quickSavingColumnId.value = columnId;
	const result = await quickCreateTask(columnId, title);
	quickSavingColumnId.value = null;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
	}
}
</script>
