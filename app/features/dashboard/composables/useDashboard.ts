import { getDashboardSnapshot } from "~/features/dashboard/data/dashboard-seed";
import type {
	DashboardActiveProject,
	DashboardSnapshot,
	DashboardSummary,
} from "~/features/dashboard/types/dashboard";
import { isProjectArchived } from "~/features/project/utils/project";

const MOCK_DELAY_MS = 480;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function buildSummary(snapshot: DashboardSnapshot): DashboardSummary {
	const openTasks = snapshot.taskProgress
		? snapshot.taskProgress.total - snapshot.taskProgress.completed
		: 0;

	const weekEnd = Date.now() + 7 * 86_400_000;
	const dueThisWeek = snapshot.assignedTasks.filter((task) => {
		if (!task.dueAt) {
			return false;
		}
		const due = new Date(task.dueAt).getTime();
		return due >= Date.now() && due <= weekEnd;
	}).length;

	return {
		activeProjects: snapshot.projects.filter(p => p.status === "active").length,
		openTasks,
		dueThisWeek,
	};
}

function projectsFromStore(workspaceId: string | null): DashboardActiveProject[] | null {
	if (!workspaceId) {
		return null;
	}
	const store = useProjectStore();
	const list = store.projectsForWorkspace(workspaceId).filter(
		p => !isProjectArchived(p.archivedAt) && p.status === "active",
	);
	if (list.length === 0) {
		return null;
	}
	return list.map(p => ({
		id: p.id,
		name: p.name,
		icon: p.icon,
		status: p.status,
		openTasks: p.openTasks,
		progress: p.progress,
	}));
}

function mergeSnapshot(
	workspaceId: string | null,
	base: DashboardSnapshot,
): DashboardSnapshot {
	const storeProjects = projectsFromStore(workspaceId);
	if (!storeProjects) {
		return base;
	}
	return { ...base, projects: storeProjects };
}

export function useDashboard() {
	const { activeWorkspaceId } = useWorkspace();
	const loading = ref(true);
	const snapshot = ref<DashboardSnapshot>(getDashboardSnapshot(null));

	let loadToken = 0;

	async function refresh(workspaceId: string | null) {
		const token = ++loadToken;
		loading.value = true;
		await delay();
		if (token !== loadToken) {
			return;
		}
		const base = getDashboardSnapshot(workspaceId);
		snapshot.value = mergeSnapshot(workspaceId, base);
		loading.value = false;
	}

	watch(
		activeWorkspaceId,
		id => {
			void refresh(id);
		},
		{ immediate: true },
	);

	const projectStore = useProjectStore();
	watch(
		() => projectStore.projects,
		() => {
			if (!projectStore.hydrated) {
				return;
			}
			void refresh(activeWorkspaceId.value);
		},
		{ deep: true },
	);

	const summary = computed(() => buildSummary(snapshot.value));

	return {
		loading,
		snapshot,
		summary,
		projects: computed(() => snapshot.value.projects),
		taskProgress: computed(() => snapshot.value.taskProgress),
		activities: computed(() => snapshot.value.activities),
		sprint: computed(() => snapshot.value.sprint),
		assignedTasks: computed(() => snapshot.value.assignedTasks),
		teamWorkload: computed(() => snapshot.value.teamWorkload),
		refresh: () => refresh(activeWorkspaceId.value),
	};
}
