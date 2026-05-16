<template>
	<div class="flex h-full min-h-0 flex-col">
		<div
			:class="[
				'shrink-0',
				collapsed ? 'flex justify-center px-2 py-4' : 'px-3 py-4',
			]"
		>
			<LayoutBrandLogo
				to="/app"
				size="sm"
				:collapsed="collapsed"
			/>
		</div>

		<nav
			class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2"
			aria-label="App sections"
		>
			<UNavigationMenu
				:items="appNavItems"
				:collapsed="collapsed"
				orientation="vertical"
				class="w-full"
				:ui="{
					link: collapsed ? 'justify-center px-2 py-2.5' : 'py-2.5',
				}"
			/>
		</nav>

		<div
			class="shrink-0 border-t border-muted p-2"
		>
			<UButton
				:icon="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
				:label="collapsed ? undefined : 'Collapse sidebar'"
				color="neutral"
				variant="ghost"
				size="sm"
				block
				class="hidden lg:inline-flex"
				:aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
				@click="toggle"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { appNavItems } from "~/config/app-nav";

defineProps<{
	collapsed?: boolean;
}>();

const { toggle } = useAppSidebar();
</script>
