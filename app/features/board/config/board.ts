import { TASK_STATUS_OPTIONS } from "~/features/task/config/task";
import type { BoardColumn } from "~/features/board/types/board";

/** Default WIP limit for the in-progress column (demo). */
export const BOARD_DEFAULT_WIP_IN_PROGRESS = 3;

export function createDefaultBoardColumns(): BoardColumn[] {
	return TASK_STATUS_OPTIONS.map((opt, index) => ({
		id: opt.value,
		title: opt.label,
		status: opt.value,
		wipLimit: opt.value === "in_progress" ? BOARD_DEFAULT_WIP_IN_PROGRESS : null,
		order: index,
	}));
}
