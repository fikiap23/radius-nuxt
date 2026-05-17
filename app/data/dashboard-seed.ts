import type { DashboardSnapshot } from "~/types/dashboard";

const HQ: DashboardSnapshot = {
	projects: [
		{
			id: "proj-radius-app",
			name: "Radius App",
			icon: "i-lucide-rocket",
			status: "active",
			openTasks: 14,
			progress: 62,
		},
		{
			id: "proj-design-system",
			name: "Design System",
			icon: "i-lucide-palette",
			status: "active",
			openTasks: 6,
			progress: 41,
		},
		{
			id: "proj-onboarding",
			name: "Onboarding",
			icon: "i-lucide-sparkles",
			status: "on_hold",
			openTasks: 3,
			progress: 28,
		},
	],
	taskProgress: {
		completed: 32,
		total: 71,
		byStatus: [
			{ status: "backlog", label: "Backlog", count: 9 },
			{ status: "todo", label: "Todo", count: 14 },
			{ status: "in_progress", label: "In progress", count: 11 },
			{ status: "review", label: "Review", count: 5 },
			{ status: "done", label: "Done", count: 32 },
		],
	},
	activities: [
		{
			id: "act-1",
			title: "Jordan moved a task",
			description: "“API auth middleware” → In progress",
			occurredAt: new Date(Date.now() - 12 * 60_000).toISOString(),
			icon: "i-lucide-arrow-right-left",
		},
		{
			id: "act-2",
			title: "Sam completed a task",
			description: "“Empty state illustrations” marked Done",
			occurredAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
			icon: "i-lucide-circle-check",
		},
		{
			id: "act-3",
			title: "Sprint 12 started",
			description: "Goal: Ship dashboard widgets (S4)",
			occurredAt: new Date(Date.now() - 26 * 3_600_000).toISOString(),
			icon: "i-lucide-flag",
		},
		{
			id: "act-4",
			title: "Alex invited Casey",
			description: "Viewer role on Radius HQ",
			occurredAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
			icon: "i-lucide-user-plus",
		},
	],
	sprint: {
		id: "sprint-12",
		name: "Sprint 12",
		goal: "Dashboard widgets & workspace polish",
		completedPoints: 18,
		totalPoints: 34,
		daysRemaining: 4,
		dailyCompleted: [2, 4, 3, 5, 2, 1, 1],
	},
	assignedTasks: [
		{
			id: "task-1",
			title: "Wire dashboard grid layout",
			projectName: "Radius App",
			status: "in_progress",
			priority: "high",
			dueAt: new Date(Date.now() + 86_400_000).toISOString(),
		},
		{
			id: "task-2",
			title: "Review token contrast in dark mode",
			projectName: "Design System",
			status: "review",
			priority: "medium",
			dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
		},
		{
			id: "task-3",
			title: "Draft onboarding checklist copy",
			projectName: "Onboarding",
			status: "todo",
			priority: "low",
			dueAt: null,
		},
		{
			id: "task-4",
			title: "Hook workspace switcher to store",
			projectName: "Radius App",
			status: "done",
			priority: "medium",
			dueAt: new Date(Date.now() - 86_400_000).toISOString(),
		},
	],
	teamWorkload: [
		{ memberId: "mem-hq-owner", name: "Alex Morgan", taskCount: 8, capacity: 10 },
		{ memberId: "mem-hq-admin", name: "Jordan Lee", taskCount: 11, capacity: 10 },
		{ memberId: "mem-hq-member", name: "Sam Rivera", taskCount: 6, capacity: 10 },
	],
};

const SIDE_PROJECT: DashboardSnapshot = {
	projects: [
		{
			id: "proj-portfolio",
			name: "Portfolio site",
			icon: "i-lucide-globe",
			status: "active",
			openTasks: 4,
			progress: 55,
		},
	],
	taskProgress: {
		completed: 9,
		total: 13,
		byStatus: [
			{ status: "todo", label: "Todo", count: 3 },
			{ status: "in_progress", label: "In progress", count: 1 },
			{ status: "done", label: "Done", count: 9 },
		],
	},
	activities: [
		{
			id: "act-sp-1",
			title: "You created a task",
			description: "“Hero section copy” in Portfolio site",
			occurredAt: new Date(Date.now() - 45 * 60_000).toISOString(),
			icon: "i-lucide-plus-circle",
		},
	],
	sprint: null,
	assignedTasks: [
		{
			id: "task-sp-1",
			title: "Hero section copy",
			projectName: "Portfolio site",
			status: "todo",
			priority: "medium",
			dueAt: new Date(Date.now() + 2 * 86_400_000).toISOString(),
		},
	],
	teamWorkload: [
		{ memberId: "mem-side-owner", name: "Alex Morgan", taskCount: 3, capacity: 8 },
		{ memberId: "mem-side-viewer", name: "Casey Kim", taskCount: 1, capacity: 8 },
	],
};

const EMPTY: DashboardSnapshot = {
	projects: [],
	taskProgress: null,
	activities: [],
	sprint: null,
	assignedTasks: [],
	teamWorkload: [],
};

const BY_WORKSPACE: Record<string, DashboardSnapshot> = {
	"ws-radius-hq": HQ,
	"ws-side-project": SIDE_PROJECT,
	"ws-design-lab": EMPTY,
};

export function getDashboardSnapshot(workspaceId: string | null): DashboardSnapshot {
	if (!workspaceId) {
		return EMPTY;
	}
	return BY_WORKSPACE[workspaceId] ?? EMPTY;
}
