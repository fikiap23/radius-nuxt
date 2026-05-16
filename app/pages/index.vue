<template>
	<div class="landing-page">
		<div
			class="landing-ambient"
			aria-hidden="true"
		>
			<div class="landing-ambient-orb landing-ambient-orb--primary" />
			<div class="landing-ambient-orb landing-ambient-orb--secondary" />
		</div>

		<!-- Hero -->
		<section class="mx-auto max-w-app px-page pt-10 pb-16 sm:pt-16 sm:pb-24 landing-section">
			<div class="landing-hero landing-hero--glow auth-in p-6 sm:p-10 lg:p-12">
				<div
					class="landing-hero__backdrop"
					aria-hidden="true"
				>
					<div class="landing-hero-glow auth-pulse-soft" />
					<div class="auth-dot-grid absolute inset-0 opacity-40" />
				</div>

				<div
					class="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:items-center"
				>
					<div class="relative z-10 min-w-0 max-w-xl space-y-6 sm:space-y-8 auth-in auth-in-delay-1">
						<div class="landing-chip">
							<span class="size-1.5 rounded-full bg-primary animate-pulse" />
							MVP — Phase 1 in progress
						</div>

						<div class="space-y-4">
							<h1 class="landing-hero-title">
								Project management
								<span class="landing-hero-title-accent">
									built for shipping
								</span>
							</h1>
							<p class="max-w-lg text-body-lg text-muted leading-relaxed">
								{{ APP_DESCRIPTION }}
							</p>
						</div>

						<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
							<UButton
								to="/auth/register"
								label="Start free"
								color="primary"
								size="lg"
								trailing-icon="i-lucide-arrow-right"
								class="font-semibold shadow-lg shadow-primary/25 justify-center"
							/>
							<UButton
								to="/auth/login"
								label="Sign in"
								color="neutral"
								variant="outline"
								size="lg"
								class="justify-center"
							/>
						</div>

						<div class="flex flex-wrap gap-2">
							<span
								v-for="chip in trustChips"
								:key="chip"
								class="rounded-full border border-muted bg-default/60 px-3 py-1 text-xs text-muted backdrop-blur-sm"
							>
								{{ chip }}
							</span>
						</div>

						<div class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:max-w-md">
							<div
								v-for="stat in stats"
								:key="stat.label"
								class="landing-stat"
							>
								<p class="font-display text-xl font-bold text-highlighted">
									{{ stat.value }}
								</p>
								<p class="text-xs text-muted">
									{{ stat.label }}
								</p>
							</div>
						</div>
					</div>

					<div class="relative z-0 w-full max-w-md justify-self-center lg:justify-self-end auth-in auth-in-delay-2">
						<div class="landing-mockup w-full">
							<div class="landing-mockup-bar">
								<span class="landing-mockup-dot bg-error/60" />
								<span class="landing-mockup-dot bg-warning/60" />
								<span class="landing-mockup-dot bg-success/60" />
								<span class="ms-auto text-xs text-muted">workspace — radius</span>
							</div>
							<div class="space-y-4 p-5 sm:p-6">
								<div class="flex items-center justify-between gap-4">
									<div class="space-y-1">
										<p class="text-xs text-muted">
											Today
										</p>
										<p class="font-display font-bold text-highlighted">
											Sprint 12 · 68% complete
										</p>
									</div>
									<UBadge
										color="success"
										variant="soft"
										label="Live"
									/>
								</div>
								<div class="landing-kanban">
									<div
										v-for="col in kanbanCols"
										:key="col.label"
										class="landing-kanban-col"
									>
										<p class="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
											{{ col.label }}
										</p>
										<div
											v-for="card in col.cards"
											:key="card"
											class="landing-kanban-card mb-1.5 text-default"
										>
											{{ card }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Logo marquee -->
		<section
			class="landing-marquee landing-section landing-reveal-delay-1"
			aria-label="Trusted by teams"
		>
			<p class="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted">
				Teams building with Radius
			</p>
			<div class="landing-marquee-track">
				<span
					v-for="(logo, i) in marqueeLogos"
					:key="`${logo}-${i}`"
					class="landing-marquee-item"
				>
					{{ logo }}
				</span>
			</div>
		</section>

		<!-- Features bento -->
		<section
			id="features"
			class="mx-auto max-w-app px-page py-20 sm:py-24 landing-section landing-reveal-delay-2"
		>
			<div class="mb-12 max-w-2xl space-y-3">
				<p class="landing-section-label">
					Features
				</p>
				<h2
					class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl text-balance"
				>
					Tasks, sprints, and teams in one place
				</h2>
				<p class="text-muted leading-relaxed">
					From kanban boards to sprint velocity — Radius covers the workflow
					startups and enterprises expect, with a UI inspired by Linear and
					Notion.
				</p>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<article
					v-for="(feature, index) in features"
					:key="feature.title"
					:class="[
						'group landing-bento-card flex flex-col gap-4',
						index === 0 && 'landing-bento-card--highlight sm:col-span-2 lg:col-span-2',
					]"
				>
					<div class="flex items-start gap-4">
						<span class="landing-feature-icon">
							<UIcon
								:name="feature.icon"
								class="size-5"
							/>
						</span>
						<div class="min-w-0 space-y-1">
							<h3 class="font-display text-lg font-bold text-highlighted">
								{{ feature.title }}
							</h3>
							<p class="text-xs font-medium text-primary">
								{{ feature.description }}
							</p>
						</div>
					</div>
					<p class="text-sm text-muted leading-relaxed">
						{{ feature.body }}
					</p>
				</article>
			</div>
		</section>

		<!-- How it works -->
		<section
			id="how-it-works"
			class="border-t border-muted bg-elevated/50 py-20 sm:py-24 landing-section"
		>
			<div class="mx-auto max-w-app px-page">
				<div class="mb-12 max-w-2xl space-y-3">
					<p class="landing-section-label">
						How it works
					</p>
					<h2
						class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl"
					>
						From workspace to shipped in three steps
					</h2>
				</div>

				<ol class="grid gap-6 md:grid-cols-3">
					<li
						v-for="(step, index) in steps"
						:key="step.title"
						class="landing-step-card"
					>
						<span class="font-display text-5xl font-extrabold text-primary/25">
							{{ String(index + 1).padStart(2, "0") }}
						</span>
						<h3 class="mt-2 font-display text-xl font-bold text-highlighted">
							{{ step.title }}
						</h3>
						<p class="mt-2 text-sm text-muted leading-relaxed">
							{{ step.description }}
						</p>
					</li>
				</ol>
			</div>
		</section>

		<!-- Testimonials -->
		<section class="mx-auto max-w-app px-page py-20 sm:py-24 landing-section">
			<div class="mb-12 text-center space-y-3">
				<p class="landing-section-label">
					Testimonials
				</p>
				<h2
					class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl"
				>
					Loved by product teams
				</h2>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<figure
					v-for="item in testimonials"
					:key="item.author"
					class="landing-testimonial"
				>
					<div class="mb-3 flex gap-0.5 text-primary">
						<UIcon
							v-for="n in 5"
							:key="n"
							name="i-lucide-star"
							class="size-4 fill-current"
						/>
					</div>
					<blockquote class="text-default leading-relaxed">
						“{{ item.quote }}”
					</blockquote>
					<figcaption class="mt-4 flex items-center gap-3">
						<span
							class="flex size-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary"
						>
							{{ item.initials }}
						</span>
						<div>
							<p class="font-medium text-highlighted">
								{{ item.author }}
							</p>
							<p class="text-sm text-muted">
								{{ item.role }}
							</p>
						</div>
					</figcaption>
				</figure>
			</div>
		</section>

		<!-- Pricing -->
		<section
			id="pricing"
			class="border-t border-muted bg-muted/20 py-20 sm:py-24 landing-section"
		>
			<div class="mx-auto max-w-app px-page">
				<div class="mb-12 mx-auto max-w-2xl text-center space-y-3">
					<p class="landing-section-label">
						Pricing
					</p>
					<h2
						class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl"
					>
						Simple plans, no surprises
					</h2>
					<p class="text-muted">
						Start free. Upgrade when your team is ready.
					</p>
				</div>

				<div class="grid gap-6 lg:grid-cols-3">
					<div
						v-for="plan in plans"
						:key="plan.name"
						:class="[
							'landing-pricing-card',
							plan.popular && 'landing-pricing-popular',
						]"
					>
						<div class="mb-6 space-y-2">
							<div class="flex items-center justify-between gap-2">
								<h3 class="font-display text-lg font-bold text-highlighted">
									{{ plan.name }}
								</h3>
								<UBadge
									v-if="plan.popular"
									label="Popular"
									color="primary"
									variant="soft"
								/>
							</div>
							<p class="text-sm text-muted">
								{{ plan.description }}
							</p>
							<p class="pt-2">
								<span
									class="font-display text-4xl font-extrabold text-highlighted"
								>{{ plan.price }}</span>
								<span
									v-if="plan.price !== 'Custom'"
									class="text-muted text-sm"
								>/mo</span>
							</p>
						</div>

						<ul class="mb-8 flex-1 space-y-2 text-sm text-muted">
							<li
								v-for="perk in plan.perks"
								:key="perk"
								class="flex items-start gap-2"
							>
								<UIcon
									name="i-lucide-check"
									class="mt-0.5 size-4 shrink-0 text-primary"
								/>
								{{ perk }}
							</li>
						</ul>

						<UButton
							:to="plan.ctaTo"
							:label="plan.cta"
							:color="plan.popular ? 'primary' : 'neutral'"
							:variant="plan.popular ? 'solid' : 'outline'"
							block
							class="font-semibold"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- FAQ -->
		<section
			id="faq"
			class="mx-auto max-w-app px-page py-20 sm:py-24 landing-section"
		>
			<div class="mb-10 max-w-2xl space-y-3">
				<p class="landing-section-label">
					FAQ
				</p>
				<h2
					class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl"
				>
					Common questions
				</h2>
			</div>
			<UAccordion
				:items="faqItems"
				type="multiple"
				class="max-w-3xl"
				:ui="{
					trigger: 'text-base font-medium text-highlighted',
					body: 'text-sm text-muted leading-relaxed',
				}"
			/>
		</section>

		<!-- Final CTA -->
		<section class="mx-auto max-w-app px-page pb-20 sm:pb-24 landing-section">
			<div class="landing-cta-panel">
				<div class="relative mx-auto max-w-xl space-y-6">
					<h2
						class="font-display text-3xl font-extrabold tracking-tight text-highlighted sm:text-4xl text-balance"
					>
						Ready to run your next sprint on Radius?
					</h2>
					<p class="text-muted">
						Create a workspace, invite your team, and start moving work across
						the board — free to begin.
					</p>
					<div class="flex flex-col justify-center gap-3 sm:flex-row">
						<UButton
							to="/auth/register"
							label="Create free account"
							color="primary"
							size="lg"
							trailing-icon="i-lucide-arrow-right"
							class="font-semibold shadow-lg shadow-primary/25"
						/>
						<UButton
							to="/auth/login"
							label="I already have an account"
							color="neutral"
							variant="ghost"
							size="lg"
						/>
					</div>
					<p class="text-xs text-muted">
						By signing up you agree to our
						<ULink
							to="/terms"
							class="text-primary hover:underline"
						>Terms</ULink>
						and
						<ULink
							to="/privacy"
							class="text-primary hover:underline"
						>Privacy Policy</ULink>.
					</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "~/config/brand";

