import type { BoardColumn } from "~/features/board/types/board";
import type { Task } from "~/features/task/types/task";

export function sortBoardColumns(columns: BoardColumn[]) {
	return [...columns].sort((a, b) => a.order - b.order);
}

export function resolveTaskColumnId(task: Task, columns: BoardColumn[]): string {
	if (task.columnId && columns.some(c => c.id === task.columnId)) {
		return task.columnId;
	}

	const match = sortBoardColumns(columns).find(c => c.status === task.status);
	return match?.id ?? task.status;
}

export function isBoardWipExceeded(count: number, wipLimit: number | null) {
	return wipLimit !== null && count > wipLimit;
}

export function normalizeColumnTitle(value: unknown) {
	return String(value ?? "").trim();
}

export function parseOptionalWipLimit(value: unknown): number | null {
	const parsed = String(value ?? "").trim();
	if (!parsed) {
		return null;
	}
	const num = Number(parsed);
	return Number.isFinite(num) && num > 0 ? num : null;
}

export function createBoardColumnId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return `col-${crypto.randomUUID()}`;
	}
	return `col-${Date.now()}`;
}
