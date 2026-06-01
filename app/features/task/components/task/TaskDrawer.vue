<template>
	<USlideover
		v-model:open="open"
		side="right"
		:ui="slideoverUi"
	>
		<template #content="{ close }">
			<div class="task-slideover__shell">
				<button
					type="button"
					class="task-slideover-resize"
					:class="isResizing && 'task-slideover-resize--active'"
					aria-label="Resize panel"
					@click.prevent
					@pointerdown="startResize"
					@dblclick.prevent="resetWidth"
				/>

				<header class="task-slideover__header">
					<div class="min-w-0 pe-10">
						<h2 class="text-highlighted font-semibold">
							{{ drawerTitle }}
						</h2>
						<p
							v-if="drawerDescription"
							class="mt-1 text-sm text-muted"
						>
							{{ drawerDescription }}
						</p>
					</div>
					<UButton
						icon="i-lucide-x"
						color="neutral"
						variant="ghost"
						aria-label="Close"
						class="absolute end-4 top-4"
						@click="close"
					/>
				</header>

				<div class="task-slideover__body">
					<UForm
				id="task-drawer-form"
				:state="form"
				:loading-auto="false"
				class="task-drawer-form space-y-5"
			>
				<UFormField
					label="Title"
					name="title"
					required
				>
					<UInput
						v-model="form.title"
						placeholder="Task title"
						autocomplete="off"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="Description"
					name="description"
				>
					<ClientOnly>
						<UiRichTextEditor
							v-model="form.description"
							placeholder="Add details…"
							min-height="9rem"
						/>
					</ClientOnly>
				</UFormField>

				<div class="grid gap-4 sm:grid-cols-2">
					<UFormField
						label="Status"
						name="status"
					>
						<USelect
							v-model="form.status"
							:items="TASK_STATUS_OPTIONS"
							value-key="value"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Priority"
						name="priority"
					>
						<USelect
							v-model="form.priority"
							:items="TASK_PRIORITY_OPTIONS"
							value-key="value"
							class="w-full"
						/>
					</UFormField>
				</div>

				<UFormField
					label="Due date"
					name="dueAt"
				>
					<TaskDueDatePicker
						v-model="dueDate"
						v-model:open="dueDatePopoverOpen"
					/>
				</UFormField>

				<UFormField
					label="Assignee"
					name="assigneeId"
				>
					<USelect
						v-model="form.assigneeId"
						:items="assigneeItems"
						value-key="value"
						placeholder="Unassigned"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="Labels"
					name="labelIds"
				>
					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="label in TASK_LABEL_PRESETS"
							:key="label.id"
							:label="label.name"
							:color="form.labelIds.includes(label.id) ? label.color : 'neutral'"
							:variant="form.labelIds.includes(label.id) ? 'soft' : 'outline'"
							size="xs"
							type="button"
							@click="toggleLabel(label.id)"
						/>
					</div>
				</UFormField>

				<template v-if="!isCreateMode && activeTaskId">
					<USeparator />

					<TaskSubtasks
						:items="form.subtasks"
						@update="onSubtasksUpdate"
					/>
					<TaskChecklist
						:items="form.checklist"
						@update="onChecklistUpdate"
					/>
					<TaskAttachments
						:items="form.attachments"
						:uploading="attachmentUploading"
						:removing-id="attachmentRemovingId"
						@upload="onUpload"
						@remove="onRemoveAttachment"
					/>
					<TaskComments
						v-if="activeTaskId"
						:task-id="activeTaskId"
						:comments="commentEntries"
						:members="mentionMembers"
						:current-author-id="currentAuthor.authorId"
						:current-author-name="currentAuthor.authorName"
					/>
					<TaskActivityLog :entries="activityEntries" />
				</template>

				<UAlert
					v-if="error"
					color="error"
					variant="soft"
					icon="i-lucide-circle-alert"
					:title="error"
				/>
					</UForm>
				</div>

				<footer class="task-slideover__footer">
					<UButton
						v-if="!isCreateMode && activeTaskId"
						type="button"
						label="Delete"
						icon="i-lucide-trash-2"
						color="error"
						variant="ghost"
						size="sm"
						:loading="deleting"
						@click="onDelete"
					/>
					<div class="ms-auto flex gap-2">
						<UButton
							type="button"
							label="Cancel"
							color="neutral"
							variant="outline"
							@click="close"
						/>
						<UButton
							type="button"
							:label="isCreateMode ? 'Create task' : 'Save changes'"
							:loading="saving"
							:disabled="saving"
							icon="i-lucide-check"
							@click="saveTask"
						/>
					</div>
				</footer>
			</div>
		</template>
	</USlideover>
