/**
 * Single source of truth for brand / color-mode theme identifiers.
 * CSS maps each brand to palette overrides via [data-brand="…"].
 * Font presets live in ~/core/config/fonts.ts ([data-font="…"]).
 */
export const BRAND_IDS = ["default", "ocean", "forest"] as const;

export type BrandId = (typeof BRAND_IDS)[number];

export const DEFAULT_BRAND: BrandId = "default";

export const COLOR_MODE_OPTIONS = ["light", "dark", "system"] as const;

export type ColorModeOption = (typeof COLOR_MODE_OPTIONS)[number];

/** Maps brand id → Nuxt UI primary palette name (must exist in @theme) */
export const BRAND_PRIMARY_PALETTE: Record<BrandId, string> = {
	default: "brand",
	ocean: "ocean",
	forest: "forest",
};