definePageMeta({
	layout: "landing",
});

useSeoMeta({
	title: `${APP_NAME} — ${APP_TAGLINE}`,
	description: APP_DESCRIPTION,
});

const stats = [
	{ value: "5", label: "Task statuses" },
	{ value: "4", label: "Project views" },
	{ value: "∞", label: "Tasks per board" },
];

const trustChips = [
	"No credit card",
	"Free tier forever",
	"SOC2-ready roadmap",
];

const logos = ["Northline", "Patchwork", "Orbit Labs", "Framestack", "Helio", "Summit Co"];
const marqueeLogos = [...logos, ...logos];

const kanbanCols = [
	{ label: "Todo", cards: ["Mobile nav", "Docs"] },
	{ label: "Doing", cards: ["API limits"] },
	{ label: "Done", cards: ["Auth SSO"] },
];

const features = [
	{
		title: "Workspaces & roles",
		description: "Owner, Admin, Member, Viewer",
		body: "Multi-workspace support with invites and permissions. Keep every team scoped and secure.",
		icon: "i-lucide-building-2",
	},
	{
		title: "Kanban boards",
		description: "Drag, drop, ship",
		body: "Realtime boards with custom columns, WIP limits, filters, and quick-create tasks — Trello meets Linear.",
		icon: "i-lucide-kanban",
	},
	{
		title: "Sprint planning",
		description: "Goals, velocity, burndown",
		body: "Plan sprints with goals and duration. Track velocity and burndown when Phase 2 lands.",
		icon: "i-lucide-calendar-range",
	},
	{
		title: "Rich task management",
		description: "Priority, labels, subtasks",
		body: "Assignees, due dates, checklists, attachments, comments, and activity logs on every issue.",
		icon: "i-lucide-check-square",
	},
	{
		title: "Issue tracking",
		description: "Bug, feature, improvement",
		body: "Typed issues with severity, reproduction steps, and links — built for engineering teams.",
		icon: "i-lucide-bug",
	},
	{
		title: "Team collaboration",
		description: "Mentions & notifications",
		body: "Comments, @mentions, activity timelines, and in-app notifications keep everyone aligned.",
		icon: "i-lucide-users",
	},
];

