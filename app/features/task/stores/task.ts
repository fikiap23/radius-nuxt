import { SEED_TASK_COMMENTS } from "~/features/task/data/comments-seed";
import { SEED_TASK_ACTIVITIES, SEED_TASKS } from "~/features/task/data/tasks-seed";
import type {
	CreateTaskCommentPayload,
	CreateTaskPayload,
	Task,
	TaskActivityEntry,
	TaskAttachment,
	TaskChecklistItem,
	TaskComment,
	TaskPersistedState,
	TaskSubtask,
	UpdateTaskCommentPayload,
	UpdateTaskPayload,
} from "~/features/task/types/task";
import { commentBodyPreview, extractMentionIdsFromBody } from "~/features/task/utils/comment";
import { isRichTextEmpty } from "~/features/task/utils/rich-text";
import {
	computeProjectTaskStats,
	createTaskChildId,
	createTaskId,
	taskPriorityLabel,
	taskStatusLabel,
} from "~/features/task/utils/task";

const PERSIST_KEY = "radius-task-state";
const MOCK_DELAY_MS = 350;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function readPersistedState(): TaskPersistedState | null {
	if (!import.meta.client) {
		return null;
	}
	try {
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) {
			return null;
		}
		return JSON.parse(raw) as TaskPersistedState;
	}
	catch {
		return null;
	}
}

