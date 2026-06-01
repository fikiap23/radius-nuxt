// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
		},
	},
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "@pinia/nuxt"],
	devtools: { enabled: true },
	// Avoid 404 on /_nuxt/builds/meta/dev.json during HMR (tab clicks, navigation).
	experimental: {
		appManifest: false,
	},
	css: ["~/assets/css/main.css"],
	colorMode: {
		classSuffix: "",
		preference: "dark",
		fallback: "dark",
	},
	compatibilityDate: "2025-07-15",
	vite: {
		optimizeDeps: {
			include: [
				"@tiptap/vue-3",
				"@tiptap/starter-kit",
				"@tiptap/extension-placeholder",
				"@tiptap/extension-link",
				"@tiptap/extension-mention",
				"@tiptap/extension-underline",
				"@tiptap/extension-code-block-lowlight",
				"@tiptap/suggestion",
				"lowlight",
				"hast-util-to-html",
			],
		},
	},
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
