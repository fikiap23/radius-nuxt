import { DEFAULT_FONT, type FontId } from "~/config/fonts";
import { DEFAULT_BRAND, type BrandId } from "~/config/theme";

/**
 * Sync theme cookies → html data attributes for SSR/hydration-safe switching.
 */
export default defineNuxtPlugin(() => {
	const brand = useCookie<BrandId>("theme-brand", {
		default: () => DEFAULT_BRAND,
	});
	const font = useCookie<FontId>("theme-font", {
		default: () => DEFAULT_FONT,
	});

	useHead({
		htmlAttrs: {
			"data-brand": () => brand.value ?? DEFAULT_BRAND,
			"data-font": () => font.value ?? DEFAULT_FONT,
		},
	});
});
