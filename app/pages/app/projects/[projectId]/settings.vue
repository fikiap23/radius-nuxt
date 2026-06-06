<template>
	<UiAppCard
		title="Project settings"
		description="Icon, cover, status, and archive"
		icon="i-lucide-settings-2"
	>
		<form
			v-if="project"
			class="max-w-lg space-y-5"
			@submit.prevent="onSave"
		>
			<UFormField
				label="Name"
				name="name"
				required
			>
				<UInput v-model="form.name" />
			</UFormField>

			<UFormField
				label="Description"
				name="description"
			>
				<ClientOnly>
					<UiRichTextEditor
						v-model="form.description"
						placeholder="Describe this project…"
						variant="compact"
						min-height="7rem"
					/>
				</ClientOnly>
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
						:color="form.icon === opt.value ? 'primary' : 'neutral'"
						:variant="form.icon === opt.value ? 'soft' : 'outline'"
						size="sm"
						:aria-label="opt.label"
						@click="form.icon = opt.value"
					/>
				</div>
			</UFormField>

			<UFormField
				label="Cover"
				name="cover"
			>
				<ProjectCoverField
					v-model:cover="form.cover"
					v-model:cover-image-url="form.coverImageUrl"
					v-model:cover-image-temp-key="form.coverImageTempKey"
					:preview-name="form.name"
					:preview-icon="form.icon"
				/>
			</UFormField>

			<UFormField
				label="Status"
				name="status"
			>
				<USelect
					v-model="form.status"
					:items="PROJECT_STATUS_OPTIONS"
					value-key="value"
				/>
			</UFormField>

			<UAlert
				v-if="error"
				color="error"
				variant="soft"
				:title="error"
			/>

			<div class="flex flex-wrap gap-2">
				<UButton
					type="submit"
					label="Save changes"
					:loading="saving"
				/>
			</div>

			<div class="border-t border-muted pt-6">
				<h3 class="text-sm font-semibold text-highlighted">
					Danger zone
				</h3>
				<p class="mt-1 text-sm text-muted">
					Archive hides the project from active lists. You can restore it later.
				</p>
				<div class="mt-4 flex flex-wrap gap-2">
					<UButton
						v-if="!isArchived"
						label="Archive project"
						icon="i-lucide-archive"
						color="warning"
						variant="outline"
						:loading="archiving"
						@click="onArchive"
					/>
					<UButton
						v-else
						label="Restore project"
						icon="i-lucide-archive-restore"
						color="primary"
						variant="soft"
						:loading="archiving"
						@click="onUnarchive"
					/>
				</div>
			</div>
		</form>
	</UiAppCard>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";
import { PROJECT_ICON_OPTIONS, PROJECT_STATUS_OPTIONS } from "~/features/project/config/project";
import type { ProjectCoverPreset, ProjectStatus } from "~/features/project/types/project";

const route = useRoute();
const toast = useToast();
const projectId = route.params.projectId as string;

const { project, isArchived } = useProjectContext(projectId);
const { updateProject, archiveProject, unarchiveProject } = useProject();

definePageMeta({
	appTitle: "Settings",
});

useSeoMeta({
	title: () =>
		project.value
			? `${project.value.name} — Settings — ${APP_NAME}`
			: `Settings — ${APP_NAME}`,
});

const form = reactive({
	name: "",
	description: "",
	icon: "",
	cover: "ocean" as ProjectCoverPreset,
	coverImageUrl: null as string | null,
	coverImageTempKey: null as string | null,
	status: "active" as ProjectStatus,
});

const saving = ref(false);
const archiving = ref(false);
const error = ref<string | null>(null);

watch(
	project,
	p => {
		if (!p) {
			return;
		}
		form.name = p.name;
		form.description = p.description ?? "";
		form.icon = p.icon;
		form.cover = p.cover;
		form.coverImageUrl = p.coverImageUrl;
		form.coverImageTempKey = null;
		form.status = p.status;
	},
	{ immediate: true },
);

async function onSave() {
	if (!project.value) {
		return;
	}
	error.value = null;
	const name = form.name.trim();
	if (!name) {
		error.value = "Project name is required.";
		return;
	}

	saving.value = true;
	const result = await updateProject(project.value.id, {
		name,
		description: form.description,
		icon: form.icon,
		cover: form.cover,
		coverImageUrl: form.coverImageUrl,
		coverImageTempKey: form.coverImageTempKey,
		status: form.status,
	});
	saving.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({
		title: "Settings saved",
		color: "success",
		icon: "i-lucide-check",
	});
}

async function onArchive() {
	if (!project.value) {
		return;
	}
	archiving.value = true;
	const result = await archiveProject(project.value.id);
	archiving.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	toast.add({ title: "Project archived", color: "success" });
}

async function onUnarchive() {
	if (!project.value) {
		return;
	}
	archiving.value = true;
	const result = await unarchiveProject(project.value.id);
	archiving.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	toast.add({ title: "Project restored", color: "success" });
}
</script>
