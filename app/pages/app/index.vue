<template>
	<div class="app-page space-y-8">
		<section class="app-welcome">
			<div class="app-welcome__glow" aria-hidden="true" />
			<div class="app-welcome__inner">
				<div class="min-w-0 flex-1 space-y-2">
					<p class="app-welcome__eyebrow">
						{{ greeting }}{{ firstName ? `, ${firstName}` : "" }}
					</p>
					<h1 class="app-welcome__title">
						Your workspace is ready
					</h1>
					<p class="app-welcome__lead max-w-xl text-sm leading-relaxed text-toned sm:text-base">
						Pick up where you left off — projects and tasks stay in sync as we
						ship the next slices.
					</p>
				</div>
				<UButton
					to="/app/projects"
					label="New project"
					icon="i-lucide-plus"
					size="sm"
					class="shrink-0"
				/>
			</div>
		</section>

		<div class="grid gap-3 sm:grid-cols-3">
			<UiAppStatPill
				label="Active projects"
				:value="3"
				icon="i-lucide-folder-kanban"
				tone="primary"
			/>
			<UiAppStatPill
				label="Open tasks"
				:value="12"
				icon="i-lucide-circle-check"
			/>
			<UiAppStatPill
				label="Due this week"
				:value="2"
				icon="i-lucide-calendar-clock"
				tone="warning"
			/>
		</div>

		<section class="space-y-3">
			<h2 class="app-section-label">
				Shortcuts
			</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				<UiAppQuickLink
					to="/app/projects"
					title="Projects"
					description="Boards, lists, and workspace folders"
					icon="i-lucide-folder-kanban"
					tone="primary"
				/>
				<UiAppQuickLink
					to="/app/my-tasks"
					title="My tasks"
					description="Everything assigned to you"
					icon="i-lucide-list-checks"
				/>
				<UiAppQuickLink
					to="/app/settings"
					title="Settings"
					description="Layout, theme, and profile"
					icon="i-lucide-sliders-horizontal"
				/>
			</div>
		</section>

		<UiAppCard
			variant="muted"
			icon="i-lucide-sparkles"
			title="What’s next"
			description="Preview of upcoming slices"
		>
			<ul class="space-y-2.5 text-sm text-toned">
				<li class="flex gap-2">
					<UIcon
						name="i-lucide-check"
						class="mt-0.5 size-4 shrink-0 text-primary"
					/>
					<span><strong class="font-medium text-highlighted">S4</strong> — dashboard widgets & activity feed</span>
				</li>
				<li class="flex gap-2">
					<UIcon
						name="i-lucide-check"
						class="mt-0.5 size-4 shrink-0 text-primary"
					/>
					<span><strong class="font-medium text-highlighted">S5</strong> — project list & kanban boards</span>
				</li>
				<li class="flex gap-2">
					<UIcon
						name="i-lucide-circle"
						class="mt-0.5 size-4 shrink-0 text-muted"
					/>
					<span><strong class="font-medium text-highlighted">S15</strong> — personal task inbox</span>
				</li>
			</ul>
		</UiAppCard>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Dashboard",
});

useSeoMeta({
	title: `Dashboard — ${APP_NAME}`,
});

const { user } = useAuth();
const { greeting } = useGreeting();

const firstName = computed(() => {
	const name = user.value?.name?.trim();
	if (!name) {
		return null;
	}
	return name.split(/\s+/)[0];
});
</script>
