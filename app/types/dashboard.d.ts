export type DashboardTaskStatus =
	| "backlog"
	| "todo"
	| "in_progress"
	| "review"
	| "done";

export type DashboardTaskPriority = "low" | "medium" | "high" | "urgent";

export type DashboardProjectStatus = "active" | "on_hold" | "completed";

export interface DashboardActiveProject {
	id: string;
	name: string;
	icon: string;
	status: DashboardProjectStatus;
	openTasks: number;
	progress: number;
}

export interface DashboardStatusCount {
	status: DashboardTaskStatus;
	label: string;
	count: number;
}

export interface DashboardTaskProgress {
	completed: number;
	total: number;
	byStatus: DashboardStatusCount[];
}

export interface DashboardActivity {
	id: string;
	title: string;
	description: string;
	occurredAt: string;
	icon: string;
}

export interface DashboardSprint {
	id: string;
	name: string;
	goal: string;
	completedPoints: number;
	totalPoints: number;
	daysRemaining: number;
	/** Last N days — completed story points per day (mock burndown) */
	dailyCompleted: number[];
}

export interface DashboardAssignedTask {
	id: string;
	title: string;
	projectName: string;
	status: DashboardTaskStatus;
	priority: DashboardTaskPriority;
	dueAt: string | null;
}

export interface DashboardTeamMemberWorkload {
	memberId: string;
	name: string;
	taskCount: number;
	capacity: number;
}

export interface DashboardSnapshot {
	projects: DashboardActiveProject[];
	taskProgress: DashboardTaskProgress | null;
	activities: DashboardActivity[];
	sprint: DashboardSprint | null;
	assignedTasks: DashboardAssignedTask[];
	teamWorkload: DashboardTeamMemberWorkload[];
}

export interface DashboardSummary {
	activeProjects: number;
	openTasks: number;
	dueThisWeek: number;
}
