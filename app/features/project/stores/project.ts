import { useWorkspaceStore } from "~/features/workspace/stores/workspace";
import { useProjectApi } from "~/features/project/composables/useProjectApi";
import type {
	CreateProjectPayload,
	Project,
	UpdateProjectPayload,
} from "~/features/project/types/project";

export const useProjectStore = defineStore("project", () => {
	const workspaceStore = useWorkspaceStore();
	const projectApi = useProjectApi();

	const projects = ref<Project[]>([]);
	const hydrated = ref(false);

	async function loadProjectsForWorkspace(workspaceId: string) {
		const result = await projectApi.getProjects(workspaceId);
		if (result.ok) {
			projects.value = [
				...projects.value.filter(p => p.workspaceId !== workspaceId),
				...result.data,
			];
		}
	}

	watch(
		() => workspaceStore.activeWorkspaceId,
		async (workspaceId) => {
			if (workspaceId) {
				await loadProjectsForWorkspace(workspaceId);
			} else {
				projects.value = [];
			}
		},
	);

	async function hydrateFromStorage() {
		if (hydrated.value) {
			return;
		}
		const workspaceId = workspaceStore.activeWorkspaceId;
		if (workspaceId) {
			await loadProjectsForWorkspace(workspaceId);
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
		const name = payload.name.trim();
		if (!name) {
			return { ok: false as const, error: "Project name is required." };
		}

		const result = await projectApi.createProject(workspaceId, payload);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to create project." };
		}

		const project = result.data;
		projects.value = [...projects.value, project];

		return { ok: true as const, project };
	}

	async function updateProject(id: string, payload: UpdateProjectPayload) {
		const result = await projectApi.updateProject(id, payload);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to update project." };
		}

		const updated = result.data;
		projects.value = projects.value.map(p => (p.id === id ? updated : p));

		return { ok: true as const, project: updated };
	}

	async function toggleFavorite(id: string) {
		const result = await projectApi.toggleFavorite(id);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to toggle favorite." };
		}

		const { isFavorite } = result.data;
		projects.value = projects.value.map(p =>
			p.id === id ? { ...p, isFavorite, updatedAt: new Date().toISOString() } : p,
		);

		const updatedProject = getProjectById(id);
		if (!updatedProject) {
			return { ok: false as const, error: "Project not found after update." };
		}

		return { ok: true as const, project: updatedProject };
	}

	async function archiveProject(id: string) {
		const result = await projectApi.archiveProject(id);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to archive project." };
		}

		const { archivedAt } = result.data;
		projects.value = projects.value.map(p =>
			p.id === id ? { ...p, archivedAt, updatedAt: new Date().toISOString() } : p,
		);

		const updatedProject = getProjectById(id);
		if (!updatedProject) {
			return { ok: false as const, error: "Project not found after archive." };
		}

		return { ok: true as const, project: updatedProject };
	}

	async function unarchiveProject(id: string) {
		const result = await projectApi.unarchiveProject(id);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to unarchive project." };
		}

		const { archivedAt } = result.data;
		projects.value = projects.value.map(p =>
			p.id === id ? { ...p, archivedAt, updatedAt: new Date().toISOString() } : p,
		);

		const updatedProject = getProjectById(id);
		if (!updatedProject) {
			return { ok: false as const, error: "Project not found after unarchive." };
		}

		return { ok: true as const, project: updatedProject };
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
	}

	async function deleteProject(id: string) {
		const result = await projectApi.deleteProject(id);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to delete project." };
		}

		projects.value = projects.value.filter(p => p.id !== id);
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
