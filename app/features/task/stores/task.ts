import { useTaskApi } from "~/features/task/composables/useTaskApi";
import { SEED_TASK_COMMENTS } from "~/features/task/data/comments-seed";
import type {
	CreateTaskCommentPayload,
	CreateTaskPayload,
	Task,
	TaskActivityEntry,
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
} from "~/features/task/utils/task";

const PERSIST_KEY = "radius-task-state";

function readPersistedComments(): TaskComment[] | null {
	if (!import.meta.client) {
		return null;
	}
	try {
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) {
			return null;
		}
		const parsed = JSON.parse(raw) as TaskPersistedState;
		return parsed.comments ?? null;
	}
	catch {
		return null;
	}
}

function writePersistedComments(comments: TaskComment[]) {
	if (!import.meta.client) {
		return;
	}
	localStorage.setItem(PERSIST_KEY, JSON.stringify({ comments }));
}

export const useTaskStore = defineStore("task", () => {
	const taskApi = useTaskApi();
	const { upload } = useStorage();

	const tasks = ref<Task[]>([]);
	const activities = ref<TaskActivityEntry[]>([]);
	const comments = ref<TaskComment[]>([...SEED_TASK_COMMENTS]);
	const loadedProjectIds = ref<Set<string>>(new Set());
	const loadingProjectIds = ref<Set<string>>(new Set());
	const commentsHydrated = ref(false);

	function hydrateCommentsFromStorage() {
		const persisted = readPersistedComments();
		if (persisted?.length) {
			comments.value = persisted.map(comment => ({
				...comment,
				mentionIds:
					comment.mentionIds ?? extractMentionIdsFromBody(comment.body),
			}));
		}
		commentsHydrated.value = true;
	}

	function persistComments() {
		writePersistedComments(comments.value);
	}

	function setTasksForProject(projectId: string, projectTasks: Task[]) {
		tasks.value = [
			...tasks.value.filter(t => t.projectId !== projectId),
			...projectTasks.map(task => ({
				...task,
				columnId: task.columnId ?? null,
			})),
		];
	}

	function isProjectLoaded(projectId: string) {
		return loadedProjectIds.value.has(projectId);
	}

	function isProjectLoading(projectId: string) {
		return loadingProjectIds.value.has(projectId);
	}

	async function loadTasksForProject(projectId: string) {
		if (!projectId || loadedProjectIds.value.has(projectId)) {
			return;
		}
		if (loadingProjectIds.value.has(projectId)) {
			return;
		}

		loadingProjectIds.value = new Set([...loadingProjectIds.value, projectId]);

		const result = await taskApi.getTasks(projectId);

		loadingProjectIds.value = new Set(
			[...loadingProjectIds.value].filter(id => id !== projectId),
		);

		if (result.ok) {
			setTasksForProject(projectId, result.data);
		}

		loadedProjectIds.value = new Set([...loadedProjectIds.value, projectId]);
	}

	function normalizeActivityEntry(
		entry: TaskActivityEntry,
		taskId: string,
		index: number,
	): TaskActivityEntry {
		return {
			...entry,
			taskId: entry.taskId ?? taskId,
			id: entry.id ?? `${taskId}-act-${index}-${entry.occurredAt}`,
		};
	}

	async function loadActivitiesForTask(taskId: string) {
		const result = await taskApi.getActivities(taskId);
		if (!result.ok) {
			return;
		}

		const normalized = result.data.map((entry, index) =>
			normalizeActivityEntry(entry, taskId, index),
		);

		activities.value = [
			...activities.value.filter(a => a.taskId !== taskId),
			...normalized,
		];
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
		_workspaceId: string,
		payload: CreateTaskPayload,
	) {
		const title = payload.title.trim();
		if (!title) {
			return { ok: false as const, error: "Task title is required." };
		}

		const result = await taskApi.createTask(projectId, {
			...payload,
			title,
			description: payload.description?.trim() ?? "",
		});

		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to create task." };
		}

		const task = result.data;
		tasks.value = [...tasks.value, task];
		syncProjectStats(projectId);

		return { ok: true as const, task };
	}

	async function updateTask(id: string, payload: UpdateTaskPayload) {
		const current = getTaskById(id);
		if (!current) {
			return { ok: false as const, error: "Task not found." };
		}

		const body: UpdateTaskPayload = {
			...payload,
			...(payload.title !== undefined ? { title: payload.title.trim() } : {}),
			...(payload.description !== undefined
				? { description: payload.description.trim() }
				: {}),
		};

		const result = await taskApi.updateTask(id, body);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to update task." };
		}

		const updated = result.data;
		tasks.value = tasks.value.map(t => (t.id === id ? updated : t));
		syncProjectStats(current.projectId);
		void loadActivitiesForTask(id);

		return { ok: true as const, task: updated };
	}

	async function deleteTask(id: string) {
		const task = getTaskById(id);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}

		const result = await taskApi.deleteTask(id);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to delete task." };
		}

		tasks.value = tasks.value.filter(t => t.id !== id);
		activities.value = activities.value.filter(a => a.taskId !== id);
		comments.value = comments.value.filter(c => c.taskId !== id);
		persistComments();
		syncProjectStats(task.projectId);

		return { ok: true as const };
	}

	async function addAttachment(id: string, file: File) {
		const task = getTaskById(id);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}

		const uploadResult = await upload(file, "task_attachment", { taskId: id });
		if (!uploadResult.ok) {
			return { ok: false as const, error: uploadResult.error };
		}

		const result = await taskApi.createAttachment(id, {
			tempKey: uploadResult.tempKey,
			fileName: file.name,
			contentType: file.type || "application/octet-stream",
			size: file.size,
		});

		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to add attachment." };
		}

		const attachment = result.data;
		const updated: Task = {
			...task,
			attachments: [...task.attachments, attachment],
			updatedAt: new Date().toISOString(),
		};

		tasks.value = tasks.value.map(t => (t.id === id ? updated : t));
		void loadActivitiesForTask(id);

		return { ok: true as const, task: updated };
	}

	async function removeAttachment(taskId: string, attachmentId: string) {
		const task = getTaskById(taskId);
		if (!task) {
			return { ok: false as const, error: "Task not found." };
		}

		const result = await taskApi.deleteAttachment(taskId, attachmentId);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to remove attachment." };
		}

		const updated: Task = {
			...task,
			attachments: task.attachments.filter(a => a.id !== attachmentId),
			updatedAt: new Date().toISOString(),
		};

		tasks.value = tasks.value.map(t => (t.id === taskId ? updated : t));
		void loadActivitiesForTask(taskId);

		return { ok: true as const, task: updated };
	}

	async function createComment(taskId: string, payload: CreateTaskCommentPayload) {
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
		persistComments();

		if (import.meta.client && comment.mentionIds.length) {
			const workspaceStore = useWorkspaceStore();
			const notificationStore = useNotificationStore();
			const members = workspaceStore.getMembersForWorkspace(task.workspaceId);
			const authorMember = payload.authorId
				? members.find(m => m.userId === payload.authorId)
				: null;
			const authorEmail = authorMember?.email.toLowerCase();

			for (const userId of comment.mentionIds) {
				const mentioned = members.find(m => m.userId === userId);
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
		persistComments();

		return { ok: true as const, comment: updated };
	}

	async function deleteComment(id: string) {
		const comment = getCommentById(id);
		if (!comment) {
			return { ok: false as const, error: "Comment not found." };
		}
		comments.value = comments.value.filter(c => c.id !== id);
		persistComments();
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
		commentsHydrated,
		hydrateCommentsFromStorage,
		isProjectLoaded,
		isProjectLoading,
		loadTasksForProject,
		loadActivitiesForTask,
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
