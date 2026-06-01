<template>
	<DashboardWidgetShell
		title="Assigned to me"
		description="Your open work across projects"
		icon="i-lucide-list-checks"
		:loading="loading"
		:empty="!loading && openTasks.length === 0"
		empty-icon="i-lucide-inbox"
		empty-title="Nothing assigned"
		empty-description="Tasks assigned to you will show up here."
		empty-action-label="My tasks"
		empty-action-to="/app/my-tasks"
		view-all-to="/app/my-tasks"
		:skeleton-lines="4"
	>
		<ul class="divide-y divide-muted/60">
			<li
				v-for="task in openTasks"
				:key="task.id"
			>
				<NuxtLink
					:to="`/app/my-tasks`"
					class="dashboard-task-row group"
				>
					<span class="min-w-0 flex-1">
						<span class="block truncate font-medium text-highlighted group-hover:text-primary">
							{{ task.title }}
						</span>
						<span class="mt-0.5 block truncate text-xs text-muted">
							{{ task.projectName }}
						</span>
					</span>
					<span class="flex shrink-0 flex-col items-end gap-1">
						<UBadge
							:label="dashboardStatusLabel(task.status)"
							:color="dashboardStatusColor(task.status)"
							variant="subtle"
							size="xs"
						/>
						<span
							v-if="dueLabel(task.dueAt)"
							class="text-[10px] text-muted"
						>
							{{ dueLabel(task.dueAt) }}
						</span>
						<UBadge
							v-if="task.priority === 'high' || task.priority === 'urgent'"
							:label="dashboardPriorityLabel(task.priority)"
							:color="dashboardPriorityColor(task.priority)"
							variant="outline"
							size="xs"
						/>
					</span>
				</NuxtLink>
			</li>
		</ul>
	</DashboardWidgetShell>
</template>

<script setup lang="ts">
import type { DashboardAssignedTask } from "~/features/dashboard/types/dashboard";
import {
	dashboardPriorityColor,
	dashboardPriorityLabel,
	dashboardStatusColor,
	dashboardStatusLabel,
	formatDashboardDueDate,
} from "~/features/dashboard/utils/dashboard";

const props = defineProps<{
	loading?: boolean;
	tasks: DashboardAssignedTask[];
}>();

const openTasks = computed(() =>
	props.tasks.filter(task => task.status !== "done"),
);

function dueLabel(dueAt: string | null) {
	return formatDashboardDueDate(dueAt);
}
</script>
