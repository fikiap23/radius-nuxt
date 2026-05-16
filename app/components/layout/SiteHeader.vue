<template>
	<LayoutBrandLogo size="sm" />

	<nav class="hidden items-center gap-1 md:flex">
		<UButton
			v-for="link in navLinks"
			:key="link.to"
			:to="link.to"
			:label="link.label"
			color="neutral"
			variant="ghost"
			size="sm"
		/>
	</nav>

	<div class="flex items-center gap-1 sm:gap-2">
		<LayoutThemeToggle />
		<UButton
			to="/auth/login"
			label="Sign in"
			color="neutral"
			variant="ghost"
			size="sm"
			class="hidden sm:inline-flex"
		/>
		<UButton
			to="/auth/register"
			label="Get started"
			color="primary"
			size="sm"
			class="font-semibold shadow-md shadow-primary/20"
		/>
	</div>
</template>

<script setup lang="ts">
const navLinks = [
	{ label: "Features", to: "#features" },
	{ label: "How it works", to: "#how-it-works" },
	{ label: "Pricing", to: "#pricing" },
];
</script>
