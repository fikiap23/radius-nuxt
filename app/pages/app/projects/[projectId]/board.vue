<template>
	<UiAppCard
		title="Board view"
		description="Kanban columns and drag-and-drop — coming soon"
		icon="i-lucide-kanban"
	>
		<UiEmptyState
			icon="i-lucide-kanban-square"
			title="Board coming soon"
			description="You'll move tasks across columns with drag and drop soon."
		/>
	</UiAppCard>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

const route = useRoute();
const projectId = route.params.projectId as string;
const { project } = useProjectContext(projectId);

definePageMeta({
	appTitle: "Board",
});

useSeoMeta({
	title: () =>
		project.value
			? `${project.value.name} — Board — ${APP_NAME}`
			: `Board — ${APP_NAME}`,
});
</script>
