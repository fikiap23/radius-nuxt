import type { NavigationMenuItem } from "@nuxt/ui";

/** Sidebar / header nav entries — `to` is always a path string in this app. */
export interface AppNavItem {
	label: string;
	icon: string;
	to: string;
}

export const appNavItems = [
	{
		label: "Dashboard",
		icon: "i-lucide-layout-dashboard",
		to: "/app",
	},
	{
		label: "Projects",
		icon: "i-lucide-folder-kanban",
		to: "/app/projects",
	},
	{
		label: "Workspaces",
		icon: "i-lucide-building-2",
		to: "/app/workspaces",
	},
	{
		label: "My Tasks",
		icon: "i-lucide-check-square",
		to: "/app/my-tasks",
	},
	{
		label: "Settings",
		icon: "i-lucide-settings",
		to: "/app/settings",
	},
] as const satisfies readonly AppNavItem[];

/** For `UNavigationMenu` which expects the broader Nuxt UI item type. */
export const appNavMenuItems: NavigationMenuItem[] = [...appNavItems];
