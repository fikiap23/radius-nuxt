<template>
	<div class="app-page space-y-6">
		<UiAppPageIntro
			title="Settings"
			description="Profile, layout, and how Radius looks on your device"
		/>

		<UiAppCard
			icon="i-lucide-user-round"
			title="Profile"
			description="Account settings placeholder"
		>
			<dl class="grid gap-4 sm:grid-cols-2 text-sm">
				<div>
					<dt class="text-muted">
						Name
					</dt>
					<dd class="font-medium text-highlighted">
						{{ user?.name ?? "—" }}
					</dd>
				</div>
				<div>
					<dt class="text-muted">
						Email
					</dt>
					<dd class="font-medium text-highlighted">
						{{ user?.email ?? "—" }}
					</dd>
				</div>
			</dl>
		</UiAppCard>

		<UiAppCard
			icon="i-lucide-layout-template"
			title="Layout"
			description="Sidebar, header, and content area arrangement"
		>
			<LayoutAppLayoutPicker />
		</UiAppCard>

		<UiAppCard
			icon="i-lucide-palette"
			title="Appearance"
			description="Color mode, brand preset, and typography"
		>
			<LayoutThemeToggle />
		</UiAppCard>

		<UiAppCard
			title="Workspace"
			description="Members, roles, and organization settings"
			icon="i-lucide-building-2"
		>
			<p class="text-sm text-muted">
				Manage the active workspace, invite teammates, and configure roles.
			</p>
			<UButton
				v-if="activeWorkspace"
				:to="`/app/workspaces/${activeWorkspace.id}/settings`"
				label="Manage workspace"
				icon="i-lucide-arrow-right"
				trailing
				variant="soft"
				size="sm"
				class="mt-4"
			/>
			<UButton
				v-else
				to="/app/workspaces"
				label="View workspaces"
				icon="i-lucide-building-2"
				variant="soft"
				size="sm"
				class="mt-4"
			/>
		</UiAppCard>

		<UiAppCard
			title="Preferences"
			description="More settings coming soon"
		>
			<p class="text-sm text-muted">
				Notification settings are on the roadmap.
			</p>
		</UiAppCard>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Settings",
	appDescription: "Profile and account preferences",
});

useSeoMeta({
	title: `Settings — ${APP_NAME}`,
});

const { user } = useAuth();
const { activeWorkspace } = useWorkspace();
</script>
