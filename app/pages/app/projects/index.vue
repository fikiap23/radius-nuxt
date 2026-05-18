<template>
	<div class="app-page app-page--wide space-y-6">
		<UiAppPageIntro
			title="Projects"
			:description="activeWorkspace
				? `Projects in ${activeWorkspace.name}`
				: 'All projects in your workspace'"
		>
			<UButton
				label="New project"
				icon="i-lucide-plus"
				size="sm"
				:disabled="!activeWorkspace"
				@click="openCreateModal"
			/>
		</UiAppPageIntro>

		<div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
			<div class="flex flex-wrap items-center gap-2">
				<UInput
					v-model="listFilters.query"
					icon="i-lucide-search"
					placeholder="Search projects…"
					size="sm"
					class="w-full min-w-[12rem] sm:w-56"
				/>
				<USelect
					v-model="listFilters.status"
					:items="statusFilterItems"
					value-key="value"
					size="sm"
					class="w-36"
				/>
				<UButton
					:icon="listFilters.favoritesOnly ? 'i-lucide-star' : 'i-lucide-star'"
					:color="listFilters.favoritesOnly ? 'warning' : 'neutral'"
					:variant="listFilters.favoritesOnly ? 'soft' : 'outline'"
					size="sm"
					label="Favorites"
					@click="listFilters.favoritesOnly = !listFilters.favoritesOnly"
				/>
			</div>

			<div class="flex items-center gap-2">
				<UButtonGroup size="sm">
					<UButton
						icon="i-lucide-layout-grid"
						:color="listFilters.view === 'grid' ? 'primary' : 'neutral'"
						:variant="listFilters.view === 'grid' ? 'soft' : 'ghost'"
						aria-label="Grid view"
						@click="listFilters.view = 'grid'"
					/>
					<UButton
						icon="i-lucide-list"
						:color="listFilters.view === 'list' ? 'primary' : 'neutral'"
						:variant="listFilters.view === 'list' ? 'soft' : 'ghost'"
						aria-label="List view"
						@click="listFilters.view = 'list'"
					/>
				</UButtonGroup>
			</div>
		</div>

		<UiEmptyState
			v-if="!activeWorkspace"
			icon="i-lucide-building-2"
			title="No workspace selected"
			description="Create or select a workspace to manage projects."
		>
			<template #actions>
				<UButton
					label="Workspaces"
					to="/app/workspaces"
				/>
			</template>
		</UiEmptyState>

		<UiEmptyState
			v-else-if="filteredProjects.length === 0"
			icon="i-lucide-folder-open"
			:title="emptyTitle"
			:description="emptyDescription"
		>
			<template #actions>
				<UButton
					v-if="listFilters.status !== 'archived'"
					label="Create project"
					icon="i-lucide-plus"
					@click="openCreateModal"
				/>
				<UButton
					v-else
					label="Show active projects"
					variant="outline"
					@click="setListFilterStatus('all')"
				/>
			</template>
		</UiEmptyState>

		<div
			v-else-if="listFilters.view === 'grid'"
			class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
		>
			<ProjectCard
				v-for="project in filteredProjects"
				:key="project.id"
				:project="project"
				show-favorite
				@toggle-favorite="onToggleFavorite"
			/>
		</div>

		<ul
			v-else
			class="divide-y divide-muted rounded-xl border border-muted bg-elevated"
		>
			<li
				v-for="project in filteredProjects"
				:key="project.id"
			>
				<ProjectListRow
					:project="project"
					show-favorite
					@toggle-favorite="onToggleFavorite"
				/>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";
import type { ProjectListFilterStatus } from "~/types/project";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Projects",
	appDescription: "All projects in your workspace",
});

useSeoMeta({
	title: `Projects — ${APP_NAME}`,
});

const toast = useToast();
const { activeWorkspace } = useWorkspace();
const {
	listFilters,
	filteredProjects,
	setListFilterStatus,
	toggleFavorite,
} = useProject();
const { openCreateModal } = useProjectCreateModal();

const statusFilterItems = [
	{ label: "All", value: "all" as ProjectListFilterStatus },
	{ label: "Active", value: "active" as ProjectListFilterStatus },
	{ label: "On hold", value: "on_hold" as ProjectListFilterStatus },
	{ label: "Completed", value: "completed" as ProjectListFilterStatus },
	{ label: "Archived", value: "archived" as ProjectListFilterStatus },
];

const emptyTitle = computed(() => {
	if (listFilters.value.favoritesOnly) {
		return "No favorite projects";
	}
	if (listFilters.value.status === "archived") {
		return "No archived projects";
	}
	if (listFilters.value.query.trim()) {
		return "No matches";
	}
	return "No projects yet";
});

const emptyDescription = computed(() => {
	if (listFilters.value.query.trim()) {
		return "Try a different search or clear filters.";
	}
	if (listFilters.value.favoritesOnly) {
		return "Star projects from the list to see them here.";
	}
	return "Create your first project to organize tasks and boards.";
});

async function onToggleFavorite(projectId: string) {
	const result = await toggleFavorite(projectId);
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
	}
}
</script>
