<template>
	<LayoutAppPlaceholderPage
		title="My tasks"
		description="Tasks assigned to you — slice S15"
	>
		Your personal task inbox will appear here, including items from every
		project you can access.
	</LayoutAppPlaceholderPage>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "My Tasks",
	appDescription: "Tasks assigned to you",
});

useSeoMeta({
	title: `My Tasks — ${APP_NAME}`,
});
</script>