</template>

<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import {
	TASK_LABEL_PRESETS,
	TASK_PRIORITY_OPTIONS,
	TASK_STATUS_OPTIONS,
	TASK_UNASSIGNED_VALUE,
} from "~/config/task";
import type {
	Task,
	TaskChecklistItem,
	TaskPriority,
	TaskStatus,
	TaskSubtask,
} from "~/types/task";
import {
	calendarDateFromIso,
	isoFromCalendarDate,
	taskAssigneeFromSelectValue,
	taskAssigneeToSelectValue,
} from "~/utils/task";

const { widthPx, isResizing, startResize, resetWidth } = useTaskDrawerWidth();

const slideoverUi = {
	content: "task-slideover__panel",
};

const {
	open,
	activeTaskId,
	isCreateMode,
	projectId,
	workspaceId,
	isReady,
	closeDrawer,
} = useTaskDrawer();

const drawerTitle = computed(() =>
	isCreateMode.value ? "New task" : "Task details",
);

const drawerDescription = computed(() =>
	isCreateMode.value ? "Add a task to this project." : null,
);

const {
	getTaskById,
	activitiesForTask,
	commentsForTask,
	createTask,
	updateTask,
	deleteTask,
	addAttachment,
	removeAttachment,
} = useTask();
const { activeMembers } = useWorkspace();
const { user } = useAuth();
const toast = useToast();

const saving = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);
const attachmentUploading = ref(false);
const attachmentRemovingId = ref<string | null>(null);
const dueDate = shallowRef<CalendarDate | null>(null);
const dueDatePopoverOpen = ref(false);

const form = reactive({
	title: "",
	description: "",
	status: "todo" as TaskStatus,
	priority: "medium" as TaskPriority,
	assigneeId: TASK_UNASSIGNED_VALUE,
	labelIds: [] as string[],
	subtasks: [] as TaskSubtask[],
	checklist: [] as TaskChecklistItem[],
	attachments: [] as Task["attachments"],
});

const activityEntries = computed(() =>
	activeTaskId.value ? activitiesForTask(activeTaskId.value) : [],
);

const commentEntries = computed(() =>
	activeTaskId.value ? commentsForTask(activeTaskId.value) : [],
);

const mentionMembers = computed(() =>
	activeMembers.value.filter(m => m.status === "active"),
);

const currentAuthor = computed(() => {
	const authUser = user.value;
	const member = authUser
		? mentionMembers.value.find(m => m.email === authUser.email)
		: null;
	return {
		authorId: member?.id ?? null,
		authorName: member?.name ?? authUser?.name ?? "You",
	};
});

const assigneeItems = computed(() => [
	{ label: "Unassigned", value: TASK_UNASSIGNED_VALUE },
	...activeMembers.value
		.filter(m => m.status === "active")
		.map(m => ({ label: m.name, value: m.id })),
]);

function resetForm() {
	form.title = "";
	form.description = "";
	form.status = "todo";
	form.priority = "medium";
	dueDate.value = null;
	form.assigneeId = TASK_UNASSIGNED_VALUE;
	form.labelIds = [];
	form.subtasks = [];
	form.checklist = [];
	form.attachments = [];
	error.value = null;
}

function loadTask(task: Task) {
	form.title = task.title;
	form.description = task.description;
	form.status = task.status;
	form.priority = task.priority;
	dueDate.value = calendarDateFromIso(task.dueAt);
	form.assigneeId = taskAssigneeToSelectValue(task.assigneeId);
	form.labelIds = [...task.labelIds];
	form.subtasks = [...task.subtasks];
	form.checklist = [...task.checklist];
	form.attachments = [...task.attachments];
}

