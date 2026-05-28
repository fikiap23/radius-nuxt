import type { BoardColumn, BoardFilters } from "~/types/board";
import type { Task } from "~/types/task";
import { isBoardWipExceeded, resolveTaskColumnId } from "~/utils/board";
import { richTextToPlain } from "~/utils/rich-text";

const defaultBoardFilters = (): BoardFilters => ({
	assigneeId: "all",
	labelId: "all",
	query: "",
});

function applyBoardFilters(tasks: Task[], filters: BoardFilters) {
	let list = tasks;
	const { assigneeId, labelId, query } = filters;

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

	return list;
}

export function useBoard(projectId: MaybeRefOrGetter<string>) {
	const id = computed(() => toValue(projectId));
	const boardStore = useBoardStore();
	const { hydrated: boardHydrated } = storeToRefs(boardStore);
	const { tasksForProject, updateTask, createTask, hydrated: taskHydrated } =
		useTask();
	const { labelPresets } = useTask();
	const { activeMembers } = useWorkspace();
	const { activeWorkspaceId } = useWorkspace();

	const boardFilters = useState<BoardFilters>(
		`task-board-filters-${id.value}`,
		defaultBoardFilters,
	);

	const columns = computed(() => boardStore.columnsForProject(id.value));

	const projectTasks = computed(() => tasksForProject(id.value));

	const filteredTasks = computed(() =>
		applyBoardFilters(projectTasks.value, boardFilters.value),
	);

	const tasksByColumn = computed(() => {
		const map: Record<string, Task[]> = {};
		for (const column of columns.value) {
			map[column.id] = [];
		}
		for (const task of filteredTasks.value) {
			const columnId = resolveTaskColumnId(task, columns.value);
			if (!map[columnId]) {
				map[columnId] = [];
			}
			map[columnId].push(task);
		}
		for (const columnId of Object.keys(map)) {
			map[columnId]!.sort((a, b) => a.title.localeCompare(b.title));
		}
		return map;
	});

	const columnCounts = computed(() => {
		const counts: Record<string, number> = {};
		for (const column of columns.value) {
			counts[column.id] = tasksByColumn.value[column.id]?.length ?? 0;
		}
		return counts;
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
		for (const member of activeMembers.value) {
			if (member.status !== "active" || seen.has(member.id)) {
				continue;
			}
			seen.add(member.id);
			items.push({ label: member.name, value: member.id });
		}
		return items;
	});

	const hydrated = computed(
		() => boardHydrated.value && taskHydrated.value,
	);

	function resetBoardFilters() {
		boardFilters.value = defaultBoardFilters();
	}

	function columnForId(columnId: string): BoardColumn | undefined {
		return columns.value.find(c => c.id === columnId);
	}

	function isWipExceeded(column: BoardColumn) {
		const count = columnCounts.value[column.id] ?? 0;
		return isBoardWipExceeded(count, column.wipLimit);
	}

	async function moveTaskToColumn(taskId: string, columnId: string) {
		const column = columnForId(columnId);
		if (!column) {
			return { ok: false as const, error: "Column not found." };
		}
		return updateTask(taskId, {
			status: column.status,
			columnId: column.id,
		});
	}

	async function quickCreateTask(columnId: string, title: string) {
		const column = columnForId(columnId);
		const workspaceId = activeWorkspaceId.value;
		const trimmed = title.trim();

		if (!trimmed) {
			return { ok: false as const, error: "Task title is required." };
		}
		if (!column) {
			return { ok: false as const, error: "Column not found." };
		}
		if (!workspaceId) {
			return { ok: false as const, error: "Workspace context is missing." };
		}

		return createTask(id.value, workspaceId, {
			title: trimmed,
			status: column.status,
			columnId: column.id,
		});
	}

	return {
		boardFilters,
		columns,
		projectTasks,
		filteredTasks,
		tasksByColumn,
		columnCounts,
		filterLabelOptions,
		assigneeFilterItems,
		hydrated,
		resetBoardFilters,
		moveTaskToColumn,
		quickCreateTask,
		isWipExceeded,
		addColumn: boardStore.addColumn,
		updateColumn: boardStore.updateColumn,
		removeColumn: boardStore.removeColumn,
	};
}
