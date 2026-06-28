<template>
	<UModal
		v-model:open="open"
		title="Add column"
		description="Custom columns map tasks to a status when cards are dropped."
	>
		<template #body>
			<UForm
				:state="form"
				class="space-y-4"
				@submit.prevent="onSubmit"
			>
				<UFormField
					label="Column name"
					name="title"
					required
				>
					<UInput
						v-model="form.title"
						placeholder="e.g. QA, Blocked"
						autocomplete="off"
						class="w-full"
					/>
				</UFormField>

				<UFormField
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
			<div class="flex w-full justify-end gap-2">
				<UButton
					label="Cancel"
					color="neutral"
					variant="ghost"
					@click="open = false"
				/>
				<UButton
					label="Add column"
					icon="i-lucide-plus"
					:loading="saving"
					@click="onSubmit"
				/>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { parseOptionalWipLimit } from "~/features/board/utils/board";
import { TASK_STATUS_OPTIONS } from "~/features/task/config/task";
import type { TaskStatus } from "~/features/task/types/task";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
	projectId: string;
}>();

const emit = defineEmits<{
	created: [];
}>();

const { addColumn } = useBoard(() => props.projectId);
const toast = useToast();

const saving = ref(false);
const error = ref<string | null>(null);

const form = reactive({
	title: "",
	status: "todo" as TaskStatus,
});

const wipLimitInput = ref("");

watch(open, isOpen => {
	if (isOpen) {
		form.title = "";
		form.status = "todo";
		wipLimitInput.value = "";
		error.value = null;
	}
});

async function onSubmit() {
	if (saving.value) {
		return;
	}
	error.value = null;
	saving.value = true;

	const wipLimit = parseOptionalWipLimit(wipLimitInput.value);

	const result = await addColumn(props.projectId, {
		title: form.title,
		status: form.status,
		wipLimit,
	});

	saving.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({
		title: "Column added",
		color: "success",
		icon: "i-lucide-columns-3",
	});
	open.value = false;
	emit("created");
}
</script>
