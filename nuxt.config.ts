// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "@pinia/nuxt"],
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	colorMode: {
		classSuffix: "",
		preference: "dark",
		fallback: "dark",
	},
	compatibilityDate: "2025-07-15",
	eslint: {
		config: {
			stylistic: {
				semi: true,
				quotes: "double",
				indent: "tab",
			},
		},
	},
	icon: {
		clientBundle: {
			scan: true,
		},
	},
});
