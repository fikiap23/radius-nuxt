<template>
	<UEmpty
		:icon="icon"
		:title="title"
		:description="description"
		:ui="{
			title: 'text-highlighted font-display font-semibold',
			description: 'text-muted',
			icon: 'text-muted',
		}"
	>
		<template
			v-if="$slots.actions"
			#actions
		>
			<slot name="actions" />
		</template>
	</UEmpty>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		icon?: string;
		title: string;
		description?: string;
	}>(),
	{
		icon: "i-lucide-inbox",
	},
);
</script>
