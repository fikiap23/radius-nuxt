// https://nuxt.com/docs/api/configuration/nuxt-config
import process from "node:process";

const featureNames = [
	"auth",
	"board",
	"dashboard",
	"landing",
	"notification",
	"project",
	"storage",
	"task",
	"workspace",
] as const;

export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
		},
	},
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "@pinia/nuxt"],
	imports: {
		dirs: [
			"core/utils",
			"shared/composables",
			"features/*/composables",
			"features/*/utils",
		],
	},
	components: [
		{ path: "~/shared/components", pathPrefix: true },
		...featureNames.map(name => ({
			path: `~/features/${name}/components`,
			pathPrefix: true,
			extensions: [".vue"],
		})),
	],
	pinia: {
		storesDirs: ["./features/**/stores", "./shared/stores"],
	},
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
