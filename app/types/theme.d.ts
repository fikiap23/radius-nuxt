import type { FontId } from "~/config/fonts";
import type { BrandId } from "~/config/theme";

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
