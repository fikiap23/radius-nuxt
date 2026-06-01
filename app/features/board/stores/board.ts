import { createDefaultBoardColumns } from "~/features/board/config/board";
import type {
	BoardColumn,
	BoardPersistedState,
	CreateBoardColumnPayload,
	UpdateBoardColumnPayload,
} from "~/features/board/types/board";
import { createBoardColumnId, sortBoardColumns } from "~/features/board/utils/board";

const PERSIST_KEY = "radius-board-state";

function readPersistedState(): BoardPersistedState | null {
	if (!import.meta.client) {
		return null;
	}
	try {
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) {
			return null;
		}
		return JSON.parse(raw) as BoardPersistedState;
	}
	catch {
		return null;
	}
}

function writePersistedState(state: BoardPersistedState) {
	if (!import.meta.client) {
		return;
	}
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

export const useBoardStore = defineStore("board", () => {
	const columnsByProject = ref<Record<string, BoardColumn[]>>({});
	const hydrated = ref(false);

	function persist() {
		writePersistedState({ columnsByProject: columnsByProject.value });
	}

	function hydrateFromStorage() {
		const persisted = readPersistedState();
		if (persisted?.columnsByProject) {
			columnsByProject.value = persisted.columnsByProject;
		}
		hydrated.value = true;
	}

	function columnsForProject(projectId: string) {
		const existing = columnsByProject.value[projectId];
		if (existing?.length) {
			return sortBoardColumns(existing);
		}
		const defaults = createDefaultBoardColumns();
		columnsByProject.value = {
			...columnsByProject.value,
			[projectId]: defaults,
		};
		return defaults;
	}

	function setColumns(projectId: string, columns: BoardColumn[]) {
		columnsByProject.value = {
			...columnsByProject.value,
			[projectId]: sortBoardColumns(columns),
		};
		persist();
	}

	function addColumn(projectId: string, payload: CreateBoardColumnPayload) {
		const title = payload.title.trim();
		if (!title) {
			return { ok: false as const, error: "Column title is required." };
		}

		const columns = columnsForProject(projectId);
		const maxOrder = columns.reduce((max, c) => Math.max(max, c.order), -1);
		const column: BoardColumn = {
			id: createBoardColumnId(),
			title,
			status: payload.status,
			wipLimit: payload.wipLimit ?? null,
			order: maxOrder + 1,
		};

		setColumns(projectId, [...columns, column]);
		return { ok: true as const, column };
	}

	function updateColumn(
		projectId: string,
		columnId: string,
		payload: UpdateBoardColumnPayload,
	) {
		const columns = columnsForProject(projectId);
		const index = columns.findIndex(c => c.id === columnId);
		if (index === -1) {
			return { ok: false as const, error: "Column not found." };
		}

		const current = columns[index]!;
		const updated: BoardColumn = {
			...current,
			...payload,
			title: payload.title?.trim() ?? current.title,
		};

		const next = columns.map(c => (c.id === columnId ? updated : c));
		setColumns(projectId, next);
		return { ok: true as const, column: updated };
	}

	function removeColumn(projectId: string, columnId: string) {
		const columns = columnsForProject(projectId);
		if (columns.length <= 1) {
			return { ok: false as const, error: "Keep at least one column." };
		}

		const target = columns.find(c => c.id === columnId);
		if (!target) {
			return { ok: false as const, error: "Column not found." };
		}

		const fallback = sortBoardColumns(columns).find(c => c.id !== columnId);
		if (!fallback) {
			return { ok: false as const, error: "Column not found." };
		}

		const taskStore = useTaskStore();
		for (const task of taskStore.tasksForProject(projectId)) {
			const columnIdForTask =
				task.columnId && columns.some(c => c.id === task.columnId)
					? task.columnId
					: task.status;

			if (columnIdForTask === columnId) {
				void taskStore.updateTask(task.id, {
					status: fallback.status,
					columnId: fallback.id,
				});
			}
		}

		setColumns(
			projectId,
			columns.filter(c => c.id !== columnId),
		);
		return { ok: true as const, fallbackColumnId: fallback.id };
	}

	return {
		columnsByProject,
		hydrated,
		hydrateFromStorage,
		columnsForProject,
		addColumn,
		updateColumn,
		removeColumn,
	};
});
