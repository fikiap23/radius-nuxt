<template>
	<header class="app-page-header">
		<h1
			v-if="title"
			class="app-page-header__title"
		>
			{{ title }}
		</h1>
		<p
			v-if="description"
			class="app-page-header__description mt-1"
		>
			{{ description }}
		</p>
	</header>
</template>

<script setup lang="ts">
const { title, description } = useAppPageMeta();
</script>
