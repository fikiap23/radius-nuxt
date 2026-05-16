<template>
	<LayoutAppShell
		v-model:sidebar-open="sidebarOpen"
		show-page-header
	>
		<template #header>
			<LayoutAppHeaderBar @open-sidebar="sidebarOpen = true" />
		</template>

		<template #pageHeader>
			<LayoutAppPageHeader />
		</template>

		<template #sidebar>
			<LayoutAppSidebar />
		</template>

		<slot />
	</LayoutAppShell>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false);
</script>
