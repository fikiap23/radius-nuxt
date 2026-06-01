import type {
	Project,
	ProjectListFilterStatus,
	ProjectListFilters,
} from "~/features/project/types/project";
import { isProjectArchived } from "~/features/project/utils/project";

const defaultFilters = (): ProjectListFilters => ({
	status: "all",
	favoritesOnly: false,
	query: "",
	view: "grid",
});

export function useProject() {
	const store = useProjectStore();
	const { activeWorkspaceId } = useWorkspace();
	const { projects, hydrated } = storeToRefs(store);

	const listFilters = useState<ProjectListFilters>("project-list-filters", defaultFilters);

	const workspaceProjects = computed(() =>
		store.projectsForWorkspace(activeWorkspaceId.value),
	);

	const filteredProjects = computed(() => {
		let list = workspaceProjects.value;
		const { status, favoritesOnly, query } = listFilters.value;

		if (status === "archived") {
			list = list.filter(p => isProjectArchived(p.archivedAt));
		}
		else {
			list = list.filter(p => !isProjectArchived(p.archivedAt));
			if (status !== "all") {
				list = list.filter(p => p.status === status);
			}
		}

		if (favoritesOnly) {
			list = list.filter(p => p.isFavorite);
		}

		const q = query.trim().toLowerCase();
		if (q) {
			list = list.filter(p => p.name.toLowerCase().includes(q));
		}

		return [...list].sort((a, b) => {
			if (a.isFavorite !== b.isFavorite) {
				return a.isFavorite ? -1 : 1;
			}
			return a.name.localeCompare(b.name);
		});
	});

	const favoriteProjects = computed(() =>
		workspaceProjects.value.filter(
			p => p.isFavorite && !isProjectArchived(p.archivedAt),
		),
	);

	function resetListFilters() {
		listFilters.value = defaultFilters();
	}

	function setListFilterStatus(status: ProjectListFilterStatus) {
		listFilters.value = { ...listFilters.value, status };
	}

	return {
		projects,
		hydrated,
		listFilters,
		workspaceProjects,
		filteredProjects,
		favoriteProjects,
		resetListFilters,
		setListFilterStatus,
		getProjectById: store.getProjectById,
		projectsForWorkspace: store.projectsForWorkspace,
		createProject: store.createProject,
		updateProject: store.updateProject,
		toggleFavorite: store.toggleFavorite,
		archiveProject: store.archiveProject,
		unarchiveProject: store.unarchiveProject,
		deleteProject: store.deleteProject,
	};
}

export function useProjectContext(projectId: MaybeRefOrGetter<string>) {
	const id = computed(() => toValue(projectId));
	const { getProjectById } = useProject();
	const { activeWorkspaceId, activeWorkspace } = useWorkspace();

	const project = computed(() => getProjectById(id.value));

	const hasAccess = computed(() => {
		const p = project.value;
		if (!p || !activeWorkspaceId.value) {
			return false;
		}
		return p.workspaceId === activeWorkspaceId.value;
	});

	const isArchived = computed(() =>
		project.value ? isProjectArchived(project.value.archivedAt) : false,
	);

	return {
		projectId: id,
		project,
		hasAccess,
		isArchived,
		activeWorkspace,
	};
}
