<template>
	<div class="app-page space-y-6">
		<UiAppPageIntro
			title="Workspaces"
			description="Switch context between teams and organizations"
		>
			<UButton
				label="New workspace"
				icon="i-lucide-plus"
				size="sm"
				@click="openCreateModal"
			/>
		</UiAppPageIntro>

		<UiEmptyState
			v-if="accessibleWorkspaces.length === 0"
			icon="i-lucide-building-2"
			title="No workspaces yet"
			description="Create your first workspace to organize projects and members."
		>
			<template #actions>
				<UButton
					label="Create workspace"
					icon="i-lucide-plus"
					@click="openCreateModal"
				/>
			</template>
		</UiEmptyState>

		<div
			v-else
			class="grid gap-4 sm:grid-cols-2"
		>
			<button
				v-for="ws in accessibleWorkspaces"
				:key="ws.id"
				type="button"
				class="app-card app-card--surface app-card--interactive p-5 text-start transition-colors"
				@click="openWorkspace(ws.id)"
			>
				<div class="flex items-start gap-3">
					<WorkspaceAvatar
						:name="ws.name"
						:slug="ws.slug"
						size="md"
					/>
					<div class="min-w-0 flex-1 space-y-1">
						<div class="flex flex-wrap items-center gap-2">
							<h2 class="truncate font-display text-lg font-bold text-highlighted">
								{{ ws.name }}
							</h2>
							<UBadge
								v-if="ws.id === activeWorkspace?.id"
								color="primary"
								variant="subtle"
								size="xs"
							>
								Active
							</UBadge>
						</div>
						<p class="text-sm text-muted">
							/{{ ws.slug }}
						</p>
					</div>
				</div>

				<div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
					<span class="text-toned">
						{{ memberCount(ws.id) }} members
					</span>
					<WorkspaceRoleBadge
						v-if="getMyRoleInWorkspace(ws.id)"
						:role="getMyRoleInWorkspace(ws.id)!"
					/>
				</div>

				<div class="mt-4 flex gap-2">
					<UButton
						label="Open"
						size="xs"
						variant="soft"
						@click.stop="openWorkspace(ws.id)"
					/>
					<UButton
						label="Settings"
						size="xs"
						color="neutral"
						variant="ghost"
						:to="`/app/workspaces/${ws.id}/settings`"
						@click.stop
					/>
				</div>
			</button>
		</div>

	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Workspaces",
	appDescription: "Manage your teams and organizations",
});

useSeoMeta({
	title: `Workspaces — ${APP_NAME}`,
});

const {
	accessibleWorkspaces,
	activeWorkspace,
	setActiveWorkspace,
	memberCount,
	getMyRoleInWorkspace,
} = useWorkspace();

const { openCreateModal } = useWorkspaceCreateModal();

async function openWorkspace(id: string) {
	await setActiveWorkspace(id);
	await navigateTo("/app");
}

</script>
