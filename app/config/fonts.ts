/**
 * Single source of truth for font preset identifiers.
 * CSS maps each preset to --font-sans / --font-display via [data-font="…"].
 */
export const FONT_IDS = ["default", "geometric", "classic", "rounded"] as const;

export type FontId = (typeof FONT_IDS)[number];

export const DEFAULT_FONT: FontId = "default";

export const FONT_PRESETS: Record<
	FontId,
	{ label: string; sans: string; display: string }
> = {
	default: { label: "Default", sans: "DM Sans", display: "Syne" },
	geometric: {
		label: "Geometric",
		sans: "Plus Jakarta Sans",
		display: "Space Grotesk",
	},
	classic: { label: "Classic", sans: "Inter", display: "Playfair Display" },
	rounded: {
		label: "Rounded",
		sans: "Nunito Sans",
		display: "Bricolage Grotesque",
	},
};
