<template>
	<header
		v-if="title || description || $slots.default"
		class="app-page-intro"
	>
		<div class="space-y-1">
			<p
				v-if="eyebrow"
				class="app-page-intro__eyebrow"
			>
				{{ eyebrow }}
			</p>
			<h1
				v-if="title"
				class="app-page-intro__title"
			>
				{{ title }}
			</h1>
			<p
				v-if="description"
				class="app-page-intro__description"
			>
				{{ description }}
			</p>
		</div>
		<div
			v-if="$slots.default"
			class="shrink-0"
		>
			<slot />
		</div>
	</header>
</template>

<script setup lang="ts">
defineProps<{
	eyebrow?: string;
	title?: string;
	description?: string;
}>();
</script>
