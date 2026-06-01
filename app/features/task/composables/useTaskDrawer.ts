export interface TaskDrawerContext {
	projectId: string;
	workspaceId: string;
}

export function useTaskDrawer() {
	const open = useState("task-drawer-open", () => false);
	const activeTaskId = useState<string | null>("task-drawer-task-id", () => null);
	const isCreateMode = useState("task-drawer-create", () => false);
	const projectId = useState<string | null>("task-drawer-project-id", () => null);
	const workspaceId = useState<string | null>("task-drawer-workspace-id", () => null);

	const isReady = computed(
		() => Boolean(projectId.value && workspaceId.value),
	);

	function resetContext() {
		activeTaskId.value = null;
		isCreateMode.value = false;
		projectId.value = null;
		workspaceId.value = null;
	}

	async function openTask(taskId: string, ctx: TaskDrawerContext) {
		projectId.value = ctx.projectId;
		workspaceId.value = ctx.workspaceId;
		activeTaskId.value = taskId;
		isCreateMode.value = false;
		await nextTick();
		open.value = true;
	}

	async function openCreate(ctx: TaskDrawerContext) {
		projectId.value = ctx.projectId;
		workspaceId.value = ctx.workspaceId;
		activeTaskId.value = null;
		isCreateMode.value = true;
		await nextTick();
		open.value = true;
	}

	function closeDrawer() {
		open.value = false;
	}

	watch(open, isOpen => {
		if (!isOpen) {
			// Clear context after close animation so portal teardown stays stable
			setTimeout(() => {
				if (!open.value) {
					resetContext();
				}
			}, 250);
		}
	});

	return {
		open,
		activeTaskId,
		isCreateMode,
		projectId,
		workspaceId,
		isReady,
		openTask,
		openCreate,
		closeDrawer,
	};
}
