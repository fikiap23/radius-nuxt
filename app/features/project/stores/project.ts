import { SEED_PROJECTS } from "~/data/projects-seed";
import type {
	CreateProjectPayload,
	Project,
	ProjectPersistedState,
	UpdateProjectPayload,
} from "~/types/project";
import {
	createProjectId,
	defaultProjectCover,
	defaultProjectIcon,
} from "~/utils/project";

const PERSIST_KEY = "radius-project-state";
const MOCK_DELAY_MS = 400;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function readPersistedState(): ProjectPersistedState | null {
	if (!import.meta.client) {
		return null;
	}
	try {
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) {
			return null;
		}
		return JSON.parse(raw) as ProjectPersistedState;
	}
	catch {
		return null;
	}
}

function writePersistedState(state: ProjectPersistedState) {
	if (!import.meta.client) {
		return;
	}
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

export const useProjectStore = defineStore("project", () => {
	const projects = ref<Project[]>([...SEED_PROJECTS]);
	const hydrated = ref(false);

	function persist() {
		writePersistedState({ projects: projects.value });
	}

	function hydrateFromStorage() {
		const persisted = readPersistedState();
		if (persisted?.projects?.length) {
			projects.value = persisted.projects.map(project => ({
				...project,
				description: project.description ?? "",
				coverImageUrl: project.coverImageUrl ?? null,
			}));
		}
		hydrated.value = true;
	}

	function getProjectById(id: string) {
		return projects.value.find(p => p.id === id) ?? null;
	}

	function projectsForWorkspace(workspaceId: string | null | undefined) {
		if (!workspaceId) {
			return [];
		}
		return projects.value.filter(p => p.workspaceId === workspaceId);
	}

	async function createProject(
		workspaceId: string,
		payload: CreateProjectPayload,
	) {
		await delay();
		const name = payload.name.trim();
		if (!name) {
			return { ok: false as const, error: "Project name is required." };
		}

		const timestamp = new Date().toISOString();
		const project: Project = {
			id: createProjectId(),
			workspaceId,
			name,
			description: payload.description?.trim() ?? "",
			icon: payload.icon ?? defaultProjectIcon(name),
			cover: payload.cover ?? defaultProjectCover(),
			coverImageUrl: payload.coverImageUrl ?? null,
			status: payload.status ?? "active",
			isFavorite: false,
			archivedAt: null,
			openTasks: 0,
			progress: 0,
			createdAt: timestamp,
			updatedAt: timestamp,
		};

		projects.value = [...projects.value, project];
		persist();

		return { ok: true as const, project };
	}

	async function updateProject(id: string, payload: UpdateProjectPayload) {
		await delay(200);
		const index = projects.value.findIndex(p => p.id === id);
		if (index === -1) {
			return { ok: false as const, error: "Project not found." };
		}

		const current = projects.value[index]!;
		const updated: Project = {
			...current,
			...payload,
			name: payload.name?.trim() ?? current.name,
			updatedAt: new Date().toISOString(),
		};

		projects.value = projects.value.map(p => (p.id === id ? updated : p));
		persist();

		return { ok: true as const, project: updated };
	}

	async function toggleFavorite(id: string) {
		const project = getProjectById(id);
		if (!project) {
			return { ok: false as const, error: "Project not found." };
		}
		return updateProject(id, { isFavorite: !project.isFavorite });
	}

	async function archiveProject(id: string) {
		const project = getProjectById(id);
		if (!project) {
			return { ok: false as const, error: "Project not found." };
		}
		if (project.archivedAt) {
			return { ok: false as const, error: "Project is already archived." };
		}

		await delay(200);
		const updated: Project = {
			...project,
			archivedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		projects.value = projects.value.map(p => (p.id === id ? updated : p));
		persist();

		return { ok: true as const, project: updated };
	}

	async function unarchiveProject(id: string) {
		const project = getProjectById(id);
		if (!project) {
			return { ok: false as const, error: "Project not found." };
		}
		if (!project.archivedAt) {
			return { ok: false as const, error: "Project is not archived." };
		}

		await delay(200);
		const updated: Project = {
			...project,
			archivedAt: null,
			updatedAt: new Date().toISOString(),
		};
		projects.value = projects.value.map(p => (p.id === id ? updated : p));
		persist();

		return { ok: true as const, project: updated };
	}

	function syncTaskMetrics(
		projectId: string,
		metrics: { openTasks: number; progress: number },
	) {
		const index = projects.value.findIndex(p => p.id === projectId);
		if (index === -1) {
			return;
		}
		const current = projects.value[index]!;
		if (
			current.openTasks === metrics.openTasks
			&& current.progress === metrics.progress
		) {
			return;
		}
		projects.value = projects.value.map(p =>
			p.id === projectId
				? {
						...p,
						openTasks: metrics.openTasks,
						progress: metrics.progress,
						updatedAt: new Date().toISOString(),
					}
				: p,
		);
		persist();
	}

	async function deleteProject(id: string) {
		await delay(200);
		const exists = projects.value.some(p => p.id === id);
		if (!exists) {
			return { ok: false as const, error: "Project not found." };
		}
		projects.value = projects.value.filter(p => p.id !== id);
		persist();
		return { ok: true as const };
	}

	return {
		projects,
		hydrated,
		hydrateFromStorage,
		getProjectById,
		projectsForWorkspace,
		createProject,
		updateProject,
		toggleFavorite,
		archiveProject,
		unarchiveProject,
		deleteProject,
		syncTaskMetrics,
	};
});
