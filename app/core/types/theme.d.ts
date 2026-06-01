import type { FontId } from "~/core/config/fonts";
import type { BrandId } from "~/core/config/theme";

declare module "#app" {
	interface NuxtApp {
		$theme: {
			brand: BrandId;
			font: FontId;
		};
	}
}

declare global {
	interface HTMLElement {
		dataset: DOMStringMap & {
			brand?: BrandId;
			font?: FontId;
		};
	}
}

export {};
