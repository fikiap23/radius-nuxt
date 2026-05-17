<template>
	<UiAppCard
		:title="title"
		:description="description"
		:icon="icon"
		padding="sm"
	>
		<template
			v-if="viewAllTo"
			#actions
		>
			<UButton
				:to="viewAllTo"
				label="View all"
				variant="ghost"
				color="neutral"
				size="xs"
				trailing-icon="i-lucide-arrow-right"
			/>
		</template>

		<div
			v-if="loading"
			class="dashboard-widget__skeleton space-y-3"
			aria-busy="true"
			:aria-label="`Loading ${title}`"
		>
			<USkeleton
				v-for="i in skeletonLines"
				:key="i"
				class="h-10 w-full rounded-lg"
				:class="i === skeletonLines && skeletonLines > 1 ? 'w-2/3' : ''"
			/>
		</div>

		<div
			v-else-if="empty"
			class="dashboard-widget__empty py-6"
		>
			<UiEmptyState
				:icon="emptyIcon"
				:title="emptyTitle"
				:description="emptyDescription"
			>
				<template
					v-if="emptyActionLabel && emptyActionTo"
					#actions
				>
					<UButton
						:to="emptyActionTo"
						:label="emptyActionLabel"
						size="sm"
						variant="soft"
					/>
				</template>
			</UiEmptyState>
		</div>

		<slot v-else />
	</UiAppCard>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
		description?: string;
		icon?: string;
		loading?: boolean;
		empty?: boolean;
		emptyIcon?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		emptyActionLabel?: string;
		emptyActionTo?: string;
		viewAllTo?: string;
		skeletonLines?: number;
	}>(),
	{
		loading: false,
		empty: false,
		emptyIcon: "i-lucide-inbox",
		emptyTitle: "Nothing here yet",
		emptyDescription: "Activity will show up once your team gets moving.",
		skeletonLines: 3,
	},
);
</script>
