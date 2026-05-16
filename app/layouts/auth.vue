<template>
	<div class="min-h-dvh grid lg:grid-cols-[1.05fr_1fr] bg-default">
		<!-- Brand panel -->
		<section
			class="relative hidden lg:flex flex-col justify-between overflow-hidden bg-surface-promo text-on-promo p-10 xl:p-14"
		>
			<div
				class="auth-grain pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
			/>

			<!-- Ambient shapes -->
			<div
				class="auth-pulse-soft pointer-events-none absolute -inset-s-20 top-1/4 size-72 rounded-full bg-primary/30 blur-3xl"
				aria-hidden="true"
			/>
			<div
				class="auth-float pointer-events-none absolute inset-e-8 top-20 size-24 rounded-2xl border border-on-promo-subtle bg-on-promo-subtle backdrop-blur-sm rotate-12"
				aria-hidden="true"
			/>
			<div
				class="auth-float-delayed pointer-events-none absolute bottom-32 inset-s-16 size-16 rounded-full bg-secondary/40 blur-sm"
				aria-hidden="true"
			/>
			<div
				class="pointer-events-none absolute inset-e-0 bottom-0 w-2/3 h-1/2 bg-linear-to-tl from-primary/20 via-transparent to-transparent"
				aria-hidden="true"
			/>

			<!-- Grid lines -->
			<div
				class="auth-promo-grid pointer-events-none absolute inset-0"
				aria-hidden="true"
			/>

			<div class="relative z-10">
				<LayoutBrandLogo
					size="lg"
					promo
				/>
			</div>

			<div class="relative z-10 max-w-lg space-y-8">
				<div class="space-y-4">
					<p class="text-sm font-medium text-primary-300/90 tracking-wide">
						{{ panel.eyebrow }}
					</p>
					<h1
						class="font-display text-4xl xl:text-5xl font-extrabold leading-[1.05] tracking-tight text-balance"
					>
						{{ panel.headline }}
						<span
							class="block mt-1 bg-linear-to-r from-primary-300 via-primary-200 to-secondary-300 bg-clip-text text-transparent"
						>
							{{ panel.accent }}
						</span>
					</h1>
					<p class="text-base text-on-promo-muted leading-relaxed max-w-md">
						{{ panel.subtext }}
					</p>
				</div>

				<div class="flex flex-wrap gap-2">
					<span
						v-for="tag in tags"
						:key="tag"
						class="rounded-full border border-on-promo-subtle bg-on-promo-subtle px-3 py-1 text-xs font-medium text-on-promo backdrop-blur-sm"
					>
						{{ tag }}
					</span>
				</div>

				<figure
					class="rounded-2xl border border-on-promo-subtle bg-on-promo-subtle p-5 backdrop-blur-md"
				>
					<blockquote class="text-sm leading-relaxed text-on-promo/80">
						“{{ panel.quote }}”
					</blockquote>
					<figcaption class="mt-3 flex items-center gap-3">
						<span
							class="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-primary-400 to-primary-300 text-xs font-bold text-surface-promo"
						>
							{{ panel.authorInitials }}
						</span>
						<div>
							<p class="text-sm font-semibold text-on-promo">
								{{ panel.author }}
							</p>
							<p class="text-xs text-on-promo-muted">
								{{ panel.role }}
							</p>
						</div>
					</figcaption>
				</figure>
			</div>

			<!-- Marquee -->
			<div
				class="relative z-10 overflow-hidden border-t border-on-promo-subtle pt-6"
			>
				<div class="auth-marquee-track flex w-max gap-3">
					<span
						v-for="(word, index) in marqueeWords"
						:key="`${word}-${index}`"
						class="shrink-0 rounded-lg bg-on-promo-subtle px-4 py-2 font-display text-sm font-semibold text-on-promo-muted"
					>
						{{ word }}
					</span>
				</div>
			</div>
		</section>

		<!-- Form panel -->
		<div class="relative flex flex-col min-h-dvh auth-dot-grid">
			<div
				class="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-secondary/5"
				aria-hidden="true"
			/>

			<header
				class="relative flex items-center justify-between gap-4 p-4 sm:p-6 lg:hidden"
			>
				<LayoutBrandLogo size="sm" />
				<LayoutThemeToggle />
			</header>

			<div class="relative flex flex-1 items-center justify-center p-6 sm:p-10">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();

const tags = [
	"Multi-workspace",
	"Kanban & sprints",
	"Role-based access",
	"Built for speed",
];

const marqueeWords = [
	"backlog",
	"in progress",
	"sprint planning",
	"ship the release",
	"review",
	"done",
	"backlog",
	"in progress",
	"sprint planning",
	"ship the release",
	"review",
	"done",
];

const panels = {
	login: {
		eyebrow: "Welcome back",
		headline: "Your work is",
		accent: "right where you left it.",
		subtext:
      "Tasks, boards, and sprints stay in sync across your workspace. Sign in and pick up the thread.",
		quote:
      "Radius replaced our scattered spreadsheets in a week. The board view alone changed how we plan releases.",
		author: "Maya Chen",
		authorInitials: "MC",
		role: "Engineering Lead, Northline",
	},
	register: {
		eyebrow: "Start free",
		headline: "Organize work",
		accent: "your team trusts.",
		subtext:
      "Create a workspace, invite teammates, and run your first sprint — without a painful setup.",
		quote:
      "We went from signup to a live kanban board before lunch. It feels like Linear met the pragmatism of ClickUp.",
		author: "Jordan Blake",
		authorInitials: "JB",
		role: "Product Ops, Patchwork",
	},
	default: {
		eyebrow: "Radius",
		headline: "Project management",
		accent: "that stays out of the way.",
		subtext: "Sign in or create an account to access your workspace.",
		quote:
      "Clean, fast, and built for developers — exactly what we wanted from a PM tool.",
		author: "The Radius team",
		authorInitials: "R",
		role: "Project Management Platform",
	},
};

const panel = computed(() => {
	if (route.path.includes("/register")) {
		return panels.register;
	}
	if (route.path.includes("/login")) {
		return panels.login;
	}
	return panels.default;
});
</script>
