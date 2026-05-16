import type { BrandId } from "~/config/theme";

declare module "#app" {
	interface NuxtApp {
		$theme: {
			brand: BrandId;
		};
	}
}

declare global {
	interface HTMLElement {
		dataset: DOMStringMap & {
			brand?: BrandId;
		};
	}
}

export {};
