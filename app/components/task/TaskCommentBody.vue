<template>
	<UiRichTextContent
		v-if="isRichTextHtml(body)"
		:content="body"
		class="task-comment-body"
	/>
	<p
		v-else
		class="task-comment-body text-sm leading-relaxed text-default"
	>
		<template
			v-for="(segment, index) in segments"
			:key="index"
		>
			<span
				v-if="segment.type === 'text'"
			>{{ segment.text }}</span>
			<span
				v-else
				class="task-comment-mention"
				:title="segment.label"
			>@{{ segment.label }}</span>
		</template>
	</p>
</template>

<script setup lang="ts">
import { parseCommentBody } from "~/utils/comment";
import { isRichTextHtml } from "~/utils/rich-text";

const props = defineProps<{
	body: string;
}>();

const segments = computed(() => parseCommentBody(props.body));
</script>
