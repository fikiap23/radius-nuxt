import { DEFAULT_BRAND, type BrandId } from "~/config/theme";

/**
 * Sync brand cookie → html[data-brand] for SSR/hydration-safe palette switching.
 */
export default defineNuxtPlugin(() => {
	const brand = useCookie<BrandId>("theme-brand", {
		default: () => DEFAULT_BRAND,
	});

	useHead({
		htmlAttrs: {
			"data-brand": () => brand.value ?? DEFAULT_BRAND,
		},
	});
});
