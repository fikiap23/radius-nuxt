<template>
	<div class="space-y-6">
		<div class="space-y-2">
			<p class="text-label font-semibold uppercase text-primary">
				Workspace
			</p>
			<h1 class="font-display text-3xl font-extrabold tracking-tight text-highlighted">
				Welcome{{ user ? `, ${user.name}` : "" }}
			</h1>
			<p class="max-w-xl text-muted leading-relaxed">
				You're signed in to {{ APP_NAME }}. The full dashboard with widgets
				and project overview arrives in slice S4 — for now this is your app
				home after authentication.
			</p>
		</div>

		<UiAppCard
			title="What's next"
			description="Phase 1 continues with app shell navigation and workspaces."
		>
			<ul class="space-y-2 text-sm text-muted">
				<li class="flex items-start gap-2">
					<UIcon
						name="i-lucide-check"
						class="mt-0.5 size-4 shrink-0 text-primary"
					/>
					Authentication mock session is active (cookie-based).
				</li>
				<li class="flex items-start gap-2">
					<UIcon
						name="i-lucide-layout-dashboard"
						class="mt-0.5 size-4 shrink-0 text-primary"
					/>
					S2 adds sidebar navigation and settings placeholder.
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
});

useSeoMeta({
	title: `Dashboard — ${APP_NAME}`,
});

const { user } = useAuth();
</script>
