<template>
	<div class="flex h-full flex-col gap-4">
		<div class="px-1 lg:px-0">
			<LayoutBrandLogo
				size="sm"
				class="hidden lg:inline-flex"
			/>
			<p class="mt-1 hidden text-xs text-muted lg:block">
				{{ APP_NAME }}
			</p>
		</div>

		<UNavigationMenu
			:items="appNavItems"
			orientation="vertical"
			class="flex-1 -mx-1"
			:ui="{
				link: 'py-2.5',
			}"
		/>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";
import { appNavItems } from "~/config/app-nav";
</script>
