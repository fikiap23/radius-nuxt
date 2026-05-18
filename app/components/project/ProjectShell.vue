<template>
	<div
		v-if="project && hasAccess"
		class="project-shell space-y-6"
	>
		<header class="project-shell__header">
			<div class="flex flex-wrap items-start gap-4">
				<NuxtLink
					to="/app/projects"
					class="project-shell__back"
				>
					<UIcon
						name="i-lucide-arrow-left"
						class="size-4"
					/>
					Projects
				</NuxtLink>
			</div>

			<div class="project-shell__hero">
				<ProjectCover
					:cover="project.cover"
					size="banner"
					rounded="xl"
					class="project-shell__cover"
				>
					<ProjectIcon
						:icon="project.icon"
						size="lg"
						class="project-shell__cover-icon"
					/>
				</ProjectCover>

				<div class="min-w-0 flex-1 space-y-2">
					<div class="flex flex-wrap items-center gap-2">
						<h1 class="font-display text-2xl font-bold text-highlighted">
							{{ project.name }}
						</h1>
						<ProjectStatusBadge :status="project.status" />
						<UBadge
							v-if="isArchived"
							label="Archived"
							color="neutral"
							variant="subtle"
							size="xs"
						/>
					</div>
					<p class="text-sm text-muted">
						{{ project.openTasks }} open tasks · {{ project.progress }}% complete
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<UButton
						:icon="project.isFavorite ? 'i-lucide-star' : 'i-lucide-star'"
						:color="project.isFavorite ? 'warning' : 'neutral'"
						:variant="project.isFavorite ? 'soft' : 'outline'"
						size="sm"
						:label="project.isFavorite ? 'Favorited' : 'Favorite'"
						:loading="favoriteLoading"
						@click="onToggleFavorite"
					/>
					<UButton
						v-if="!isArchived"
						label="Archive"
						icon="i-lucide-archive"
						color="neutral"
						variant="outline"
						size="sm"
						:loading="archiveLoading"
						@click="onArchive"
					/>
					<UButton
						v-else
						label="Restore"
						icon="i-lucide-archive-restore"
						color="neutral"
						variant="outline"
						size="sm"
						:loading="archiveLoading"
						@click="onUnarchive"
					/>
					<UButton
						label="Settings"
						icon="i-lucide-settings"
						color="neutral"
						variant="ghost"
						size="sm"
						:to="`/app/projects/${project.id}/settings`"
					/>
				</div>
			</div>

			<nav
				class="project-shell__tabs"
				aria-label="Project views"
			>
				<NuxtLink
					v-for="tab in tabs"
					:key="tab.to"
					:to="`/app/projects/${project.id}/${tab.to}`"
					class="project-shell__tab"
					:class="isTabActive(tab.to) && 'project-shell__tab--active'"
				>
					<UIcon
						:name="tab.icon"
						class="size-4"
					/>
					{{ tab.label }}
				</NuxtLink>
			</nav>
		</header>

		<div class="project-shell__content">
			<slot />
		</div>
	</div>

	<div
		v-else
		class="app-page space-y-4"
	>
		<UAlert
			color="warning"
			variant="soft"
			icon="i-lucide-triangle-alert"
			:title="project ? 'Wrong workspace' : 'Project not found'"
			:description="project
				? 'Switch to the workspace that owns this project.'
				: 'This project does not exist or was removed.'"
		>
			<template #actions>
				<UButton
					label="All projects"
					to="/app/projects"
					size="sm"
				/>
			</template>
		</UAlert>
	</div>
</template>

<script setup lang="ts">
import { PROJECT_VIEW_TABS } from "~/config/project";

const props = defineProps<{
	projectId: string;
}>();

const route = useRoute();
const toast = useToast();
const tabs = PROJECT_VIEW_TABS;

const { project, hasAccess, isArchived } = useProjectContext(
	() => props.projectId,
);
const { toggleFavorite, archiveProject, unarchiveProject } = useProject();

const favoriteLoading = ref(false);
const archiveLoading = ref(false);

function isTabActive(segment: string) {
	const path = route.path;
	return path.endsWith(`/${segment}`) || path.endsWith(`/${segment}/`);
}

async function onToggleFavorite() {
	if (!project.value) {
		return;
	}
	favoriteLoading.value = true;
	const result = await toggleFavorite(project.value.id);
	favoriteLoading.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
	}
}

async function onArchive() {
	if (!project.value) {
		return;
	}
	archiveLoading.value = true;
	const result = await archiveProject(project.value.id);
	archiveLoading.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	toast.add({
		title: "Project archived",
		color: "success",
		icon: "i-lucide-archive",
	});
}

async function onUnarchive() {
	if (!project.value) {
		return;
	}
	archiveLoading.value = true;
	const result = await unarchiveProject(project.value.id);
	archiveLoading.value = false;
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	toast.add({
		title: "Project restored",
		color: "success",
		icon: "i-lucide-archive-restore",
	});
}
</script>
