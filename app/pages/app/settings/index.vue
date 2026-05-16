<template>
	<div class="space-y-6">
		<UiAppCard
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
			title="Appearance"
			description="Color mode, brand preset, and typography"
		>
			<LayoutThemeToggle />
		</UiAppCard>

		<UiAppCard
			title="Preferences"
			description="More settings in later slices"
		>
			<p class="text-sm text-muted">
				Workspace and notification settings arrive with S3 and S9.
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
</script>
