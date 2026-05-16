<template>
	<LayoutAppPlaceholderPage
		title="Projects"
		description="Kanban boards and workspace folders — arriving in S5"
		icon="i-lucide-folder-kanban"
	>
		You’ll create projects, switch list and board views, and invite teammates
		from here soon.
	</LayoutAppPlaceholderPage>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Projects",
	appDescription: "All projects in your workspace",
});

useSeoMeta({
	title: `Projects — ${APP_NAME}`,
});
</script>
