<template>
	<div class="space-y-6">
		<UiAppCard
			:title="title"
			:description="description"
		>
			<p class="text-sm text-muted leading-relaxed">
				<slot />
			</p>
		</UiAppCard>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	description?: string;
}>();
</script>
