<template>
	<LayoutAppPlaceholderPage
		title="My tasks"
		description="Your personal inbox across every project — slice S15"
		icon="i-lucide-list-checks"
	>
		Tasks assigned to you will show up here with due dates, project context,
		and quick filters.
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
