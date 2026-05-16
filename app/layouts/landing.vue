<template>
	<div class="min-h-dvh flex flex-col bg-default text-default">
		<a
			href="#main-content"
			class="skip-link"
		>
			Skip to content
		</a>

		<header
			class="sticky top-0 z-50 h-16 border-b border-muted bg-default/80 backdrop-blur-md"
		>
			<div
				class="mx-auto flex h-full max-w-app items-center justify-between gap-4 px-page"
			>
				<LayoutSiteHeader />
			</div>
		</header>

		<main
			id="main-content"
			class="flex-1"
			tabindex="-1"
		>
			<slot />
		</main>

		<LayoutSiteFooter />
	</div>
</template>
