<template>
	<section
		class="kanban-column"
		:class="wipExceeded && 'kanban-column--wip-exceeded'"
		:aria-label="`${column.title} column`"
	>
		<header class="kanban-column__header">
			<button
				type="button"
				class="kanban-column__drag-handle"
				aria-label="Drag to reorder column"
				tabindex="-1"
			>
				<UIcon
					name="i-lucide-grip-vertical"
					class="size-4"
				/>
			</button>
			<div class="min-w-0 flex-1">
				<h2 class="kanban-column__title">
					{{ column.title }}
				</h2>
				<p
					v-if="wipExceeded"
					class="kanban-column__wip-warning"
				>
					WIP limit exceeded
				</p>
			</div>
			<div class="flex shrink-0 items-center gap-1">
				<UBadge
					:label="countLabel"
					:color="wipExceeded ? 'warning' : 'neutral'"
					variant="subtle"
					size="xs"
				/>
				<UDropdownMenu
					:items="menuItems"
				>
					<UButton
						icon="i-lucide-ellipsis"
						color="neutral"
						variant="ghost"
						size="xs"
						aria-label="Column options"
					/>
				</UDropdownMenu>
			</div>
		</header>

		<draggable
			v-model="localTasks"
			:group="{ name: 'kanban', pull: true, put: true }"
			item-key="id"
			class="kanban-column__cards"
			:animation="180"
			ghost-class="kanban-card--ghost"
			drag-class="kanban-card--drag"
			handle=".kanban-card"
			@change="onListChange"
		>
			<template #item="{ element: task }">
				<BoardCard
					:task="task"
					:assignee-name="assigneeNameFor(task.assigneeId)"
					@open="emit('open', $event)"
				/>
			</template>
		</draggable>

		<form
			class="kanban-column__quick-add"
			@submit.prevent="onQuickSubmit"
		>
			<UInput
				v-model="quickTitle"
				:placeholder="`Add to ${column.title}…`"
				size="sm"
				:disabled="quickSaving"
				class="w-full"
				@keydown.enter.prevent="onQuickSubmit"
			/>
		</form>
	</section>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import type { BoardColumn } from "~/features/board/types/board";
import type { Task } from "~/features/task/types/task";

const props = defineProps<{
	column: BoardColumn;
	tasks: Task[];
	count: number;
	wipExceeded: boolean;
	assigneeNameFor: (assigneeId: string | null) => string | null;
	quickSaving?: boolean;
}>();

const emit = defineEmits<{
	change: [evt: { added?: { element: Task } }, columnId: string];
	open: [taskId: string];
	"quick-create": [title: string, columnId: string];
	settings: [columnId: string];
}>();

const localTasks = ref<Task[]>([]);
const quickTitle = ref("");

const countLabel = computed(() => {
	if (props.column.wipLimit !== null) {
		return `${props.count} / ${props.column.wipLimit}`;
	}
	return String(props.count);
});

const menuItems = computed(() => [
	[
		{
			label: "Column settings",
			icon: "i-lucide-settings-2",
			onSelect: () => emit("settings", props.column.id),
		},
	],
]);

watch(
	() => props.tasks,
	tasks => {
		localTasks.value = [...tasks];
	},
	{ immediate: true, deep: true },
);

function onListChange(evt: { added?: { element: Task } }) {
	if (evt.added) {
		emit("change", evt, props.column.id);
	}
}

function onQuickSubmit() {
	const title = quickTitle.value.trim();
	if (!title) {
		return;
	}
	emit("quick-create", title, props.column.id);
	quickTitle.value = "";
}

watch(
	() => props.quickSaving,
	(saving, wasSaving) => {
		if (wasSaving && !saving) {
			quickTitle.value = "";
		}
	},
);
</script>
