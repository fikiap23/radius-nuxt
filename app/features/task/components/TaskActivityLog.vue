<template>
	<section class="space-y-2">
		<h3 class="text-sm font-medium text-highlighted">
			Activity
		</h3>

		<UiEmptyState
			v-if="entries.length === 0"
			icon="i-lucide-history"
			title="No activity yet"
			description="Changes to this task will appear here."
			class="py-6"
		/>

		<ul
			v-else
			class="space-y-3"
		>
			<li
				v-for="entry in entries"
				:key="entry.id"
				class="flex gap-3"
			>
				<div
					class="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated"
				>
					<UIcon
						:name="entry.icon"
						class="size-4 text-muted"
					/>
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-highlighted">
						{{ entry.title }}
					</p>
					<p
						v-if="entry.description"
						class="text-xs text-muted"
					>
						{{ entry.description }}
					</p>
					<p class="mt-0.5 text-[10px] text-muted">
						{{ formatActivityTime(entry.occurredAt) }}
					</p>
				</div>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import type { TaskActivityEntry } from "~/features/task/types/task";
import { formatActivityTime } from "~/features/task/utils/task";

defineProps<{
	entries: TaskActivityEntry[];
}>();
</script>
