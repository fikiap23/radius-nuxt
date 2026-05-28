import { SEED_TASK_ACTIVITIES, SEED_TASKS } from "~/data/tasks-seed";
import type {
	CreateTaskPayload,
	Task,
	TaskActivityEntry,
	TaskAttachment,
	TaskChecklistItem,
	TaskPersistedState,
	TaskSubtask,
	UpdateTaskPayload,
} from "~/types/task";
import {
	computeProjectTaskStats,
	createTaskChildId,
	createTaskId,
	taskPriorityLabel,
	taskStatusLabel,
} from "~/utils/task";

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
	const hydrated = ref(false);

	function persist() {
		writePersistedState({
			tasks: tasks.value,
			activities: activities.value,
		});
	}

	function hydrateFromStorage() {
		const persisted = readPersistedState();
		if (persisted?.tasks?.length) {
			tasks.value = persisted.tasks;
		}
		if (persisted?.activities?.length) {
			activities.value = persisted.activities;
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
		const updated: Task = {
			...current,
			...payload,
			title: payload.title?.trim() ?? current.title,
			description: payload.description?.trim() ?? current.description,
			updatedAt: new Date().toISOString(),
		};

		if (payload.status && payload.status !== current.status) {
			logActivity(id, {
				title: "Status changed",
				description: `${taskStatusLabel(current.status)} → ${taskStatusLabel(payload.status)}`,
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
		hydrated,
		hydrateFromStorage,
		getTaskById,
		tasksForProject,
		activitiesForTask,
		createTask,
		updateTask,
		deleteTask,
		addAttachment,
		removeAttachment,
		patchListField,
	};
});
