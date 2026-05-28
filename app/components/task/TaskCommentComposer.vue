<template>
	<div class="task-comment-composer relative space-y-2">
		<textarea
			ref="textareaEl"
			v-model="body"
			:placeholder="placeholder"
			:rows="rows"
			:disabled="disabled"
			class="task-comment-composer__input w-full"
			@input="onInput"
			@keydown="onKeydown"
			@click="syncMentionState"
		/>

		<div
			v-if="mentionOpen && filteredMembers.length"
			class="task-comment-mention-menu"
			role="listbox"
			aria-label="Mention a teammate"
		>
			<button
				v-for="(member, index) in filteredMembers"
				:key="member.id"
				type="button"
				class="task-comment-mention-menu__item"
				:class="index === mentionHighlight && 'task-comment-mention-menu__item--active'"
				role="option"
				:aria-selected="index === mentionHighlight"
				@click="selectMention(member)"
			>
				<span class="font-medium text-highlighted">{{ member.name }}</span>
				<span class="text-xs text-muted">{{ member.email }}</span>
			</button>
		</div>

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
				:disabled="disabled || !body.trim()"
				@click="submit"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { WorkspaceMember } from "~/types/workspace";
import { getActiveMentionQuery, insertMentionToken } from "~/utils/comment";

const props = withDefaults(
	defineProps<{
		members: WorkspaceMember[];
		placeholder?: string;
		submitLabel?: string;
		cancelLabel?: string | null;
		loading?: boolean;
		disabled?: boolean;
		rows?: number;
		showActions?: boolean;
		initialBody?: string;
	}>(),
	{
		placeholder: "Write a comment… Use @ to mention someone",
		submitLabel: "Comment",
		cancelLabel: null,
		loading: false,
		disabled: false,
		rows: 3,
		showActions: true,
		initialBody: "",
	},
);

const emit = defineEmits<{
	submit: [body: string];
	cancel: [];
}>();

const body = ref(props.initialBody);
const textareaEl = ref<HTMLTextAreaElement | null>(null);
const mentionOpen = ref(false);
const mentionQuery = ref("");
const mentionHighlight = ref(0);
const cursorPos = ref(0);

const filteredMembers = computed(() => {
	const q = mentionQuery.value.trim().toLowerCase();
	const active = props.members.filter(m => m.status === "active");
	if (!q) {
		return active.slice(0, 8);
	}
	return active
		.filter(
			m =>
				m.name.toLowerCase().includes(q)
				|| m.email.toLowerCase().includes(q),
		)
		.slice(0, 8);
});

watch(
	() => props.initialBody,
	value => {
		body.value = value;
	},
);

function syncMentionState() {
	const el = textareaEl.value;
	const pos = el?.selectionStart ?? body.value.length;
	cursorPos.value = pos;
	const query = getActiveMentionQuery(body.value, pos);
	if (query === null) {
		mentionOpen.value = false;
		mentionQuery.value = "";
		return;
	}
	mentionOpen.value = true;
	mentionQuery.value = query;
	mentionHighlight.value = 0;
}

function onInput() {
	syncMentionState();
}

function selectMention(member: WorkspaceMember) {
	const result = insertMentionToken(body.value, cursorPos.value, member);
	body.value = result.body;
	mentionOpen.value = false;
	mentionQuery.value = "";
	nextTick(() => {
		const el = textareaEl.value;
		if (el) {
			el.focus();
			el.setSelectionRange(result.cursor, result.cursor);
		}
	});
}

function onKeydown(event: KeyboardEvent) {
	if (!mentionOpen.value || !filteredMembers.value.length) {
		if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			submit();
		}
		return;
	}

	if (event.key === "ArrowDown") {
		event.preventDefault();
		mentionHighlight.value =
			(mentionHighlight.value + 1) % filteredMembers.value.length;
		return;
	}

	if (event.key === "ArrowUp") {
		event.preventDefault();
		mentionHighlight.value =
			(mentionHighlight.value - 1 + filteredMembers.value.length)
			% filteredMembers.value.length;
		return;
	}

	if (event.key === "Enter" || event.key === "Tab") {
		event.preventDefault();
		const member = filteredMembers.value[mentionHighlight.value];
		if (member) {
			selectMention(member);
		}
		return;
	}

	if (event.key === "Escape") {
		event.preventDefault();
		mentionOpen.value = false;
	}
}

function submit() {
	const trimmed = body.value.trim();
	if (!trimmed) {
		return;
	}
	emit("submit", trimmed);
	if (!props.cancelLabel) {
		body.value = "";
	}
	mentionOpen.value = false;
}

defineExpose({
	reset: () => {
		body.value = "";
		mentionOpen.value = false;
	},
});
</script>
