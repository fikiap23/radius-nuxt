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
	</div>
</template>

<script setup lang="ts">
import type { BrandId } from "~/config/theme";

const { brand, brandOptions, isDark, setBrand, toggleColorMode } = useTheme();

function onBrandChange(value: BrandId) {
	setBrand(value);
}
</script>
