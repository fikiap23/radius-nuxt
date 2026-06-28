<template>
	<UModal
		v-model:open="open"
		:title="`Edit ${column?.title ?? 'column'}`"
		description="Rename the column or adjust its WIP limit."
	>
		<template #body>
			<UForm
				v-if="column"
				:state="form"
				class="space-y-4"
				@submit.prevent="onSave"
			>
				<UFormField
					label="Column name"
					name="title"
					required
				>
					<UInput
						v-model="form.title"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					v-if="!isDefaultColumn"
					label="Maps to status"
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
					label="WIP limit"
					name="wipLimit"
					hint="Leave empty for no limit"
				>
					<UInput
						v-model="wipLimitInput"
						type="number"
						min="1"
						placeholder="No limit"
						class="w-full"
					/>
				</UFormField>

				<p
					v-if="error"
					class="text-sm text-error"
				>
					{{ error }}
				</p>
			</UForm>
		</template>

		<template #footer>
			<div class="flex w-full flex-wrap items-center justify-between gap-2">
				<UButton
					v-if="column && canDelete"
					label="Delete column"
					icon="i-lucide-trash-2"
					color="error"
					variant="ghost"
					:loading="deleting"
					@click="onDelete"
				/>
				<div class="ms-auto flex gap-2">
					<UButton
						label="Cancel"
						color="neutral"
						variant="ghost"
						@click="open = false"
					/>
					<UButton
						label="Save"
						icon="i-lucide-check"
						:loading="saving"
						@click="onSave"
					/>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { parseOptionalWipLimit } from "~/features/board/utils/board";
import { TASK_STATUS_OPTIONS } from "~/features/task/config/task";
import type { BoardColumn } from "~/features/board/types/board";
import type { TaskStatus } from "~/features/task/types/task";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
	projectId: string;
	column: BoardColumn | null;
	columnCount: number;
}>();

const emit = defineEmits<{
	updated: [];
	deleted: [];
}>();

const { updateColumn, removeColumn } = useBoard(() => props.projectId);
const toast = useToast();

const saving = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);

const form = reactive({
	title: "",
	status: "todo" as TaskStatus,
});

const wipLimitInput = ref("");

const isDefaultColumn = computed(() => {
	if (!props.column) {
		return true;
	}
	return props.column.id === props.column.status;
});

const canDelete = computed(() => props.columnCount > 1);

watch(
	() => [open.value, props.column] as const,
	([isOpen, column]) => {
		if (!isOpen || !column) {
			return;
		}
		form.title = column.title;
		form.status = column.status;
		wipLimitInput.value =
			column.wipLimit !== null ? String(column.wipLimit) : "";
		error.value = null;
	},
);

async function onSave() {
	if (!props.column || saving.value) {
		return;
	}
	error.value = null;
	saving.value = true;

	const wipLimit = parseOptionalWipLimit(wipLimitInput.value);

	const result = await updateColumn(props.projectId, props.column.id, {
		title: form.title,
		status: isDefaultColumn.value ? undefined : form.status,
		wipLimit,
	});

	saving.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({ title: "Column updated", color: "success" });
	open.value = false;
	emit("updated");
}

async function onDelete() {
	if (!props.column || deleting.value || !canDelete.value) {
		return;
	}
	deleting.value = true;
	const result = await removeColumn(props.projectId, props.column.id);
	deleting.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({ title: "Column removed", color: "success" });
	open.value = false;
	emit("deleted");
}
</script>
