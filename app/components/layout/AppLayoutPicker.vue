<template>
	<div class="space-y-4">
		<p
			v-if="showHint"
			class="text-sm text-muted"
		>
			Pilih cara sidebar dan area konten ditampilkan. Preferensi disimpan di perangkat ini.
		</p>

		<div
			class="grid gap-3 sm:grid-cols-2"
			role="radiogroup"
			:aria-label="ariaLabel"
		>
			<button
				v-for="preset in presets"
				:key="preset.id"
				type="button"
				role="radio"
				:aria-checked="layoutId === preset.id"
				class="group relative flex flex-col gap-3 rounded-xl border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				:class="
					layoutId === preset.id
						? 'border-primary bg-primary/5 ring-1 ring-primary/30'
						: 'border-muted bg-elevated hover:border-default hover:bg-accented/40'
				"
				@click="setLayout(preset.id)"
			>
				<div class="flex items-start justify-between gap-2">
					<div class="flex items-center gap-2">
						<UIcon
							:name="preset.icon"
							class="size-5 shrink-0 text-primary"
							aria-hidden="true"
						/>
						<span class="font-medium text-highlighted">
							{{ preset.label }}
						</span>
					</div>
					<UIcon
						v-if="layoutId === preset.id"
						name="i-lucide-check"
						class="size-4 shrink-0 text-primary"
						aria-hidden="true"
					/>
				</div>

				<div
					class="app-layout-preview"
					:data-preview="preset.id"
					aria-hidden="true"
				>
					<span class="app-layout-preview__sidebar" />
					<span class="app-layout-preview__header" />
					<span class="app-layout-preview__content" />
				</div>

				<p class="text-xs leading-relaxed text-muted">
					{{ preset.description }}
				</p>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		showHint?: boolean;
		ariaLabel?: string;
	}>(),
	{
		showHint: true,
		ariaLabel: "App layout",
	},
);

const { layoutId, presets, setLayout } = useAppLayout();
</script>

<style scoped>
.app-layout-preview {
	display: grid;
	height: 3.5rem;
	gap: 0.25rem;
	padding: 0.35rem;
	border-radius: 0.5rem;
	background: var(--ui-bg-muted);
	border: 1px solid var(--ui-border-muted);
}

.app-layout-preview__sidebar,
.app-layout-preview__header,
.app-layout-preview__content {
	border-radius: 0.2rem;
	background: color-mix(in oklab, var(--ui-color-primary-500) 35%, var(--ui-bg-elevated));
}

.app-layout-preview[data-preview="classic"] {
	grid-template-columns: 1.1fr 2.4fr;
	grid-template-rows: 0.55fr 1fr;
}

.app-layout-preview[data-preview="classic"] .app-layout-preview__sidebar {
	grid-row: 1 / -1;
}

.app-layout-preview[data-preview="classic"] .app-layout-preview__header {
	grid-column: 2;
}

.app-layout-preview[data-preview="classic"] .app-layout-preview__content {
	grid-column: 2;
}

.app-layout-preview[data-preview="compact"] {
	grid-template-columns: 0.75fr 2.6fr;
	grid-template-rows: 0.5fr 1fr;
}

.app-layout-preview[data-preview="compact"] .app-layout-preview__sidebar {
	grid-row: 1 / -1;
}

.app-layout-preview[data-preview="compact"] .app-layout-preview__header {
	grid-column: 2;
}

.app-layout-preview[data-preview="compact"] .app-layout-preview__content {
	grid-column: 2;
}

.app-layout-preview[data-preview="wide"] {
	grid-template-columns: 0.9fr 2.5fr;
	grid-template-rows: 0.45fr 1fr;
}

.app-layout-preview[data-preview="wide"] .app-layout-preview__sidebar {
	grid-row: 1 / -1;
}

.app-layout-preview[data-preview="wide"] .app-layout-preview__header {
	grid-column: 2;
}

.app-layout-preview[data-preview="wide"] .app-layout-preview__content {
	grid-column: 2;
	width: 100%;
}

.app-layout-preview[data-preview="top-nav"] {
	grid-template-rows: 0.65fr 1fr;
}

.app-layout-preview[data-preview="top-nav"] .app-layout-preview__sidebar {
	display: none;
}

.app-layout-preview[data-preview="top-nav"] .app-layout-preview__header {
	grid-column: 1 / -1;
}

.app-layout-preview[data-preview="inset"] {
	grid-template-columns: 1fr 2.2fr;
	grid-template-rows: 0.5fr 1fr;
	padding: 0.5rem;
}

.app-layout-preview[data-preview="inset"] .app-layout-preview__sidebar {
	grid-row: 1 / -1;
}

.app-layout-preview[data-preview="inset"] .app-layout-preview__header {
	grid-column: 2;
}

.app-layout-preview[data-preview="inset"] .app-layout-preview__content {
	grid-column: 2;
	margin: 0.15rem;
	box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ui-border-muted) 80%, transparent);
}
</style>
