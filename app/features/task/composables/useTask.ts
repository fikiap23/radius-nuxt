import { TASK_LABEL_PRESETS } from "~/features/task/config/task";
import type { TaskListFilters } from "~/features/task/types/task";
import { richTextToPlain } from "~/features/task/utils/rich-text";
import { assignableMembers } from "~/features/workspace/utils/workspace";

const defaultFilters = (): TaskListFilters => ({
	status: "all",
	assigneeId: "all",
	labelId: "all",
	query: "",
});

export function useTask() {
	const store = useTaskStore();
	const { tasks, activities, comments, commentsHydrated } = storeToRefs(store);

	return {
		tasks,
		activities,
		comments,
		commentsHydrated,
		labelPresets: TASK_LABEL_PRESETS,
		isProjectLoaded: store.isProjectLoaded,
		isProjectLoading: store.isProjectLoading,
		loadTasksForProject: store.loadTasksForProject,
		loadActivitiesForTask: store.loadActivitiesForTask,
		getTaskById: store.getTaskById,
		tasksForProject: store.tasksForProject,
		activitiesForTask: store.activitiesForTask,
		commentsForTask: store.commentsForTask,
		createTask: store.createTask,
		updateTask: store.updateTask,
		deleteTask: store.deleteTask,
		createComment: store.createComment,
		updateComment: store.updateComment,
		deleteComment: store.deleteComment,
		addAttachment: store.addAttachment,
		removeAttachment: store.removeAttachment,
		patchListField: store.patchListField,
	};
}

export function useTaskList(projectId: MaybeRefOrGetter<string>) {
	const id = computed(() => toValue(projectId));
	const store = useTaskStore();
	const { tasksForProject, labelPresets } = useTask();
	const { activeMembers } = useWorkspace();

	watch(
		id,
		projectId => {
			if (projectId) {
				void store.loadTasksForProject(projectId);
			}
		},
		{ immediate: true },
	);

	const hydrated = computed(() => store.isProjectLoaded(id.value));

	const listFilters = useState<TaskListFilters>(
		`task-list-filters-${id.value}`,
		defaultFilters,
	);

	const projectTasks = computed(() => tasksForProject(id.value));

	const filteredTasks = computed(() => {
		let list = projectTasks.value;
		const { status, assigneeId, labelId, query } = listFilters.value;

		if (status !== "all") {
			list = list.filter(t => t.status === status);
		}

		if (assigneeId === "unassigned") {
			list = list.filter(t => !t.assigneeId);
		}
		else if (assigneeId !== "all") {
			list = list.filter(t => t.assigneeId === assigneeId);
		}

		if (labelId !== "all") {
			list = list.filter(t => t.labelIds.includes(labelId));
		}

		const q = query.trim().toLowerCase();
		if (q) {
			list = list.filter(
				t =>
					t.title.toLowerCase().includes(q)
					|| richTextToPlain(t.description).toLowerCase().includes(q),
			);
		}

		const statusOrder = [
			"backlog",
			"todo",
			"in_progress",
			"review",
			"done",
		] as const;

		return [...list].sort((a, b) => {
			const statusDiff =
				statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
			if (statusDiff !== 0) {
				return statusDiff;
			}
			return a.title.localeCompare(b.title);
		});
	});

	const usedLabelIds = computed(() => {
		const ids = new Set<string>();
		for (const task of projectTasks.value) {
			for (const labelId of task.labelIds) {
				ids.add(labelId);
			}
		}
		return [...ids];
	});

	const filterLabelOptions = computed(() =>
		labelPresets.filter(l => usedLabelIds.value.includes(l.id)),
	);

	const assigneeFilterItems = computed(() => {
		const items: { label: string; value: string }[] = [
			{ label: "All assignees", value: "all" },
			{ label: "Unassigned", value: "unassigned" },
		];
		const seen = new Set<string>();
		for (const member of assignableMembers(activeMembers.value)) {
			if (!member.userId || seen.has(member.userId)) {
				continue;
			}
			seen.add(member.userId);
			items.push({ label: member.name, value: member.userId });
		}
		return items;
	});

	function resetListFilters() {
		listFilters.value = defaultFilters();
	}

	return {
		listFilters,
		hydrated,
		projectTasks,
		filteredTasks,
		filterLabelOptions,
		assigneeFilterItems,
		resetListFilters,
		activeMembers,
	};
}
