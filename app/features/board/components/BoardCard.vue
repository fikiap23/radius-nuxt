<template>
	<article
		class="kanban-card group"
		:data-task-id="task.id"
	>
		<button
			type="button"
			class="kanban-card__body"
			@click="emit('open', task.id)"
		>
			<p class="kanban-card__title">
				{{ task.title }}
			</p>

			<div
				v-if="task.labelIds.length || dueText || assigneeName"
				class="kanban-card__meta"
			>
				<TaskLabelBadges
					v-if="task.labelIds.length"
					:label-ids="task.labelIds"
				/>
				<span
					v-if="dueText"
					class="text-xs"
					:class="isOverdue ? 'text-error' : 'text-muted'"
				>
					{{ dueText }}
				</span>
				<span
					v-if="assigneeName"
					class="ms-auto max-w-[6rem] truncate text-xs text-muted"
				>
					{{ assigneeName }}
				</span>
			</div>

			<div class="kanban-card__footer">
				<TaskPriorityBadge :priority="task.priority" />
			</div>
		</button>
	</article>
</template>

<script setup lang="ts">
import type { Task } from "~/features/task/types/task";
import { formatTaskDueDate } from "~/features/task/utils/task";

const props = defineProps<{
	task: Task;
	assigneeName?: string | null;
}>();

const emit = defineEmits<{
	open: [taskId: string];
}>();

const dueText = computed(() => formatTaskDueDate(props.task.dueAt));

const isOverdue = computed(() => {
	if (!props.task.dueAt || props.task.status === "done") {
		return false;
	}
	const due = new Date(props.task.dueAt);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return due < today;
});
</script>
