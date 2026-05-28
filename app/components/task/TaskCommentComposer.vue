<template>
	<div class="task-comment-composer space-y-2">
		<ClientOnly>
			<UiRichTextEditor
				ref="editorRef"
				v-model="body"
				variant="compact"
				:placeholder="placeholder"
				:disabled="disabled"
				:mention-members="members"
				:show-help="false"
				min-height="5.5rem"
			/>
		</ClientOnly>

		<div
			v-if="showActions"
			class="flex justify-end gap-2"
		>
			<UButton
				v-if="cancelLabel"
				type="button"
				:label="cancelLabel"
				color="neutral"
				variant="ghost"
				size="sm"
				:disabled="disabled"
				@click="emit('cancel')"
			/>
			<UButton
				type="button"
				:label="submitLabel"
				icon="i-lucide-send"
				size="sm"
				:loading="loading"
				:disabled="disabled || isRichTextEmpty(body)"
				@click="submit"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { WorkspaceMember } from "~/types/workspace";
import { isRichTextEmpty } from "~/utils/rich-text";

const props = withDefaults(
	defineProps<{
		members: WorkspaceMember[];
		placeholder?: string;
		submitLabel?: string;
		cancelLabel?: string | null;
		loading?: boolean;
		disabled?: boolean;
		showActions?: boolean;
		initialBody?: string;
	}>(),
	{
		placeholder: "Write a comment… Use @ to mention someone",
		submitLabel: "Comment",
		cancelLabel: null,
		loading: false,
		disabled: false,
		showActions: true,
		initialBody: "",
	},
);

const emit = defineEmits<{
	submit: [body: string];
	cancel: [];
}>();

const body = ref(props.initialBody);
const editorRef = ref<{ clear: () => void } | null>(null);

watch(
	() => props.initialBody,
	value => {
		body.value = value;
	},
);

function submit() {
	const trimmed = body.value.trim();
	if (isRichTextEmpty(trimmed)) {
		return;
	}
	emit("submit", trimmed);
	if (!props.cancelLabel) {
		body.value = "";
		editorRef.value?.clear();
	}
}

defineExpose({
	reset: () => {
		body.value = "";
		editorRef.value?.clear();
	},
});
</script>
