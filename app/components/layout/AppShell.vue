<template>
	<div
		class="app-shell"
		:class="`app-shell--${layoutId}`"
		:data-app-layout="layoutId"
	>
		<header
			v-if="$slots.header"
			class="app-shell__header shrink-0"
		>
			<div class="px-page py-2">
				<slot name="header" />
			</div>
		</header>

		<div class="app-shell__body">
			<aside
				v-if="$slots.sidebar && showSidebar"
				class="app-sidebar hidden lg:flex"
				:class="sidebarCollapsed ? 'app-sidebar--collapsed' : 'app-sidebar--expanded'"
				aria-label="Main navigation"
			>
				<slot
					name="sidebar"
					:collapsed="sidebarCollapsed"
				/>
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
						<slot
							name="sidebar"
							:collapsed="false"
						/>
					</div>
				</template>
			</USlideover>

			<main class="app-shell__main">
				<div v-if="showPageHeader && $slots.pageHeader">
					<slot name="pageHeader" />
				</div>
				<div class="app-shell__content">
					<div :class="contentWidthClass">
						<slot />
					</div>
				</div>
			</main>
		</div>

		<footer
			v-if="$slots.footer"
			class="app-shell__footer shrink-0"
		>
			<div :class="contentWidthClass">
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

const { layoutId, showSidebar, contentWidthClass } = useAppLayout();

const sidebarOpen = defineModel<boolean>("sidebarOpen", { default: false });
const sidebarCollapsed = defineModel<boolean>("sidebarCollapsed", {
	default: false,
});

function closeSidebarOnNavigate(event: MouseEvent) {
	const target = event.target as HTMLElement | null;
	if (target?.closest("a[href]")) {
		sidebarOpen.value = false;
	}
}

defineExpose({ sidebarOpen, sidebarCollapsed });
</script>
