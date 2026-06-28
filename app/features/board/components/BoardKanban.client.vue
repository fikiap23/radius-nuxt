<template>
	<draggable
		v-model="localColumns"
		item-key="id"
		class="kanban-board"
		:animation="180"
		handle=".kanban-column__drag-handle"
		ghost-class="kanban-column--ghost"
		drag-class="kanban-column--drag"
		direction="horizontal"
		:disabled="reordering"
		@end="onColumnReorder"
	>
		<template #item="{ element: column }">
			<BoardColumn
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
		</template>
	</draggable>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import type { BoardColumn } from "~/features/board/types/board";
import type { Task } from "~/features/task/types/task";

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

const { moveTaskToColumn, quickCreateTask, isWipExceeded, reorderColumns } = useBoard(
	() => props.projectId,
);
const toast = useToast();

const quickSavingColumnId = ref<string | null>(null);
const reordering = ref(false);
const localColumns = ref<BoardColumn[]>([]);
const previousColumnIds = ref("");

watch(
	() => props.columns,
	columns => {
		localColumns.value = [...columns];
		previousColumnIds.value = columns.map(c => c.id).join(",");
	},
	{ immediate: true, deep: true },
);

async function onColumnReorder() {
	const columnIds = localColumns.value.map(c => c.id);
	const nextIds = columnIds.join(",");
	if (nextIds === previousColumnIds.value || reordering.value) {
		return;
	}

	reordering.value = true;
	const result = await reorderColumns(props.projectId, columnIds);
	reordering.value = false;

	if (!result.ok) {
		localColumns.value = [...props.columns];
		toast.add({ title: result.error, color: "error" });
		return;
	}

	previousColumnIds.value = nextIds;
}

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
