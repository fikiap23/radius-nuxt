<template>
	<LayoutAppShell
		v-model:sidebar-open="sidebarOpen"
		v-model:sidebar-collapsed="sidebarCollapsed"
		show-page-header
	>
		<template #header>
			<LayoutAppHeaderBar @open-sidebar="sidebarOpen = true" />
		</template>

		<template #pageHeader>
			<LayoutAppPageHeader />
		</template>

		<template #sidebar="{ collapsed }">
			<LayoutAppSidebar :collapsed="collapsed" />
		</template>

		<slot />
	</LayoutAppShell>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false);
const { collapsed: sidebarCollapsed } = useAppSidebar();
</script>
