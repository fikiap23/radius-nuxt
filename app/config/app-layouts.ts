export const APP_LAYOUT_IDS = [
	"classic",
	"compact",
	"wide",
	"top-nav",
	"inset",
] as const;

export type AppLayoutId = (typeof APP_LAYOUT_IDS)[number];

export const DEFAULT_APP_LAYOUT: AppLayoutId = "classic";

export interface AppLayoutPreset {
	id: AppLayoutId;
	label: string;
	description: string;
	icon: string;
	/** Show persistent sidebar on large screens */
	sidebar: boolean;
	/** How main content is constrained horizontally */
	contentWidth: "default" | "wide" | "narrow";
}

export const appLayoutPresets: AppLayoutPreset[] = [
	{
		id: "classic",
		label: "Classic",
		description: "Left sidebar with a comfortable, centered content width.",
		icon: "i-lucide-panel-left",
		sidebar: true,
		contentWidth: "default",
	},
	{
		id: "compact",
		label: "Compact",
		description: "A slimmer sidebar and tighter page padding.",
		icon: "i-lucide-rows-3",
		sidebar: true,
		contentWidth: "default",
	},
	{
		id: "wide",
		label: "Wide",
		description: "Keeps the sidebar; content uses the full available width.",
		icon: "i-lucide-maximize-2",
		sidebar: true,
		contentWidth: "wide",
	},
	{
		id: "top-nav",
		label: "Top navigation",
		description: "Horizontal navigation in the header; no desktop sidebar.",
		icon: "i-lucide-layout-template",
		sidebar: false,
		contentWidth: "default",
	},
	{
		id: "inset",
		label: "Inset panel",
		description: "Content in a raised panel with margin around the main area.",
		icon: "i-lucide-square-dashed-bottom",
		sidebar: true,
		contentWidth: "default",
	},
];

export const appLayoutById = Object.fromEntries(
	appLayoutPresets.map(preset => [preset.id, preset]),
) as Record<AppLayoutId, AppLayoutPreset>;

export function isAppLayoutId(value: string): value is AppLayoutId {
	return (APP_LAYOUT_IDS as readonly string[]).includes(value);
}
