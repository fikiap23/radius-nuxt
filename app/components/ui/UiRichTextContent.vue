<template>
	<div
		v-if="html"
		class="rich-text-content"
		v-html="safeHtml"
	/>
</template>

<script setup lang="ts">
import { isRichTextHtml, sanitizeRichTextHtml } from "~/utils/rich-text";

const props = defineProps<{
	content: string;
}>();

const html = computed(() => {
	const value = props.content.trim();
	if (!value) {
		return "";
	}
	if (!isRichTextHtml(value)) {
		return "";
	}
	return sanitizeRichTextHtml(value);
});

const safeHtml = computed(() => html.value);
</script>
