<template>
	<LayoutAppPlaceholderPage
		title="Projects"
		description="Project list and filters — slice S5"
	>
		Create and browse workspaces projects here. Kanban boards and list views
		will connect to this route in upcoming slices.
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
