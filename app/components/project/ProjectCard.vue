<template>
	<NuxtLink
		:to="`/app/projects/${project.id}/list`"
		class="project-card app-card app-card--surface app-card--interactive group block overflow-hidden no-underline"
	>
		<ProjectCover
			:cover="project.cover"
			:cover-image-url="project.coverImageUrl"
			size="banner"
			rounded="none"
			class="relative"
		>
			<div class="project-card__cover-inner">
				<ProjectIcon
					:icon="project.icon"
					size="md"
					class="project-card__icon"
				/>
				<UButton
					v-if="showFavorite"
					:icon="project.isFavorite ? 'i-lucide-star' : 'i-lucide-star'"
					:color="project.isFavorite ? 'warning' : 'neutral'"
					:variant="project.isFavorite ? 'soft' : 'ghost'"
					size="xs"
					class="project-card__favorite"
					:aria-label="project.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
					@click.prevent="onToggleFavorite"
				/>
			</div>
		</ProjectCover>

		<div class="space-y-3 p-4">
			<div class="flex flex-wrap items-start justify-between gap-2">
				<h2 class="truncate font-display text-base font-bold text-highlighted">
					{{ project.name }}
				</h2>
				<ProjectStatusBadge
					v-if="project.status !== 'active'"
					:status="project.status"
				/>
			</div>

			<p class="text-sm text-muted">
				{{ project.openTasks }} open · {{ project.progress }}% complete
			</p>

			<UProgress
				:model-value="project.progress"
				size="xs"
				:aria-label="`${project.name} progress`"
			/>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";

const props = defineProps<{
	project: Project;
	showFavorite?: boolean;
}>();

const emit = defineEmits<{
	toggleFavorite: [projectId: string];
}>();

function onToggleFavorite() {
	emit("toggleFavorite", props.project.id);
}
</script>
