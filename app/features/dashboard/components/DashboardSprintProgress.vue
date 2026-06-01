<template>
	<DashboardWidgetShell
		title="Sprint progress"
		description="Active sprint velocity"
		icon="i-lucide-flag"
		:loading="loading"
		:empty="!loading && !sprint"
		empty-icon="i-lucide-calendar-range"
		empty-title="No active sprint"
		empty-description="Start a sprint from a project to track burndown here."
		empty-action-label="View projects"
		empty-action-to="/app/projects"
		:skeleton-lines="4"
	>
		<div
			v-if="sprint"
			class="space-y-4"
		>
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<p class="font-medium text-highlighted">
						{{ sprint.name }}
					</p>
					<p class="mt-0.5 text-xs text-muted line-clamp-2">
						{{ sprint.goal }}
					</p>
				</div>
				<UBadge
					:label="`${sprint.daysRemaining}d left`"
					color="primary"
					variant="subtle"
					size="xs"
				/>
			</div>

			<div class="flex items-end justify-between gap-2 text-sm">
				<span class="text-toned">
					<span class="font-semibold text-highlighted">{{ sprint.completedPoints }}</span>
					/
					{{ sprint.totalPoints }} pts
				</span>
				<span class="text-xs text-muted">{{ sprintPercent }}% complete</span>
			</div>
			<UProgress
				:model-value="sprintPercent"
				size="sm"
				:aria-label="`Sprint ${sprintPercent}% complete`"
			/>

			<div
				class="dashboard-sprint-chart"
				role="img"
				:aria-label="`Burndown trend, last ${sprint.dailyCompleted.length} days`"
			>
				<div
					v-for="(value, index) in sprint.dailyCompleted"
					:key="index"
					class="dashboard-sprint-chart__bar"
					:style="{ '--h': barHeight(value) }"
					:title="`${value} pts`"
				/>
			</div>
			<p class="text-center text-[10px] uppercase tracking-wider text-muted">
				Last {{ sprint.dailyCompleted.length }} days (mock)
			</p>
		</div>
	</DashboardWidgetShell>
</template>

<script setup lang="ts">
import type { DashboardSprint } from "~/features/dashboard/types/dashboard";

const props = defineProps<{
	loading?: boolean;
	sprint: DashboardSprint | null;
}>();

const sprintPercent = computed(() => {
	if (!props.sprint || props.sprint.totalPoints === 0) {
		return 0;
	}
	return Math.round(
		(props.sprint.completedPoints / props.sprint.totalPoints) * 100,
	);
});

function barHeight(value: number) {
	const max = Math.max(...(props.sprint?.dailyCompleted ?? [1]), 1);
	return `${Math.max(12, Math.round((value / max) * 100))}%`;
}
</script>
