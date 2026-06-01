<template>
	<DashboardWidgetShell
		title="Task progress"
		description="Status breakdown for all projects"
		icon="i-lucide-pie-chart"
		:loading="loading"
		:empty="!loading && !taskProgress"
		empty-icon="i-lucide-circle-dashed"
		empty-title="No tasks yet"
		empty-description="Tasks you create will roll up into this summary."
		empty-action-label="Go to my tasks"
		empty-action-to="/app/my-tasks"
		:skeleton-lines="5"
	>
		<div
			v-if="taskProgress"
			class="flex flex-col gap-5 sm:flex-row sm:items-center"
		>
			<div
				class="dashboard-progress-ring shrink-0"
				:style="ringStyle"
				role="img"
				:aria-label="`${completionPercent}% of tasks completed`"
			>
				<div class="dashboard-progress-ring__inner">
					<span class="dashboard-progress-ring__value">{{ completionPercent }}%</span>
					<span class="dashboard-progress-ring__label">done</span>
				</div>
			</div>

			<div class="min-w-0 flex-1 space-y-3">
				<p class="text-sm text-toned">
					<span class="font-semibold text-highlighted">{{ taskProgress.completed }}</span>
					of
					<span class="font-semibold text-highlighted">{{ taskProgress.total }}</span>
					tasks completed
				</p>
				<ul class="space-y-2.5">
					<li
						v-for="row in taskProgress.byStatus"
						:key="row.status"
					>
						<div class="mb-1 flex items-center justify-between gap-2 text-xs">
							<span class="text-toned">{{ row.label }}</span>
							<span class="font-medium tabular-nums text-highlighted">{{ row.count }}</span>
						</div>
						<UProgress
							:model-value="statusPercent(row.count)"
							size="xs"
							:color="dashboardStatusColor(row.status)"
						/>
					</li>
				</ul>
			</div>
		</div>
	</DashboardWidgetShell>
</template>

<script setup lang="ts">
import type { DashboardTaskProgress } from "~/features/dashboard/types/dashboard";
import { dashboardStatusColor } from "~/features/dashboard/utils/dashboard";

const props = defineProps<{
	loading?: boolean;
	taskProgress: DashboardTaskProgress | null;
}>();

const completionPercent = computed(() => {
	if (!props.taskProgress || props.taskProgress.total === 0) {
		return 0;
	}
	return Math.round(
		(props.taskProgress.completed / props.taskProgress.total) * 100,
	);
});

const ringStyle = computed(() => ({
	"--progress": `${completionPercent.value}`,
}));

function statusPercent(count: number) {
	if (!props.taskProgress || props.taskProgress.total === 0) {
		return 0;
	}
	return Math.round((count / props.taskProgress.total) * 100);
}
</script>
