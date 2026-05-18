<template>
	<UiAppCard
		title="List view"
		description="Task list with filters arrives in S6"
		icon="i-lucide-list"
	>
		<UiEmptyState
			icon="i-lucide-list-todo"
			title="List view coming soon"
			description="Create and manage tasks in a filterable list in the next slice."
		/>
	</UiAppCard>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

const route = useRoute();
const projectId = route.params.projectId as string;
const { project } = useProjectContext(projectId);

definePageMeta({
	appTitle: "List",
});

useSeoMeta({
	title: () =>
		project.value
			? `${project.value.name} — List — ${APP_NAME}`
			: `List — ${APP_NAME}`,
});
</script>