function writePersistedState(state: TaskPersistedState) {
	if (!import.meta.client) {
		return;
	}
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

export const useTaskStore = defineStore("task", () => {
	const tasks = ref<Task[]>([...SEED_TASKS]);
	const activities = ref<TaskActivityEntry[]>([...SEED_TASK_ACTIVITIES]);
	const comments = ref<TaskComment[]>([...SEED_TASK_COMMENTS]);
	const hydrated = ref(false);

	function persist() {
		writePersistedState({
			tasks: tasks.value,
			activities: activities.value,
			comments: comments.value,
		});
	}

	function hydrateFromStorage() {
		const persisted = readPersistedState();
		if (persisted?.tasks?.length) {
			tasks.value = persisted.tasks.map(task => ({
				...task,
				columnId: task.columnId ?? null,
			}));
		}
		if (persisted?.activities?.length) {
			activities.value = persisted.activities;
		}
		if (persisted?.comments?.length) {
			comments.value = persisted.comments.map(comment => ({
				...comment,
				mentionIds:
					comment.mentionIds ?? extractMentionIdsFromBody(comment.body),
			}));
		}
		hydrated.value = true;
	}

	function getTaskById(id: string) {
		return tasks.value.find(t => t.id === id) ?? null;
	}

	function tasksForProject(projectId: string) {
		return tasks.value.filter(t => t.projectId === projectId);
	}

	function activitiesForTask(taskId: string) {
		return [...activities.value]
			.filter(a => a.taskId === taskId)
			.sort(
				(a, b) =>
					new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
			);
	}

	function commentsForTask(taskId: string) {
		return [...comments.value]
			.filter(c => c.taskId === taskId)
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			);
	}

	function getCommentById(id: string) {
		return comments.value.find(c => c.id === id) ?? null;
	}

	function logActivity(
		taskId: string,
		entry: Omit<TaskActivityEntry, "id" | "taskId" | "occurredAt">,
	) {
		const activity: TaskActivityEntry = {
			id: createTaskChildId("act"),
			taskId,
			occurredAt: new Date().toISOString(),
			...entry,
		};
		activities.value = [activity, ...activities.value];
	}

	function syncProjectStats(projectId: string) {
		const projectStore = useProjectStore();
		if (!projectStore.getProjectById(projectId)) {
			return;
		}
		const stats = computeProjectTaskStats(tasksForProject(projectId));
		projectStore.syncTaskMetrics(projectId, stats);
	}

	async function createTask(
		projectId: string,
		workspaceId: string,
		payload: CreateTaskPayload,
	) {
		await delay();
		const title = payload.title.trim();
		if (!title) {
			return { ok: false as const, error: "Task title is required." };
		}

		const timestamp = new Date().toISOString();
		const task: Task = {
			id: createTaskId(),
			projectId,
			workspaceId,
			title,
			description: payload.description?.trim() ?? "",
			status: payload.status ?? "todo",
			columnId: payload.columnId ?? payload.status ?? "todo",
			priority: payload.priority ?? "medium",
			dueAt: payload.dueAt ?? null,
			labelIds: payload.labelIds ?? [],
			assigneeId: payload.assigneeId ?? null,
			subtasks: [],
			checklist: [],
			attachments: [],
			createdAt: timestamp,
			updatedAt: timestamp,
		};

		tasks.value = [...tasks.value, task];
		logActivity(task.id, {
			title: "Task created",
			description: title,
			icon: "i-lucide-plus-circle",
		});
		persist();
		syncProjectStats(projectId);

		return { ok: true as const, task };
	}

	async function updateTask(id: string, payload: UpdateTaskPayload) {
		await delay(200);
		const index = tasks.value.findIndex(t => t.id === id);
		if (index === -1) {
			return { ok: false as const, error: "Task not found." };
		}

		const current = tasks.value[index]!;
		const statusChanged =
			payload.status !== undefined && payload.status !== current.status;

		const updated: Task = {
			...current,
			...payload,
			title: payload.title?.trim() ?? current.title,
			description: payload.description?.trim() ?? current.description,
			updatedAt: new Date().toISOString(),
		};

		if (statusChanged && payload.columnId === undefined) {
			updated.columnId = payload.status!;
		}

		if (statusChanged) {
			logActivity(id, {
				title: "Status changed",
				description: `${taskStatusLabel(current.status)} → ${taskStatusLabel(payload.status!)}`,
				icon: "i-lucide-arrow-right-left",
			});
		}

		if (
			payload.priority !== undefined
			&& payload.priority !== current.priority
		) {
			logActivity(id, {
				title: "Priority updated",
				description: taskPriorityLabel(payload.priority),
				icon: "i-lucide-flag",
			});
		}

		if (
			payload.assigneeId !== undefined
			&& payload.assigneeId !== current.assigneeId
		) {
			logActivity(id, {
				title: payload.assigneeId ? "Assignee updated" : "Assignee cleared",
				icon: "i-lucide-user",
			});
		}

		tasks.value = tasks.value.map(t => (t.id === id ? updated : t));
		persist();
		syncProjectStats(current.projectId);

		return { ok: true as const, task: updated };
	}

	async function deleteTask(id: string) {
		await delay(200);
		const task = getTaskById(id);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}
		tasks.value = tasks.value.filter(t => t.id !== id);
		activities.value = activities.value.filter(a => a.taskId !== id);
		comments.value = comments.value.filter(c => c.taskId !== id);
		persist();
		syncProjectStats(task.projectId);
		return { ok: true as const };
	}

	async function addAttachment(id: string, file: File) {
		const task = getTaskById(id);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}

		const attachment: TaskAttachment = {
			id: createTaskChildId("att"),
			name: file.name,
			size: file.size,
			mimeType: file.type || "application/octet-stream",
			uploadedAt: new Date().toISOString(),
		};

		return updateTask(id, {
			attachments: [...task.attachments, attachment],
		}).then(result => {
			if (result.ok) {
				logActivity(id, {
					title: "Attachment added",
					description: file.name,
					icon: "i-lucide-paperclip",
				});
				persist();
			}
			return result;
		});
	}

	async function removeAttachment(taskId: string, attachmentId: string) {
		const task = getTaskById(taskId);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}
		const removed = task.attachments.find(a => a.id === attachmentId);
		const result = await updateTask(taskId, {
			attachments: task.attachments.filter(a => a.id !== attachmentId),
		});
		if (result.ok && removed) {
			logActivity(taskId, {
				title: "Attachment removed",
				description: removed.name,
				icon: "i-lucide-trash-2",
			});
			persist();
		}
		return result;
	}

	async function createComment(taskId: string, payload: CreateTaskCommentPayload) {
		await delay(200);
		const task = getTaskById(taskId);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}

		const body = payload.body.trim();
		if (isRichTextEmpty(body)) {
			return { ok: false as const, error: "Comment cannot be empty." };
		}

		const timestamp = new Date().toISOString();
		const comment: TaskComment = {
			id: createTaskChildId("cmt"),
			taskId,
			authorId: payload.authorId ?? null,
			authorName: payload.authorName.trim() || "Unknown",
			body,
			mentionIds: extractMentionIdsFromBody(body),
			createdAt: timestamp,
			updatedAt: timestamp,
		};

		comments.value = [...comments.value, comment];
		logActivity(taskId, {
			title: "Comment added",
			description: commentBodyPreview(body),
			icon: "i-lucide-message-square",
		});
		persist();

		if (import.meta.client && comment.mentionIds.length) {
			const workspaceStore = useWorkspaceStore();
			const notificationStore = useNotificationStore();
			const members = workspaceStore.getMembersForWorkspace(task.workspaceId);
			const authorMember = payload.authorId
				? members.find(m => m.id === payload.authorId)
				: null;
			const authorEmail = authorMember?.email.toLowerCase();

			for (const memberId of comment.mentionIds) {
				const mentioned = members.find(m => m.id === memberId);
				if (!mentioned?.email) {
					continue;
				}
				if (authorEmail && mentioned.email.toLowerCase() === authorEmail) {
					continue;
				}
				notificationStore.notifyMention({
					recipientEmail: mentioned.email,
					workspaceId: task.workspaceId,
					authorName: comment.authorName,
					taskTitle: task.title,
					bodyPreview: commentBodyPreview(body),
					taskId: task.id,
					projectId: task.projectId,
				});
			}
		}

		return { ok: true as const, comment };
	}

	async function updateComment(id: string, payload: UpdateTaskCommentPayload) {
		await delay(200);
		const index = comments.value.findIndex(c => c.id === id);
		if (index === -1) {
			return { ok: false as const, error: "Comment not found." };
		}

		const body = payload.body.trim();
		if (isRichTextEmpty(body)) {
			return { ok: false as const, error: "Comment cannot be empty." };
		}

		const current = comments.value[index]!;
		const updated: TaskComment = {
			...current,
			body,
			mentionIds: extractMentionIdsFromBody(body),
			updatedAt: new Date().toISOString(),
		};

		comments.value = comments.value.map(c => (c.id === id ? updated : c));
		persist();

		return { ok: true as const, comment: updated };
	}

	async function deleteComment(id: string) {
		await delay(200);
		const comment = getCommentById(id);
		if (!comment) {
			return { ok: false as const, error: "Comment not found." };
		}
		comments.value = comments.value.filter(c => c.id !== id);
		persist();
		return { ok: true as const };
	}

	function patchListField<K extends "subtasks" | "checklist">(
		taskId: string,
		field: K,
		value: K extends "subtasks" ? TaskSubtask[] : TaskChecklistItem[],
	) {
		const task = getTaskById(taskId);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}
		return updateTask(taskId, { [field]: value } as UpdateTaskPayload);
	}

	return {
		tasks,
		activities,
		comments,
		hydrated,
		hydrateFromStorage,
		getTaskById,
		tasksForProject,
		activitiesForTask,
		commentsForTask,
		getCommentById,
		createTask,
		updateTask,
		deleteTask,
		createComment,
		updateComment,
		deleteComment,
		addAttachment,
		removeAttachment,
		patchListField,
	};
});
