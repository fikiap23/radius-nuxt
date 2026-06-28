import { useBoardApi } from "~/features/board/composables/useBoardApi";
import type {
	BoardColumn,
	CreateBoardColumnPayload,
	UpdateBoardColumnPayload,
} from "~/features/board/types/board";
import { sortBoardColumns, normalizeColumnTitle } from "~/features/board/utils/board";

export const useBoardStore = defineStore("board", () => {
	const boardApi = useBoardApi();

	const columnsByProject = ref<Record<string, BoardColumn[]>>({});
	const loadedProjectIds = ref<Set<string>>(new Set());
	const loadingProjectIds = ref<Set<string>>(new Set());

	function setColumns(projectId: string, columns: BoardColumn[]) {
		columnsByProject.value = {
			...columnsByProject.value,
			[projectId]: sortBoardColumns(columns),
		};
	}

	function columnsForProject(projectId: string) {
		return sortBoardColumns(columnsByProject.value[projectId] ?? []);
	}

	function isProjectLoaded(projectId: string) {
		return loadedProjectIds.value.has(projectId);
	}

	function isProjectLoading(projectId: string) {
		return loadingProjectIds.value.has(projectId);
	}

	async function loadColumnsForProject(projectId: string) {
		if (!projectId || loadedProjectIds.value.has(projectId)) {
			return;
		}
		if (loadingProjectIds.value.has(projectId)) {
			return;
		}

		loadingProjectIds.value = new Set([...loadingProjectIds.value, projectId]);

		const result = await boardApi.getColumns(projectId);

		loadingProjectIds.value = new Set(
			[...loadingProjectIds.value].filter(id => id !== projectId),
		);

		if (result.ok) {
			setColumns(projectId, result.data);
		}

		loadedProjectIds.value = new Set([...loadedProjectIds.value, projectId]);
	}

	async function addColumn(projectId: string, payload: CreateBoardColumnPayload) {
		const title = normalizeColumnTitle(payload.title);
		if (!title) {
			return { ok: false as const, error: "Column title is required." };
		}

		const result = await boardApi.createColumn(projectId, {
			...payload,
			title,
		});

		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to create column." };
		}

		const column = result.data;
		const columns = columnsForProject(projectId);
		setColumns(projectId, [...columns, column]);

		return { ok: true as const, column };
	}

	async function updateColumn(
		projectId: string,
		columnId: string,
		payload: UpdateBoardColumnPayload,
	) {
		const body: UpdateBoardColumnPayload = {
			...payload,
			...(payload.title !== undefined ? { title: normalizeColumnTitle(payload.title) } : {}),
		};

		const result = await boardApi.updateColumn(projectId, columnId, body);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to update column." };
		}

		const updated = result.data;
		const columns = columnsForProject(projectId);
		const next = columns.map(c => (c.id === columnId ? updated : c));
		setColumns(projectId, next);

		return { ok: true as const, column: updated };
	}

	async function reorderColumns(projectId: string, columnIds: string[]) {
		const result = await boardApi.reorderColumns(projectId, { columnIds });
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to reorder columns." };
		}

		const columns = columnsForProject(projectId);
		const byId = new Map(columns.map(c => [c.id, c]));
		const reordered = columnIds
			.map((id, index) => {
				const column = byId.get(id);
				return column ? { ...column, order: index } : null;
			})
			.filter((c): c is BoardColumn => c !== null);

		if (reordered.length === columns.length) {
			setColumns(projectId, reordered);
		}
		else {
			await loadColumnsForProject(projectId);
		}

		return { ok: true as const };
	}

	async function removeColumn(projectId: string, columnId: string) {
		const columns = columnsForProject(projectId);
		if (columns.length <= 1) {
			return { ok: false as const, error: "Keep at least one column." };
		}

		const target = columns.find(c => c.id === columnId);
		if (!target) {
			return { ok: false as const, error: "Column not found." };
		}

		const result = await boardApi.deleteColumn(projectId, columnId);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to delete column." };
		}

		const { fallbackColumnId } = result.data;
		const fallback = columns.find(c => c.id === fallbackColumnId);
		if (fallback) {
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
		}

		setColumns(
			projectId,
			columns.filter(c => c.id !== columnId),
		);

		return { ok: true as const, fallbackColumnId };
	}

	return {
		columnsByProject,
		columnsForProject,
		isProjectLoaded,
		isProjectLoading,
		loadColumnsForProject,
		addColumn,
		updateColumn,
		reorderColumns,
		removeColumn,
	};
});
