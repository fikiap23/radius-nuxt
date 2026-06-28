<template>
	<div class="space-y-4">
		<BoardToolbar
			:filters="boardFilters"
			:assignee-items="assigneeFilterItems"
			:label-options="filterLabelOptions"
			@update:filters="boardFilters = $event"
			@add-column="addColumnOpen = true"
			@create="onCreate"
		/>

		<div
			v-if="!hydrated"
			class="kanban-board kanban-board--loading"
		>
			<div
				v-for="n in 4"
				:key="n"
				class="kanban-column kanban-column--skeleton"
			>
				<USkeleton class="h-6 w-24" />
				<USkeleton
					v-for="m in 3"
					:key="m"
					class="h-20 w-full"
				/>
			</div>
		</div>

		<UiEmptyState
			v-else-if="filteredTasks.length === 0 && projectTasks.length > 0"
			icon="i-lucide-filter-x"
			title="No matching cards"
			description="Try adjusting filters or search."
		>
			<template #actions>
				<UButton
					label="Clear filters"
					variant="outline"
					@click="resetBoardFilters"
				/>
			</template>
		</UiEmptyState>

		<ClientOnly v-else-if="columns.length > 0">
			<BoardKanban
				:project-id="projectId"
				:columns="columns"
				:tasks-by-column="tasksByColumn"
				:column-counts="columnCounts"
				:assignee-name-for="assigneeNameFor"
				@open="onOpenTask"
				@settings="onColumnSettings"
			/>
		</ClientOnly>

		<UiEmptyState
			v-else
			icon="i-lucide-kanban-square"
			title="No columns yet"
			description="Add a column to start organizing tasks on the board."
		>
			<template #actions>
				<UButton
					label="Add column"
					icon="i-lucide-plus"
					@click="addColumnOpen = true"
				/>
			</template>
		</UiEmptyState>

		<BoardAddColumnModal
			v-model:open="addColumnOpen"
			:project-id="projectId"
		/>

		<BoardColumnSettingsModal
			v-model:open="columnSettingsOpen"
			:project-id="projectId"
			:column="settingsColumn"
			:column-count="columns.length"
		/>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";
import type { BoardColumn } from "~/features/board/types/board";

const route = useRoute();
const projectId = route.params.projectId as string;

const { project } = useProjectContext(projectId);
const { activeWorkspaceId } = useWorkspace();
const {
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
} = useBoard(projectId);

const { openTask, openCreate } = useTaskDrawer();
const { activeMembers } = useWorkspace();

const addColumnOpen = ref(false);
const columnSettingsOpen = ref(false);
const settingsColumnId = ref<string | null>(null);

const settingsColumn = computed<BoardColumn | null>(() => {
	if (!settingsColumnId.value) {
		return null;
	}
	return columns.value.find(c => c.id === settingsColumnId.value) ?? null;
});

definePageMeta({
	appTitle: "Board",
});

useSeoMeta({
	title: () =>
		project.value
			? `${project.value.name} — Board — ${APP_NAME}`
			: `Board — ${APP_NAME}`,
});

function drawerContext() {
	const workspaceId = activeWorkspaceId.value;
	if (!workspaceId) {
		return null;
	}
	return { projectId, workspaceId };
}

async function onCreate() {
	const ctx = drawerContext();
	if (ctx) {
		await openCreate(ctx);
	}
}

async function onOpenTask(taskId: string) {
	const ctx = drawerContext();
	if (ctx) {
		await openTask(taskId, ctx);
	}
}

function onColumnSettings(columnId: string) {
	settingsColumnId.value = columnId;
	columnSettingsOpen.value = true;
}

function assigneeNameFor(assigneeId: string | null) {
	if (!assigneeId) {
		return null;
	}
	return activeMembers.value.find(m => m.id === assigneeId)?.name ?? null;
}
</script>
