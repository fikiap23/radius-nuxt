<template>
	<div class="min-h-dvh flex flex-col bg-default text-default">
		<header
			v-if="$slots.header"
			class="sticky top-0 z-50 shrink-0 border-b border-muted bg-default/90 backdrop-blur-md"
		>
			<div class="mx-auto max-w-full px-page py-2">
				<slot name="header" />
			</div>
		</header>

		<div class="flex flex-1 min-h-0">
			<aside
				v-if="$slots.sidebar"
				class="hidden w-64 shrink-0 border-e border-muted bg-elevated lg:block"
			>
				<div class="sticky top-[3.5rem] flex h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto p-4">
					<slot name="sidebar" />
				</div>
			</aside>

			<USlideover
				v-if="$slots.sidebar"
				v-model:open="sidebarOpen"
				side="left"
				title="Navigation"
				class="lg:hidden"
			>
				<template #body>
					<div
						class="p-4"
						@click="closeSidebarOnNavigate"
					>
						<slot name="sidebar" />
					</div>
				</template>
			</USlideover>

			<main class="flex min-w-0 flex-1 flex-col">
				<div v-if="showPageHeader && $slots.pageHeader">
					<slot name="pageHeader" />
				</div>
				<div class="flex-1 overflow-y-auto px-page py-page">
					<div class="mx-auto max-w-app">
						<slot />
					</div>
				</div>
			</main>
		</div>

		<footer
			v-if="$slots.footer"
			class="border-t border-muted bg-muted/30 px-page py-6"
		>
			<div class="mx-auto max-w-app">
				<slot name="footer" />
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		showPageHeader?: boolean;
	}>(),
	{
		showPageHeader: false,
	},
);

const sidebarOpen = defineModel<boolean>("sidebarOpen", { default: false });

function closeSidebarOnNavigate(event: MouseEvent) {
	const target = event.target as HTMLElement | null;
	if (target?.closest("a[href]")) {
		sidebarOpen.value = false;
	}
}

defineExpose({ sidebarOpen });
</script>
