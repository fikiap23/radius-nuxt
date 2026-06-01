<template>
	<DashboardWidgetShell
		title="Recent activity"
		description="Latest updates in your workspace"
		icon="i-lucide-activity"
		:loading="loading"
		:empty="!loading && activities.length === 0"
		empty-icon="i-lucide-bell-off"
		empty-title="No recent activity"
		empty-description="Moves, comments, and invites will appear here."
		:skeleton-lines="4"
	>
		<UTimeline
			:items="timelineItems"
			size="xs"
			class="dashboard-timeline"
			:ui="{
				wrapper: 'min-w-0',
				title: 'text-sm font-medium text-highlighted',
				description: 'text-xs text-muted line-clamp-2',
				date: 'text-xs text-muted tabular-nums',
			}"
		/>
	</DashboardWidgetShell>
</template>

<script setup lang="ts">
import type { TimelineItem } from "@nuxt/ui";
import type { DashboardActivity } from "~/types/dashboard";
import { formatDashboardRelativeTime } from "~/utils/dashboard";

const props = defineProps<{
	loading?: boolean;
	activities: DashboardActivity[];
}>();

const timelineItems = computed<TimelineItem[]>(() =>
	props.activities.map(activity => ({
		date: formatDashboardRelativeTime(activity.occurredAt),
		title: activity.title,
		description: activity.description,
		icon: activity.icon,
	})),
);
</script>
