<template>
	<div
		v-if="displayHtml"
		class="rich-text-content"
		v-html="displayHtml"
	/>
</template>

<script setup lang="ts">
import { enhanceRichTextCodeBlocks } from "~/features/task/utils/rich-text-highlight.client";
import { isRichTextHtml, sanitizeRichTextHtml } from "~/features/task/utils/rich-text";

const props = defineProps<{
	content: string;
}>();

const displayHtml = ref("");

watch(
	() => props.content,
	value => {
		const trimmed = value.trim();
		if (!trimmed || !isRichTextHtml(trimmed)) {
			displayHtml.value = "";
			return;
		}
		const sanitized = sanitizeRichTextHtml(trimmed);
		displayHtml.value = enhanceRichTextCodeBlocks(sanitized);
	},
	{ immediate: true },
);
</script>
