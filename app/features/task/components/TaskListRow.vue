<template>
	<button
		type="button"
		class="task-list-row group"
		@click="emit('open', task.id)"
	>
		<span class="task-list-row__status">
			<TaskStatusBadge :status="task.status" />
		</span>

		<span class="min-w-0 flex-1 text-left">
			<span class="block truncate font-medium text-highlighted group-hover:text-primary">
				{{ task.title }}
			</span>
			<span
				v-if="descriptionPreview"
				class="mt-0.5 block truncate text-xs text-muted"
			>
				{{ descriptionPreview }}
			</span>
		</span>

		<TaskLabelBadges
			:label-ids="task.labelIds"
			class="hidden sm:flex"
		/>

		<span
			v-if="assigneeName"
			class="hidden max-w-[7rem] truncate text-xs text-muted md:block"
		>
			{{ assigneeName }}
		</span>

		<span
			v-if="dueText"
			class="hidden shrink-0 text-xs text-muted lg:block"
			:class="isOverdue && 'text-error'"
		>
			{{ dueText }}
		</span>

		<TaskPriorityBadge :priority="task.priority" />
	</button>
</template>

<script setup lang="ts">
import type { Task } from "~/features/task/types/task";
import { richTextToPlain } from "~/features/task/utils/rich-text";
import { formatTaskDueDate } from "~/features/task/utils/task";

const props = defineProps<{
	task: Task;
	assigneeName?: string | null;
}>();

const emit = defineEmits<{
	open: [taskId: string];
}>();

const dueText = computed(() => formatTaskDueDate(props.task.dueAt));

const descriptionPreview = computed(() => {
	const text = richTextToPlain(props.task.description);
	return text || null;
});

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
