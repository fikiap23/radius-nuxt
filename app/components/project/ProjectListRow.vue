<template>
	<NuxtLink
		:to="`/app/projects/${project.id}/list`"
		class="project-list-row group"
	>
		<ProjectCover
			:cover="project.cover"
			:cover-image-url="project.coverImageUrl"
			size="sm"
		>
			<ProjectIcon
				:icon="project.icon"
				size="sm"
				class="absolute inset-0 m-auto"
			/>
		</ProjectCover>

		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-2">
				<span class="truncate font-medium text-highlighted">
					{{ project.name }}
				</span>
				<ProjectStatusBadge
					v-if="project.status !== 'active'"
					:status="project.status"
				/>
				<UIcon
					v-if="project.isFavorite"
					name="i-lucide-star"
					class="size-3.5 shrink-0 text-warning"
					aria-label="Favorite"
				/>
			</div>
			<p class="mt-0.5 text-sm text-muted">
				{{ project.openTasks }} open · {{ project.progress }}% complete
			</p>
		</div>

		<UProgress
			:model-value="project.progress"
			size="xs"
			class="hidden w-24 sm:block"
			:aria-label="`${project.name} progress`"
		/>

		<UButton
			v-if="showFavorite"
			:icon="project.isFavorite ? 'i-lucide-star' : 'i-lucide-star'"
			:color="project.isFavorite ? 'warning' : 'neutral'"
			variant="ghost"
			size="xs"
			:aria-label="project.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
			@click.prevent="emit('toggleFavorite', project.id)"
		/>

		<UIcon
			name="i-lucide-chevron-right"
			class="size-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
			aria-hidden="true"
		/>
	</NuxtLink>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";

defineProps<{
	project: Project;
	showFavorite?: boolean;
}>();

const emit = defineEmits<{
	toggleFavorite: [projectId: string];
}>();
</script>
