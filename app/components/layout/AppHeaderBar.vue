<template>
	<div class="app-header-bar">
		<div class="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
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

			<WorkspaceSwitcher class="relative z-0 hidden min-w-0 shrink lg:flex" />

			<nav
				v-if="!showSidebar"
				class="app-header-bar__nav min-w-0 flex-1"
				aria-label="App sections"
			>
				<UNavigationMenu
					:items="appNavMenuItems"
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
				v-if="mobileTitle"
				class="min-w-0 flex-1 truncate text-sm font-semibold text-highlighted lg:hidden"
			>
				{{ mobileTitle }}
			</p>
		</div>

		<div class="flex shrink-0 items-center gap-0.5 sm:gap-2">
			<NotificationBell />
			<LayoutThemeToggle
				compact
				class="hidden sm:flex"
			/>

			<UDropdownMenu
				:items="userMenuItems"
				:content="{ align: 'end' }"
				:modal="false"
			>
				<UButton
					color="neutral"
					variant="ghost"
					size="sm"
					square
					class="sm:max-w-48 sm:gap-2 sm:rounded-full sm:ps-1.5 sm:pe-2 sm:ring-1 sm:ring-muted/80 sm:hover:ring-primary/30"
					:aria-label="user?.name ? `Account menu, ${user.name}` : 'Account menu'"
				>
					<UAvatar
						:text="userInitials"
						size="xs"
						class="shrink-0 ring-2 ring-primary/20 sm:ring-2"
					/>
					<span
						v-if="user"
						class="hidden truncate text-sm font-medium text-default md:inline"
					>
						{{ user.name }}
					</span>
					<UIcon
						name="i-lucide-chevron-down"
						class="hidden size-4 shrink-0 text-muted md:inline"
					/>
				</UButton>
			</UDropdownMenu>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { appNavMenuItems } from "~/config/app-nav";
import { APP_NAME } from "~/config/brand";

const emit = defineEmits<{
	"open-sidebar": [];
}>();

const { user, logout } = useAuth();
const { title, breadcrumbs } = useAppPageMeta();
const { collapsed: sidebarCollapsed, toggle: toggleSidebar } = useAppSidebar();
const { showSidebar, layoutId, presets, setLayout } = useAppLayout();
const {
	accessibleWorkspaces,
	activeWorkspace,
	setActiveWorkspace,
} = useWorkspace();
const { openCreateModal } = useWorkspaceCreateModal();
const { isDark, toggleColorMode } = useTheme();
const toast = useToast();

/** Workspace switcher lives in header on lg+; menu section is for mobile. */
const isLargeScreen = ref(true);

onMounted(() => {
	const mq = window.matchMedia("(min-width: 1024px)");
	const sync = () => {
		isLargeScreen.value = mq.matches;
	};
	sync();
	mq.addEventListener("change", sync);
	onUnmounted(() => mq.removeEventListener("change", sync));
});

const mobileTitle = computed(() => {
	if (title.value) {
		return title.value;
	}
	const crumbs = breadcrumbs.value;
	if (crumbs.length > 0) {
		return crumbs[crumbs.length - 1]?.label ?? APP_NAME;
	}
	return APP_NAME;
});

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

async function switchWorkspace(id: string) {
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
		color: "success",
		icon: "i-lucide-building-2",
	});
}

const userMenuItems = computed<DropdownMenuItem[][]>(() => {
	const workspaceItems: DropdownMenuItem[] = accessibleWorkspaces.value.map(
		ws => ({
			label: ws.name,
			icon: "i-lucide-building-2",
			type: "checkbox",
			checked: ws.id === activeWorkspace.value?.id,
			onSelect: () => switchWorkspace(ws.id),
		}),
	);

	const groups: DropdownMenuItem[][] = [
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
	];

	if (!isLargeScreen.value) {
		groups.push([
			{
				label: "Workspace",
				type: "label",
			},
			...workspaceItems,
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
		]);
	}

	const settingsGroup: DropdownMenuItem[] = [
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
	];

	if (!isLargeScreen.value) {
		settingsGroup.push({
			label: isDark.value ? "Light mode" : "Dark mode",
			icon: isDark.value ? "i-lucide-sun" : "i-lucide-moon",
			onSelect: toggleColorMode,
		});
	}

	groups.push(settingsGroup);
	groups.push([
		{
			label: "Sign out",
			icon: "i-lucide-log-out",
			color: "error",
			onSelect: () => logout(),
		},
	]);

	return groups;
});
</script>
