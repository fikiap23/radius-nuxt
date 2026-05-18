import type { ProjectCoverPreset } from "~/types/project";

export const PROJECT_ICON_OPTIONS = [
	{ label: "Rocket", value: "i-lucide-rocket" },
	{ label: "Palette", value: "i-lucide-palette" },
	{ label: "Sparkles", value: "i-lucide-sparkles" },
	{ label: "Globe", value: "i-lucide-globe" },
	{ label: "Folder", value: "i-lucide-folder-kanban" },
	{ label: "Layers", value: "i-lucide-layers" },
	{ label: "Zap", value: "i-lucide-zap" },
	{ label: "Target", value: "i-lucide-target" },
	{ label: "Box", value: "i-lucide-box" },
	{ label: "Code", value: "i-lucide-code-2" },
] as const;

export const PROJECT_COVER_PRESETS: {
	id: ProjectCoverPreset;
	label: string;
}[] = [
	{ id: "emerald", label: "Emerald" },
	{ id: "ocean", label: "Ocean" },
	{ id: "sunset", label: "Sunset" },
	{ id: "violet", label: "Violet" },
	{ id: "rose", label: "Rose" },
	{ id: "slate", label: "Slate" },
];

export const PROJECT_STATUS_OPTIONS = [
	{ label: "Active", value: "active" as const },
	{ label: "On hold", value: "on_hold" as const },
	{ label: "Completed", value: "completed" as const },
];

export const PROJECT_VIEW_TABS = [
	{ label: "Board", icon: "i-lucide-kanban", to: "board" },
	{ label: "List", icon: "i-lucide-list", to: "list" },
] as const;
