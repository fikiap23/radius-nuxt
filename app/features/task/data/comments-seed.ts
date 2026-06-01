import type { TaskComment } from "~/features/task/types/task";

const base = "2026-05-22T14:00:00.000Z";

export const SEED_TASK_COMMENTS: TaskComment[] = [
	{
		id: "cmt-auth-1",
		taskId: "task-radius-auth",
		authorId: "mem-hq-owner",
		authorName: "Alex Morgan",
		body: "@[Jordan Lee](mem-hq-admin) can you double-check the workspace header guard before we merge?",
		mentionIds: ["mem-hq-admin"],
		createdAt: base,
		updatedAt: base,
	},
	{
		id: "cmt-auth-2",
		taskId: "task-radius-auth",
		authorId: "mem-hq-admin",
		authorName: "Jordan Lee",
		body: "On it — I'll add a test for missing workspace scope. @[Sam Rivera](mem-hq-member) FYI for the docs pass.",
		mentionIds: ["mem-hq-member"],
		createdAt: new Date(Date.now() - 18 * 3_600_000).toISOString(),
		updatedAt: new Date(Date.now() - 18 * 3_600_000).toISOString(),
	},
	{
		id: "cmt-dash-1",
		taskId: "task-radius-dashboard",
		authorId: "mem-hq-member",
		authorName: "Sam Rivera",
		body: "Widget skeletons look good on mobile. One nit: empty state copy could be shorter.",
		mentionIds: [],
		createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
		updatedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
	},
];
