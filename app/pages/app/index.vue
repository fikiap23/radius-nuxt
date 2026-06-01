<template>
	<div class="app-page app-page--wide space-y-8">
		<section class="app-welcome">
			<div class="app-welcome__glow" aria-hidden="true" />
			<div class="app-welcome__inner">
				<div class="min-w-0 flex-1 space-y-2">
					<p class="app-welcome__eyebrow">
						{{ greeting }}{{ firstName ? `, ${firstName}` : "" }}
					</p>
					<h1 class="app-welcome__title">
						{{ activeWorkspace?.name ?? "Your workspace" }}
					</h1>
					<p class="app-welcome__lead max-w-xl text-sm leading-relaxed text-toned sm:text-base">
						Workspace overview — projects, tasks, sprint, and team activity at a glance.
					</p>
				</div>
				<UButton
					to="/app/projects"
					label="New project"
					icon="i-lucide-plus"
					size="sm"
					class="shrink-0"
				/>
			</div>
		</section>

		<div class="grid gap-3 sm:grid-cols-3">
			<UiAppStatPill
				label="Active projects"
				:value="summary.activeProjects"
				icon="i-lucide-folder-kanban"
				tone="primary"
			/>
			<UiAppStatPill
				label="Open tasks"
				:value="summary.openTasks"
				icon="i-lucide-circle-check"
			/>
			<UiAppStatPill
				label="Due this week"
				:value="summary.dueThisWeek"
				icon="i-lucide-calendar-clock"
				tone="warning"
			/>
		</div>

		<section
			class="dashboard-grid"
			aria-label="Dashboard widgets"
		>
			<DashboardActiveProjects
				:loading="loading"
				:projects="projects"
			/>
			<DashboardTaskProgress
				:loading="loading"
				:task-progress="taskProgress"
			/>
			<DashboardSprintProgress
				:loading="loading"
				:sprint="sprint"
			/>
			<div class="dashboard-grid__wide">
				<DashboardRecentActivity
					:loading="loading"
					:activities="activities"
				/>
			</div>
			<DashboardAssignedTasks
				:loading="loading"
				:tasks="assignedTasks"
			/>
			<DashboardTeamWorkload
				:loading="loading"
				:members="teamWorkload"
			/>
		</section>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Dashboard",
});

useSeoMeta({
	title: `Dashboard — ${APP_NAME}`,
});

const { user } = useAuth();
const { greeting } = useGreeting();
const { activeWorkspace } = useWorkspace();
const {
	loading,
	summary,
	projects,
	taskProgress,
	activities,
	sprint,
	assignedTasks,
	teamWorkload,
} = useDashboard();

const firstName = computed(() => {
	const name = user.value?.name?.trim();
	if (!name) {
		return null;
	}
	return name.split(/\s+/)[0];
});
</script>
