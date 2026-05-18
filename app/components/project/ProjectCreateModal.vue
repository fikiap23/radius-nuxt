<template>
	<UModal
		v-model:open="open"
		title="Create project"
		description="Add a new project to your workspace."
		:ui="{ footer: 'justify-end gap-2' }"
	>
		<template #body>
			<UForm
				id="project-create-form"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					label="Name"
					name="name"
					required
				>
					<UInput
						v-model="state.name"
						placeholder="Radius App"
						autocomplete="off"
						@update:model-value="onNameChange"
					/>
				</UFormField>

				<UFormField
					label="Icon"
					name="icon"
				>
					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="opt in PROJECT_ICON_OPTIONS"
							:key="opt.value"
							:icon="opt.value"
							:color="state.icon === opt.value ? 'primary' : 'neutral'"
							:variant="state.icon === opt.value ? 'soft' : 'outline'"
							size="sm"
							:aria-label="opt.label"
							@click="state.icon = opt.value"
						/>
					</div>
				</UFormField>

				<UFormField
					label="Cover"
					name="cover"
				>
					<div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
						<button
							v-for="preset in PROJECT_COVER_PRESETS"
							:key="preset.id"
							type="button"
							class="project-cover-picker"
							:class="[
								`project-cover--${preset.id}`,
								state.cover === preset.id && 'project-cover-picker--active',
							]"
							:aria-label="preset.label"
							:aria-pressed="state.cover === preset.id"
							@click="state.cover = preset.id"
						/>
					</div>
				</UFormField>

				<UFormField
					label="Status"
					name="status"
				>
					<USelect
						v-model="state.status"
						:items="PROJECT_STATUS_OPTIONS"
						value-key="value"
					/>
				</UFormField>

				<UAlert
					v-if="error"
					color="error"
					variant="soft"
					icon="i-lucide-circle-alert"
					:title="error"
				/>
			</UForm>
		</template>

		<template #footer="{ close }">
			<UButton
				label="Cancel"
				color="neutral"
				variant="outline"
				@click="close"
			/>
			<UButton
				type="submit"
				form="project-create-form"
				label="Create project"
				:loading="loading"
				icon="i-lucide-plus"
			/>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import {
	PROJECT_COVER_PRESETS,
	PROJECT_ICON_OPTIONS,
	PROJECT_STATUS_OPTIONS,
} from "~/config/project";
import type { ProjectCoverPreset, ProjectStatus } from "~/types/project";
import { defaultProjectCover, defaultProjectIcon } from "~/utils/project";

const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
	created: [projectId: string];
}>();

const { activeWorkspace } = useWorkspace();
const { createProject } = useProject();
const toast = useToast();

const loading = ref(false);
const error = ref<string | null>(null);

const state = reactive({
	name: "",
	icon: PROJECT_ICON_OPTIONS[0]!.value,
	cover: defaultProjectCover() as ProjectCoverPreset,
	status: "active" as ProjectStatus,
});

watch(open, isOpen => {
	if (!isOpen) {
		state.name = "";
		state.icon = PROJECT_ICON_OPTIONS[0]!.value;
		state.cover = defaultProjectCover();
		state.status = "active";
		error.value = null;
	}
});

function onNameChange() {
	if (!state.name.trim()) {
		return;
	}
	state.icon = defaultProjectIcon(state.name);
}

async function onSubmit(event: Event) {
	event.preventDefault();
	error.value = null;

	const workspaceId = activeWorkspace.value?.id;
	if (!workspaceId) {
		error.value = "Select a workspace before creating a project.";
		return;
	}

	const name = state.name.trim();
	if (!name) {
		error.value = "Project name is required.";
		return;
	}

	loading.value = true;

	const result = await createProject(workspaceId, {
		name,
		icon: state.icon,
		cover: state.cover,
		status: state.status,
	});

	loading.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({
		title: "Project created",
		description: `${result.project.name} is ready.`,
		color: "success",
		icon: "i-lucide-folder-kanban",
	});

	open.value = false;
	emit("created", result.project.id);
}
</script>