const steps = [
	{
		title: "Create a workspace",
		description:
			"Sign up with email or Google/GitHub. Spin up a workspace and invite teammates in minutes.",
	},
	{
		title: "Organize projects",
		description:
			"Add projects with board, list, calendar, or timeline views. Break work into tasks and sprints.",
	},
	{
		title: "Ship with clarity",
		description:
			"Move cards across the board, track progress on the dashboard, and celebrate done.",
	},
];

const testimonials = [
	{
		quote:
			"Radius gave us one place for backlog, sprints, and standups. We stopped context-switching between three tools.",
		author: "Maya Chen",
		role: "Engineering Lead, Northline",
		initials: "MC",
	},
	{
		quote:
			"The UI is minimal but fast — our designers and devs actually agree on it. Rare for a PM tool.",
		author: "Jordan Blake",
		role: "Product Ops, Patchwork",
		initials: "JB",
	},
];

const plans = [
	{
		name: "Free",
		description: "For small teams getting started",
		price: "$0",
		popular: false,
		perks: [
			"Up to 3 workspaces",
			"Kanban & tasks",
			"Basic notifications",
			"Google & GitHub auth",
		],
		cta: "Get started",
		ctaTo: "/auth/register",
	},
	{
		name: "Pro",
		description: "For growing product teams",
		price: "$29",
		popular: true,
		perks: [
			"Unlimited projects",
			"Advanced analytics",
			"Radius AI (coming)",
			"Priority support",
		],
		cta: "Start Pro trial",
		ctaTo: "/auth/register",
	},
	{
		name: "Enterprise",
		description: "For organizations at scale",
		price: "Custom",
		popular: false,
		perks: [
			"SSO & audit log",
			"Custom branding",
			"Advanced permissions",
			"Dedicated support",
		],
		cta: "Contact sales",
		ctaTo: "/auth/register",
	},
];

const faqItems: AccordionItem[] = [
	{
		label: "Is Radius free to try?",
		content:
			"Yes. The Free plan includes workspaces, kanban boards, and core task management. Upgrade to Pro when you need advanced analytics or higher limits.",
	},
	{
		label: "Can I import from Jira or Trello?",
		content:
			"Import tools are on the roadmap for Phase 2. Until then, you can bulk-create tasks via CSV from project settings.",
	},
	{
		label: "How does workspace billing work?",
		content:
			"Billing is per workspace on paid plans. Owners manage seats and can invite admins to help with billing and members.",
	},
	{
		label: "Where is my data hosted?",
		content:
			"Production data is hosted in secure cloud regions with encryption in transit and at rest. See our Privacy Policy for details.",
	},
];
</script>
