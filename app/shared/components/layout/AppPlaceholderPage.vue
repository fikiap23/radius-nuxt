<template>
	<div class="app-page space-y-6">
		<UiAppPageIntro
			:title="title"
			:description="description"
		/>

		<div
			class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted bg-muted/15 px-6 py-14 text-center"
		>
			<span
				class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
				aria-hidden="true"
			>
				<UIcon
					:name="icon"
					class="size-7"
				/>
			</span>
			<p class="max-w-md text-sm leading-relaxed text-toned">
				<slot />
			</p>
			<UButton
				v-if="actionTo"
				:to="actionTo"
				:label="actionLabel"
				class="mt-6"
				variant="soft"
				size="sm"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
		description?: string;
		icon?: string;
		actionTo?: string;
		actionLabel?: string;
	}>(),
	{
		icon: "i-lucide-construction",
		actionLabel: "Back to dashboard",
		actionTo: "/app",
	},
);
</script>
