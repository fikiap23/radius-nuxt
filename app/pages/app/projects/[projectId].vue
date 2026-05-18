<template>
	<div class="app-page app-page--wide">
		<ProjectShell :project-id="projectId">
			<NuxtPage />
		</ProjectShell>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "app",
	middleware: "auth",
});

const route = useRoute();
const projectId = computed(() => route.params.projectId as string);
</script>
