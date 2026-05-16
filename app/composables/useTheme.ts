import {
	BRAND_IDS,
	DEFAULT_BRAND,
	type BrandId,
	type ColorModeOption,
} from "~/config/theme";

/**
 * Central theme API: color mode (light/dark/system) + brand palette (default/ocean).
 *
 * - Color mode: @nuxtjs/color-mode (bundled with Nuxt UI)
 * - Brand: data-brand on <html>, persisted in cookie via plugins/theme.ts
 */
export function useTheme() {
	const colorMode = useColorMode();
	const brand = useCookie<BrandId>("theme-brand", {
		default: () => DEFAULT_BRAND,
		sameSite: "lax",
	});

	const isDark = computed(() => colorMode.value === "dark");

	const brandLabels: Record<BrandId, string> = {
		default: "Default",
		ocean: "Ocean",
		forest: "Forest",
	};

	const brandOptions = BRAND_IDS.map(id => ({
		id,
		label: brandLabels[id],
	}));

	function setBrand(next: BrandId) {
		if (!BRAND_IDS.includes(next)) {
			return;
		}
		brand.value = next;
	}

	function setColorMode(mode: ColorModeOption) {
		colorMode.preference = mode;
	}

	function toggleColorMode() {
		colorMode.preference = isDark.value ? "light" : "dark";
	}

	return {
		colorMode,
		brand,
		isDark,
		brandOptions,
		setBrand,
		setColorMode,
		toggleColorMode,
	};
}
