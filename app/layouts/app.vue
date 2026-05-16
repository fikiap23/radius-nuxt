<template>
	<LayoutAppShell
		v-model:sidebar-open="sidebarOpen"
		v-model:sidebar-collapsed="sidebarCollapsed"
	>
		<template #header>
			<LayoutAppHeaderBar @open-sidebar="sidebarOpen = true" />
		</template>

		<template #sidebar="{ collapsed }">
			<LayoutAppSidebar :collapsed="collapsed" />
		</template>

		<slot />

		<WorkspaceCreateModal
			v-if="createOpen"
			v-model:open="createOpen"
		/>
	</LayoutAppShell>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false);
const { collapsed: sidebarCollapsed } = useAppSidebar();
const { createOpen } = useWorkspaceCreateModal();
</script>
