import {
	DEFAULT_FONT,
	FONT_IDS,
	FONT_PRESETS,
	type FontId,
} from "~/config/fonts";
import {
	BRAND_IDS,
	DEFAULT_BRAND,
	type BrandId,
	type ColorModeOption,
} from "~/config/theme";

/**
 * Central theme API: color mode, brand palette, and font presets.
 *
 * - Color mode: @nuxtjs/color-mode (bundled with Nuxt UI)
 * - Brand: data-brand on <html>, persisted in cookie via plugins/theme.ts
 * - Fonts: data-font on <html>, persisted in cookie via plugins/theme.ts
 */
export function useTheme() {
	const colorMode = useColorMode();
	const brand = useCookie<BrandId>("theme-brand", {
		default: () => DEFAULT_BRAND,
		sameSite: "lax",
	});
	const font = useCookie<FontId>("theme-font", {
		default: () => DEFAULT_FONT,
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

	const fontOptions = FONT_IDS.map(id => ({
		id,
		label: FONT_PRESETS[id].label,
	}));

	function setBrand(next: BrandId) {
		if (!BRAND_IDS.includes(next)) {
			return;
		}
		brand.value = next;
	}

	function setFont(next: FontId) {
		if (!FONT_IDS.includes(next)) {
			return;
		}
		font.value = next;
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
		font,
		isDark,
		brandOptions,
		fontOptions,
		setBrand,
		setFont,
		setColorMode,
		toggleColorMode,
	};
}
