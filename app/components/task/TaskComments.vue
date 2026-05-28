<template>
	<section class="space-y-3">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-sm font-medium text-highlighted">
				Comments
			</h3>
			<span
				v-if="comments.length"
				class="text-xs text-muted"
			>
				{{ comments.length }}
			</span>
		</div>

		<ul
			v-if="comments.length"
			class="space-y-4"
		>
			<li
				v-for="comment in comments"
				:key="comment.id"
			>
				<TaskCommentItem
					:comment="comment"
					:members="members"
					:can-modify="canModifyComment(comment)"
					@save="body => onUpdate(comment.id, body)"
					@delete="onDelete(comment.id)"
				/>
			</li>
		</ul>

		<UiEmptyState
			v-else
			icon="i-lucide-message-square"
			title="No comments yet"
			description="Start the thread — use @ to mention a teammate."
			class="py-4"
		/>

		<TaskCommentComposer
			ref="composerRef"
			:members="members"
			:loading="creating"
			@submit="onCreate"
		/>
	</section>
</template>

<script setup lang="ts">
import type { TaskComment } from "~/types/task";
import type { WorkspaceMember } from "~/types/workspace";

const props = defineProps<{
	taskId: string;
	comments: TaskComment[];
	members: WorkspaceMember[];
	currentAuthorId: string | null;
	currentAuthorName: string;
}>();

const {
	createComment,
	updateComment,
	deleteComment,
} = useTask();
const toast = useToast();

const composerRef = ref<{ reset: () => void } | null>(null);
const creating = ref(false);

function canModifyComment(comment: TaskComment) {
	if (!props.currentAuthorId) {
		return comment.authorId === null;
	}
	return comment.authorId === props.currentAuthorId;
}

async function onCreate(body: string) {
	creating.value = true;
	const result = await createComment(props.taskId, {
		body,
		authorId: props.currentAuthorId,
		authorName: props.currentAuthorName,
	});
	creating.value = false;

	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}

	composerRef.value?.reset();
}

async function onUpdate(commentId: string, body: string) {
	const result = await updateComment(commentId, { body });
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
	}
}

async function onDelete(commentId: string) {
	const result = await deleteComment(commentId);
	if (!result.ok) {
		toast.add({ title: result.error, color: "error" });
		return;
	}
	toast.add({
		title: "Comment deleted",
		color: "success",
		icon: "i-lucide-trash-2",
	});
}
</script>
