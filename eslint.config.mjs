// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
	rules: {
		// Keep Vue templates readable on save (avoid breaking :icon across many lines)
		"vue/max-attributes-per-line": "off",
		"vue/first-attribute-linebreak": "off",
	},
});
