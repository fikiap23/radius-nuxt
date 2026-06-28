<template>
	<section class="space-y-2">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-sm font-medium text-highlighted">
				Subtasks
			</h3>
			<span
				v-if="items.length"
				class="text-xs text-muted"
			>
				{{ doneCount }}/{{ items.length }}
			</span>
		</div>

		<ul
			v-if="items.length"
			class="space-y-1"
		>
			<li
				v-for="item in items"
				:key="item.id"
				class="flex items-center gap-2"
			>
				<UCheckbox
					:model-value="item.done"
					:aria-label="`Mark subtask ${item.title} as ${item.done ? 'incomplete' : 'done'}`"
					@update:model-value="toggle(item.id, Boolean($event))"
				/>
				<span
					class="min-w-0 flex-1 text-sm"
					:class="item.done && 'text-muted line-through'"
				>
					{{ item.title }}
				</span>
				<UButton
					icon="i-lucide-x"
					color="neutral"
					variant="ghost"
					size="xs"
					aria-label="Remove subtask"
					@click="remove(item.id)"
				/>
			</li>
		</ul>

		<div class="flex gap-2">
			<UInput
				v-model="draft"
				placeholder="Add subtask…"
				size="sm"
				class="flex-1"
				@keydown.enter.prevent="add"
			/>
			<UButton
				type="button"
				label="Add"
				size="sm"
				variant="soft"
				:disabled="!draft.trim()"
				@click="add"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { TaskSubtask } from "~/features/task/types/task";
import { createTaskChildId } from "~/features/task/utils/task";

const props = defineProps<{
	items: TaskSubtask[];
}>();

const emit = defineEmits<{
	update: [items: TaskSubtask[]];
}>();

const draft = ref("");

const doneCount = computed(() => props.items.filter(i => i.done).length);

function toggle(id: string, done: boolean) {
	emit(
		"update",
		props.items.map(i => (i.id === id ? { ...i, done } : i)),
	);
}

function remove(id: string) {
	emit(
		"update",
		props.items.filter(i => i.id !== id),
	);
}

function add() {
	const title = draft.value.trim();
	if (!title) {
		return;
	}
	emit("update", [
		...props.items,
		{ id: createTaskChildId("st"), title, done: false },
	]);
	draft.value = "";
}

function commitDraft(): TaskSubtask[] {
	const title = draft.value.trim();
	if (!title) {
		return [...props.items];
	}
	draft.value = "";
	return [
		...props.items,
		{ id: createTaskChildId("st"), title, done: false },
	];
}

defineExpose({ commitDraft });
</script>
