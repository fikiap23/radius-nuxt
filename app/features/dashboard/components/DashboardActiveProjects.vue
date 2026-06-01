<template>
	<DashboardWidgetShell
		title="Active projects"
		description="In progress across this workspace"
		icon="i-lucide-folder-kanban"
		:loading="loading"
		:empty="!loading && projects.length === 0"
		empty-icon="i-lucide-folder-open"
		empty-title="No active projects"
		empty-description="Create a project to organize boards and tasks."
		empty-action-label="Browse projects"
		empty-action-to="/app/projects"
		view-all-to="/app/projects"
		:skeleton-lines="4"
	>
		<ul class="space-y-2">
			<li
				v-for="project in projects"
				:key="project.id"
			>
				<NuxtLink
					:to="`/app/projects/${project.id}/board`"
					class="dashboard-project-row group"
				>
					<span
						class="dashboard-project-row__icon"
						aria-hidden="true"
					>
						<UIcon
							:name="project.icon"
							class="size-4"
						/>
					</span>
					<span class="min-w-0 flex-1">
						<span class="flex items-center gap-2">
							<span class="truncate font-medium text-highlighted">
								{{ project.name }}
							</span>
							<UBadge
								v-if="project.status !== 'active'"
								:label="projectStatusLabel(project.status)"
								color="neutral"
								variant="subtle"
								size="xs"
							/>
						</span>
						<span class="mt-0.5 flex items-center gap-2 text-xs text-muted">
							<span>{{ project.openTasks }} open</span>
							<span aria-hidden="true">·</span>
							<span>{{ project.progress }}% complete</span>
						</span>
						<UProgress
							:model-value="project.progress"
							size="xs"
							class="mt-2"
							:aria-label="`${project.name} progress`"
						/>
					</span>
					<UIcon
						name="i-lucide-chevron-right"
						class="size-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
						aria-hidden="true"
					/>
				</NuxtLink>
			</li>
		</ul>
	</DashboardWidgetShell>
</template>

<script setup lang="ts">
import type { DashboardActiveProject, DashboardProjectStatus } from "~/features/dashboard/types/dashboard";

defineProps<{
	loading?: boolean;
	projects: DashboardActiveProject[];
}>();

function projectStatusLabel(status: DashboardProjectStatus) {
	switch (status) {
		case "on_hold":
			return "On hold";
		case "completed":
			return "Completed";
		default:
			return "Active";
	}
}
</script>
