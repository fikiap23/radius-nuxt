<template>
	<div>
		<section class="legal-hero">
			<div
				class="legal-hero__backdrop"
				aria-hidden="true"
			/>
			<div class="legal-hero-inner space-y-4">
				<ULink
					to="/"
					class="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
				>
					<UIcon
						name="i-lucide-arrow-left"
						class="size-4"
					/>
					Back to home
				</ULink>
				<div class="space-y-2">
					<p class="text-label font-semibold uppercase text-primary">
						{{ APP_NAME }}
					</p>
					<h1 class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl">
						{{ title }}
					</h1>
					<p
						v-if="description"
						class="max-w-2xl text-muted leading-relaxed"
					>
						{{ description }}
					</p>
				</div>
				<div class="legal-meta">
					<span class="inline-flex items-center gap-1.5">
						<UIcon
							name="i-lucide-calendar"
							class="size-4"
						/>
						Last updated {{ updatedAt }}
					</span>
				</div>
			</div>
		</section>

		<div class="legal-layout">
			<nav
				v-if="sections.length"
				class="legal-nav"
				aria-label="On this page"
			>
				<p class="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
					On this page
				</p>
				<ul class="legal-nav-list">
					<li
						v-for="section in sections"
						:key="section.id"
					>
						<a
							:href="`#${section.id}`"
							class="legal-nav-link"
						>
							{{ section.title }}
						</a>
					</li>
				</ul>
			</nav>

			<article class="legal-prose">
				<div
					v-if="$slots.intro"
					class="legal-callout"
				>
					<slot name="intro" />
				</div>
				<slot />
				<div class="legal-actions">
					<UButton
						to="/"
						label="Back to home"
						color="neutral"
						variant="outline"
					/>
					<UButton
						:to="alternateTo"
						:label="alternateLabel"
						color="primary"
						variant="soft"
					/>
				</div>
			</article>
		</div>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

export interface LegalSectionLink {
	id: string;
	title: string;
}

withDefaults(
	defineProps<{
		title: string;
		description?: string;
		updatedAt: string;
		sections?: LegalSectionLink[];
		alternateTo?: string;
		alternateLabel?: string;
	}>(),
	{
		sections: () => [],
		alternateTo: "/privacy",
		alternateLabel: "Privacy Policy",
	},
);
</script>
