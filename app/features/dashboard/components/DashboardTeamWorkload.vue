<template>
	<DashboardWidgetShell
		title="Team workload"
		description="Open tasks per member"
		icon="i-lucide-users"
		:loading="loading"
		:empty="!loading && members.length === 0"
		empty-icon="i-lucide-user-x"
		empty-title="No team data"
		empty-description="Invite members to see workload distribution."
		empty-action-label="Workspace settings"
		empty-action-to="/app/workspaces"
		:skeleton-lines="4"
	>
		<div class="mb-4 flex items-center justify-between gap-3">
			<UAvatarGroup
				size="sm"
				:max="5"
			>
				<UAvatar
					v-for="member in members"
					:key="member.memberId"
					:alt="member.name"
					:text="initials(member.name)"
				/>
			</UAvatarGroup>
			<span class="text-xs text-muted">
				{{ members.length }} members
			</span>
		</div>

		<ul class="space-y-3">
			<li
				v-for="member in members"
				:key="member.memberId"
			>
				<div class="mb-1 flex items-center justify-between gap-2 text-sm">
					<span class="truncate font-medium text-highlighted">{{ member.name }}</span>
					<span
						class="shrink-0 text-xs tabular-nums"
						:class="loadTone(member)"
					>
						{{ member.taskCount }} / {{ member.capacity }}
					</span>
				</div>
				<div
					class="dashboard-workload-bar"
					role="progressbar"
					:aria-valuenow="loadPercent(member)"
					aria-valuemin="0"
					aria-valuemax="100"
					:aria-label="`${member.name} workload`"
				>
					<span
						class="dashboard-workload-bar__fill"
						:class="loadBarClass(member)"
						:style="{ width: `${loadPercent(member)}%` }"
					/>
				</div>
			</li>
		</ul>
	</DashboardWidgetShell>
</template>

<script setup lang="ts">
import type { DashboardTeamMemberWorkload } from "~/features/dashboard/types/dashboard";
import { workspaceInitials } from "~/features/workspace/utils/workspace";

defineProps<{
	loading?: boolean;
	members: DashboardTeamMemberWorkload[];
}>();

function initials(name: string) {
	return workspaceInitials(name);
}

function loadPercent(member: DashboardTeamMemberWorkload) {
	if (member.capacity <= 0) {
		return 0;
	}
	return Math.min(100, Math.round((member.taskCount / member.capacity) * 100));
}

function loadTone(member: DashboardTeamMemberWorkload) {
	const pct = loadPercent(member);
	if (pct > 100) {
		return "text-error font-medium";
	}
	if (pct >= 85) {
		return "text-warning font-medium";
	}
	return "text-muted";
}

function loadBarClass(member: DashboardTeamMemberWorkload) {
	const pct = loadPercent(member);
	if (pct > 100) {
		return "dashboard-workload-bar__fill--over";
	}
	if (pct >= 85) {
		return "dashboard-workload-bar__fill--high";
	}
	return "";
}
</script>