function hydrateForm() {
	error.value = null;
	if (isCreateMode.value) {
		resetForm();
		return;
	}
	if (!activeTaskId.value) {
		resetForm();
		return;
	}
	const task = getTaskById(activeTaskId.value);
	if (!task) {
		error.value = "Task not found.";
		resetForm();
		return;
	}
	loadTask(task);
}

watch(
	() => [open.value, widthPx.value] as const,
	([isOpen, width]) => {
		if (!import.meta.client) {
			return;
		}
		if (isOpen) {
			document.documentElement.style.setProperty(
				"--task-slideover-width",
				`${width}px`,
			);
		}
		else {
			document.documentElement.style.removeProperty("--task-slideover-width");
		}
	},
	{ immediate: true },
);

watch(
	() => [open.value, activeTaskId.value, isCreateMode.value, isReady.value] as const,
	([isOpen, , , ready]) => {
		if (isOpen && ready) {
			nextTick(() => hydrateForm());
		}
		else if (!isOpen) {
			resetForm();
			saving.value = false;
			dueDatePopoverOpen.value = false;
		}
	},
);

function toggleLabel(labelId: string) {
	if (form.labelIds.includes(labelId)) {
		form.labelIds = form.labelIds.filter(id => id !== labelId);
	}
	else {
		form.labelIds = [...form.labelIds, labelId];
	}
}

async function saveTask() {
	if (saving.value) {
		return;
	}

	error.value = null;

	const title = form.title.trim();
	if (!title) {
		error.value = "Task title is required.";
		return;
	}

	if (!projectId.value || !workspaceId.value) {
		error.value = "Project context is missing.";
		return;
	}

	const payload = {
		title,
		description: form.description,
		status: form.status,
		priority: form.priority,
		dueAt: isoFromCalendarDate(dueDate.value),
		labelIds: form.labelIds,
		assigneeId: taskAssigneeFromSelectValue(form.assigneeId),
	};

	saving.value = true;

	try {
		if (isCreateMode.value) {
			const result = await createTask(
				projectId.value,
				workspaceId.value,
				payload,
			);
			if (!result.ok) {
				error.value = result.error;
				return;
			}
			toast.add({
				title: "Task created",
				color: "success",
				icon: "i-lucide-plus-circle",
			});
			closeDrawer();
			return;
		}

		if (!activeTaskId.value) {
			return;
		}

		const result = await updateTask(activeTaskId.value, {
			...payload,
			subtasks: form.subtasks,
			checklist: form.checklist,
			attachments: form.attachments,
		});

		if (!result.ok) {
			error.value = result.error;
			return;
		}

		toast.add({
			title: "Task saved",
			color: "success",
			icon: "i-lucide-check",
		});
	}
	finally {
		saving.value = false;
	}
}

async function onSubtasksUpdate(items: TaskSubtask[]) {
	form.subtasks = items;
	if (!activeTaskId.value) {
		return;
	}
	await updateTask(activeTaskId.value, { subtasks: items });
}

async function onChecklistUpdate(items: TaskChecklistItem[]) {
	form.checklist = items;
	if (!activeTaskId.value) {
		return;
	}
	await updateTask(activeTaskId.value, { checklist: items });
}

async function onUpload(file: File) {
	if (!activeTaskId.value) {
		return;
	}
	attachmentUploading.value = true;
	const result = await addAttachment(activeTaskId.value, file);
	attachmentUploading.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	form.attachments = result.task.attachments;
}

async function onRemoveAttachment(attachmentId: string) {
	if (!activeTaskId.value) {
		return;
	}
	attachmentRemovingId.value = attachmentId;
	const result = await removeAttachment(activeTaskId.value, attachmentId);
	attachmentRemovingId.value = null;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	form.attachments = result.task.attachments;
}

async function onDelete() {
	if (!activeTaskId.value) {
		return;
	}
	deleting.value = true;
	const result = await deleteTask(activeTaskId.value);
	deleting.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	toast.add({
		title: "Task deleted",
		color: "success",
		icon: "i-lucide-trash-2",
	});
	closeDrawer();
}
</script>
