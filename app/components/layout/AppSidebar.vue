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
			<ul class="flex flex-col gap-0.5">
				<li
					v-for="item in appNavItems"
					:key="item.to"
				>
					<NuxtLink
						:to="item.to"
						class="app-sidebar-nav-link"
						:class="[
							collapsed && 'app-sidebar-nav-link--collapsed',
							isActive(item.to) && 'app-sidebar-nav-link--active',
						]"
						:aria-current="isActive(item.to) ? 'page' : undefined"
					>
						<UIcon
							:name="item.icon"
							class="size-4.5 shrink-0"
						/>
						<span
							v-if="!collapsed"
							class="truncate"
						>
							{{ item.label }}
						</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>

		<div class="shrink-0 border-t border-muted p-2">
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

const route = useRoute();
const { toggle } = useAppSidebar();

function isActive(to: string) {
	if (to === "/app") {
		return route.path === "/app";
	}
	return route.path === to || route.path.startsWith(`${to}/`);
}
</script>
