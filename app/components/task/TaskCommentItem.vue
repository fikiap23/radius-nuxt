<template>
	<article class="task-comment">
		<div class="task-comment__avatar">
			<UAvatar
				:alt="comment.authorName"
				size="sm"
				:text="initials"
			/>
		</div>

		<div class="min-w-0 flex-1 space-y-2">
			<div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
				<span class="text-sm font-medium text-highlighted">
					{{ comment.authorName }}
				</span>
				<span class="text-[10px] text-muted">
					{{ timeLabel }}
					<template v-if="edited">
						· edited
					</template>
				</span>
			</div>

			<TaskCommentComposer
				v-if="editing"
				:members="members"
				:initial-body="comment.body"
				submit-label="Save"
				cancel-label="Cancel"
				:rows="3"
				@submit="onSave"
				@cancel="editing = false"
			/>
			<TaskCommentBody
				v-else
				:body="comment.body"
			/>

			<div
				v-if="!editing && canModify"
				class="flex gap-1"
			>
				<UButton
					label="Edit"
					icon="i-lucide-pencil"
					color="neutral"
					variant="ghost"
					size="xs"
					@click="editing = true"
				/>
				<UButton
					label="Delete"
					icon="i-lucide-trash-2"
					color="error"
					variant="ghost"
					size="xs"
					:loading="deleting"
					@click="onDelete"
				/>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import type { TaskComment } from "~/types/task";
import type { WorkspaceMember } from "~/types/workspace";
import { formatActivityTime } from "~/utils/task";

const props = defineProps<{
	comment: TaskComment;
	members: WorkspaceMember[];
	canModify: boolean;
}>();

const emit = defineEmits<{
	save: [body: string];
	delete: [];
}>();

const editing = ref(false);
const deleting = ref(false);

const initials = computed(() =>
	props.comment.authorName
		.split(/\s+/)
		.map(part => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase(),
);

const timeLabel = computed(() => formatActivityTime(props.comment.createdAt));

const edited = computed(
	() => props.comment.updatedAt !== props.comment.createdAt,
);

watch(
	() => props.comment.updatedAt,
	() => {
		editing.value = false;
	},
);

function onSave(body: string) {
	emit("save", body);
}

async function onDelete() {
	deleting.value = true;
	emit("delete");
	deleting.value = false;
}
</script>
