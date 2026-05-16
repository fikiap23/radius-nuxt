<template>
	<div class="space-y-6">
		<UiAppCard
			title="Overview"
			description="Workspace summary widgets arrive in slice S4."
		>
			<p class="text-sm text-muted leading-relaxed">
				Welcome{{ user ? `, ${user.name}` : "" }}. Use the sidebar to explore
				projects, your tasks, and settings. Navigation is client-side — no full
				page reload between sections.
			</p>
		</UiAppCard>

		<div class="grid gap-4 sm:grid-cols-2">
			<UiAppCard
				title="Projects"
				description="Coming in S5"
			>
				<UButton
					to="/app/projects"
					label="View projects"
					color="neutral"
					variant="soft"
					size="sm"
				/>
			</UiAppCard>
			<UiAppCard
				title="My tasks"
				description="Coming in S15"
			>
				<UButton
					to="/app/my-tasks"
					label="View my tasks"
					color="neutral"
					variant="soft"
					size="sm"
				/>
			</UiAppCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Dashboard",
	appDescription: "Workspace overview and quick links",
});

useSeoMeta({
	title: `Dashboard — ${APP_NAME}`,
});

const { user } = useAuth();
</script>
