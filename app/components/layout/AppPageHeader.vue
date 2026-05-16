<template>
	<header class="app-page-header">
		<UBreadcrumb
			v-if="breadcrumbs.length > 1"
			:items="breadcrumbs"
			class="mb-2"
		/>
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
const route = useRoute();

const title = computed(() => route.meta.appTitle as string | undefined);
const description = computed(() => route.meta.appDescription as string | undefined);

const breadcrumbs = computed(() => {
	const items: { label: string; to?: string }[] = [
		{ label: "App", to: "/app" },
	];

	if (title.value && route.path !== "/app") {
		items.push({ label: title.value });
	}

	return items;
});
</script>
