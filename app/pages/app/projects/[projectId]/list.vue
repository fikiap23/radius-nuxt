<template>
	<div class="space-y-4">
		<TaskListToolbar
			:filters="listFilters"
			:assignee-items="assigneeFilterItems"
			:label-options="filterLabelOptions"
			@update:filters="listFilters = $event"
			@create="onCreate"
		/>

		<div
			v-if="!hydrated"
			class="space-y-2"
		>
			<USkeleton
				v-for="n in 5"
				:key="n"
				class="h-14 w-full"
			/>
		</div>

		<UiEmptyState
			v-else-if="projectTasks.length === 0"
			icon="i-lucide-list-todo"
			title="No tasks yet"
			description="Create your first task for this project."
		>
			<template #actions>
				<UButton
					label="New task"
					icon="i-lucide-plus"
					@click="onCreate"
				/>
			</template>
		</UiEmptyState>

		<UiEmptyState
			v-else-if="filteredTasks.length === 0"
			icon="i-lucide-filter-x"
			title="No matching tasks"
			description="Try adjusting filters or search."
		>
			<template #actions>
				<UButton
					label="Clear filters"
					variant="outline"
					@click="resetListFilters"
				/>
			</template>
		</UiEmptyState>

		<div
			v-else
			class="task-list divide-y divide-muted/60 rounded-xl border border-muted"
		>
			<TaskListRow
				v-for="task in filteredTasks"
				:key="task.id"
				:task="task"
				:assignee-name="memberName(task.assigneeId)"
				@open="onOpenTask"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";

const route = useRoute();
const projectId = route.params.projectId as string;

const { project } = useProjectContext(projectId);
const { activeWorkspaceId } = useWorkspace();
const { hydrated } = useTask();
const {
	listFilters,
	projectTasks,
	filteredTasks,
	filterLabelOptions,
	assigneeFilterItems,
	resetListFilters,
	activeMembers,
} = useTaskList(projectId);

const { openTask, openCreate } = useTaskDrawer();

definePageMeta({
	appTitle: "List",
});

useSeoMeta({
	title: () =>
		project.value
			? `${project.value.name} — List — ${APP_NAME}`
			: `List — ${APP_NAME}`,
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

function memberName(assigneeId: string | null) {
	if (!assigneeId) {
		return null;
	}
	return activeMembers.value.find(m => m.id === assigneeId)?.name ?? null;
}
</script>
