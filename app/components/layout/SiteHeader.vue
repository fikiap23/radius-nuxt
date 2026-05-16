<template>
	<div class="flex w-full items-center justify-between gap-4">
		<LayoutBrandLogo size="sm" />

		<nav
			class="hidden items-center gap-1 md:flex"
			aria-label="Primary navigation"
		>
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
			<UButton
				icon="i-lucide-menu"
				color="neutral"
				variant="ghost"
				size="sm"
				class="md:hidden"
				:aria-label="menuOpen ? 'Close menu' : 'Open menu'"
				:aria-expanded="menuOpen"
				@click="menuOpen = true"
			/>
		</div>

		<USlideover
			v-model:open="menuOpen"
			title="Menu"
			side="right"
		>
			<template #body>
				<nav
					class="flex flex-col gap-1"
					aria-label="Mobile navigation"
				>
					<UButton
						v-for="link in navLinks"
						:key="link.to"
						:to="link.to"
						:label="link.label"
						color="neutral"
						variant="ghost"
						block
						class="justify-start"
						@click="closeMenu"
					/>
					<UButton
						to="#faq"
						label="FAQ"
						color="neutral"
						variant="ghost"
						block
						class="justify-start"
						@click="closeMenu"
					/>
				</nav>
				<div class="mt-6 flex flex-col gap-2 border-t border-muted pt-6">
					<UButton
						to="/auth/login"
						label="Sign in"
						color="neutral"
						variant="outline"
						block
						@click="closeMenu"
					/>
					<UButton
						to="/auth/register"
						label="Get started"
						color="primary"
						block
						class="font-semibold"
						@click="closeMenu"
					/>
				</div>
			</template>
		</USlideover>
	</div>
</template>

<script setup lang="ts">
const menuOpen = ref(false);

const navLinks = [
	{ label: "Features", to: "#features" },
	{ label: "How it works", to: "#how-it-works" },
	{ label: "Pricing", to: "#pricing" },
];

function closeMenu() {
	menuOpen.value = false;
}
</script>
