import type { NavigationMenuItem } from "@nuxt/ui";

export const appNavItems: NavigationMenuItem[] = [
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
		label: "My Tasks",
		icon: "i-lucide-check-square",
		to: "/app/my-tasks",
	},
	{
		label: "Settings",
		icon: "i-lucide-settings",
		to: "/app/settings",
	},
];
