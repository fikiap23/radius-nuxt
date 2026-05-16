<template>
	<div class="flex items-center gap-1">
		<UButton
			:icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
			color="neutral"
			variant="ghost"
			size="sm"
			:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
			@click="toggleColorMode"
		/>

		<USelect
			:model-value="brand"
			:items="brandOptions"
			value-key="id"
			label-key="label"
			size="sm"
			class="w-28"
			aria-label="Change brand color"
			@update:model-value="onBrandChange"
		/>

		<USelect
			:model-value="font"
			:items="fontOptions"
			value-key="id"
			label-key="label"
			size="sm"
			class="w-32"
			aria-label="Change font preset"
			@update:model-value="onFontChange"
		/>
	</div>
</template>

<script setup lang="ts">
import type { FontId } from "~/config/fonts";
import type { BrandId } from "~/config/theme";

const {
	brand,
	font,
	brandOptions,
	fontOptions,
	isDark,
	setBrand,
	setFont,
	toggleColorMode,
} = useTheme();

function onBrandChange(value: BrandId) {
	setBrand(value);
}

function onFontChange(value: FontId) {
	setFont(value);
}
</script>
