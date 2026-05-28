<template>
	<section class="space-y-2">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-sm font-medium text-highlighted">
				Checklist
			</h3>
			<span
				v-if="items.length"
				class="text-xs text-muted"
			>
				{{ checkedCount }}/{{ items.length }}
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
					:model-value="item.checked"
					:aria-label="`Check ${item.text}`"
					@update:model-value="toggle(item.id, Boolean($event))"
				/>
				<span
					class="min-w-0 flex-1 text-sm"
					:class="item.checked && 'text-muted line-through'"
				>
					{{ item.text }}
				</span>
				<UButton
					icon="i-lucide-x"
					color="neutral"
					variant="ghost"
					size="xs"
					aria-label="Remove checklist item"
					@click="remove(item.id)"
				/>
			</li>
		</ul>

		<div class="flex gap-2">
			<UInput
				v-model="draft"
				placeholder="Add checklist item…"
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
import type { TaskChecklistItem } from "~/types/task";
import { createTaskChildId } from "~/utils/task";

const props = defineProps<{
	items: TaskChecklistItem[];
}>();

const emit = defineEmits<{
	update: [items: TaskChecklistItem[]];
}>();

const draft = ref("");

const checkedCount = computed(() => props.items.filter(i => i.checked).length);

function toggle(id: string, checked: boolean) {
	emit(
		"update",
		props.items.map(i => (i.id === id ? { ...i, checked } : i)),
	);
}

function remove(id: string) {
	emit(
		"update",
		props.items.filter(i => i.id !== id),
	);
}

function add() {
	const text = draft.value.trim();
	if (!text) {
		return;
	}
	emit("update", [
		...props.items,
		{ id: createTaskChildId("cl"), text, checked: false },
	]);
	draft.value = "";
}
</script>
