<template>
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
</template>

<script setup lang="ts">
const kanbanCols = [
	{ label: "Todo", cards: ["Mobile nav", "Docs"] },
	{ label: "Doing", cards: ["API limits"] },
	{ label: "Done", cards: ["Auth SSO"] },
];
</script>
