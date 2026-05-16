<template>
	<div class="min-h-dvh flex flex-col bg-default text-default">
		<header
			v-if="$slots.header"
			class="sticky top-0 z-50 h-16 border-b border-muted bg-default/80 backdrop-blur-md"
		>
			<div
				class="mx-auto flex h-full max-w-app items-center justify-between gap-4 px-page"
			>
				<slot name="header" />
			</div>
		</header>

		<div class="flex flex-1">
			<aside
				v-if="$slots.sidebar"
				class="hidden w-64 shrink-0 border-e border-muted bg-elevated lg:block"
			>
				<div class="sticky top-16 p-4">
					<slot name="sidebar" />
				</div>
			</aside>

			<main class="flex-1 px-page py-page">
				<div class="mx-auto max-w-app">
					<slot />
				</div>
			</main>
		</div>

		<footer
			v-if="$slots.footer"
			class="border-t border-muted bg-muted/30 px-page py-6"
		>
			<div class="mx-auto max-w-app">
				<slot name="footer" />
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
/**
 * Reusable app layout shell.
 * Slots: header, sidebar (optional), default, footer (optional)
 *
 * Uses layout tokens: px-page, max-w-app, semantic bg/border colors.
 */
</script>
