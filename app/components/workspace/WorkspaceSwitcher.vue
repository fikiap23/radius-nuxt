<template>
	<UDropdownMenu
		:items="menuItems"
		:content="{ align: 'start' }"
		:modal="false"
	>
		<UButton
			color="neutral"
			variant="ghost"
			size="sm"
			class="max-w-[11rem] gap-2 rounded-lg px-2 ring-1 ring-muted/80 hover:ring-primary/30 sm:max-w-xs"
			:aria-label="activeWorkspace ? `Workspace: ${activeWorkspace.name}` : 'Select workspace'"
		>
			<WorkspaceAvatar
				v-if="activeWorkspace"
				:name="activeWorkspace.name"
				:slug="activeWorkspace.slug"
				size="xs"
			/>
			<span class="truncate text-sm font-medium text-default">
				{{ activeWorkspace?.name ?? "Workspace" }}
			</span>
			<UIcon
				name="i-lucide-chevrons-up-down"
				class="size-4 shrink-0 text-muted"
			/>
		</UButton>
	</UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const {
	accessibleWorkspaces,
	activeWorkspace,
	setActiveWorkspace,
} = useWorkspace();

const { openCreateModal } = useWorkspaceCreateModal();
const toast = useToast();

async function switchTo(id: string) {
	if (id === activeWorkspace.value?.id) {
		return;
	}

	const result = await setActiveWorkspace(id);
	if (!result.ok) {
		toast.add({
			title: "Could not switch workspace",
			description: result.error,
			color: "error",
			icon: "i-lucide-circle-alert",
		});
		return;
	}

	toast.add({
		title: `Switched to ${result.workspace.name}`,
		description: "Projects and tasks will use this workspace context.",
		color: "success",
		icon: "i-lucide-building-2",
	});
}

const menuItems = computed<DropdownMenuItem[][]>(() => {
	const workspaceGroup: DropdownMenuItem[] = accessibleWorkspaces.value.map(
		ws => ({
			label: ws.name,
			icon: "i-lucide-building-2",
			type: "checkbox",
			checked: ws.id === activeWorkspace.value?.id,
			onSelect: () => switchTo(ws.id),
		}),
	);

	return [
		[
			{
				label: "Workspaces",
				type: "label",
			},
			...workspaceGroup,
		],
		[
			{
				label: "All workspaces",
				icon: "i-lucide-building-2",
				to: "/app/workspaces",
			},
			{
				label: "Create workspace",
				icon: "i-lucide-plus",
				onSelect: openCreateModal,
			},
		],
	];
});
</script>
