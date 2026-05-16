<template>
	<div class="app-header-bar">
		<div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
			<UButton
				v-if="showSidebar"
				:icon="sidebarToggleIcon"
				color="neutral"
				variant="ghost"
				size="sm"
				class="hidden shrink-0 lg:inline-flex"
				:aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
				@click="toggleSidebar"
			/>
			<UButton
				icon="i-lucide-menu"
				color="neutral"
				variant="ghost"
				size="sm"
				class="shrink-0 lg:hidden"
				aria-label="Open navigation"
				@click="emit('open-sidebar')"
			/>

			<WorkspaceSwitcher class="relative z-0 min-w-0 shrink" />

			<nav
				v-if="!showSidebar"
				class="app-header-bar__nav min-w-0 flex-1"
				aria-label="App sections"
			>
				<UNavigationMenu
					:items="appNavItems"
					orientation="horizontal"
					class="w-full min-w-0"
					:ui="{ link: 'px-2.5 py-1.5 text-sm' }"
				/>
			</nav>

			<div
				class="hidden min-w-0 items-center gap-2 md:flex"
				:class="!showSidebar && 'lg:hidden'"
			>
				<span class="shrink-0 text-sm font-semibold text-toned">
					{{ APP_NAME }}
				</span>
				<UIcon
					name="i-lucide-chevron-right"
					class="size-3.5 shrink-0 text-muted"
					aria-hidden="true"
				/>
				<UBreadcrumb
					:items="breadcrumbs"
					class="app-header-bar__breadcrumb min-w-0"
				/>
			</div>

			<p
				v-if="title"
				class="truncate text-sm font-medium text-highlighted md:hidden"
			>
				{{ title }}
			</p>
		</div>

		<div class="flex shrink-0 items-center gap-2 sm:gap-3">
			<LayoutThemeToggle compact />

			<UDropdownMenu
				:items="userMenuItems"
				:content="{ align: 'end' }"
				:modal="false"
			>
				<UButton
					color="neutral"
					variant="ghost"
					size="sm"
					class="max-w-48 gap-2 rounded-full ps-1.5 pe-2 ring-1 ring-muted/80 hover:ring-primary/30"
				>
					<UAvatar
						:text="userInitials"
						size="xs"
						class="shrink-0 ring-2 ring-primary/20"
					/>
					<span
						v-if="user"
						class="hidden truncate text-sm font-medium text-default sm:inline"
					>
						{{ user.name }}
					</span>
					<UIcon
						name="i-lucide-chevron-down"
						class="size-4 shrink-0 text-muted"
					/>
				</UButton>
			</UDropdownMenu>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { appNavItems } from "~/config/app-nav";
import { APP_NAME } from "~/config/brand";

const emit = defineEmits<{
	"open-sidebar": [];
}>();

const { user, logout } = useAuth();
const { title, breadcrumbs } = useAppPageMeta();
const { collapsed: sidebarCollapsed, toggle: toggleSidebar } = useAppSidebar();
const { showSidebar, layoutId, presets, setLayout } = useAppLayout();

const sidebarToggleIcon = computed(() =>
	sidebarCollapsed.value
		? "i-lucide-panel-left-open"
		: "i-lucide-panel-left-close",
);

const userInitials = computed(() => {
	if (!user.value?.name) {
		return "?";
	}
	return user.value.name
		.split(" ")
		.map(part => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
});

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
	[
		{
			label: user.value?.name ?? "Account",
			type: "label",
		},
		{
			label: user.value?.email ?? "",
			type: "label",
			disabled: true,
		},
	],
	[
		{
			label: "App layout",
			icon: "i-lucide-layout-template",
			children: presets.map(preset => ({
				label: preset.label,
				icon: preset.icon,
				type: "checkbox",
				checked: layoutId.value === preset.id,
				onSelect: () => setLayout(preset.id),
			})),
		},
		{
			label: "Settings",
			icon: "i-lucide-settings",
			to: "/app/settings",
		},
	],
	[
		{
			label: "Sign out",
			icon: "i-lucide-log-out",
			color: "error",
			onSelect: () => logout(),
		},
	],
]);
</script>
