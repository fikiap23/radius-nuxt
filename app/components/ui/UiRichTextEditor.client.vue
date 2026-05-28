<template>
	<div
		class="rich-text-editor"
		:class="[
			variant === 'compact' && 'rich-text-editor--compact',
			disabled && 'rich-text-editor--disabled',
		]"
	>
		<div
			v-if="editor"
			class="rich-text-editor__toolbar"
			role="toolbar"
			aria-label="Formatting"
		>
			<UButton
				v-for="action in toolbarActions"
				:key="action.name"
				:icon="action.icon"
				:color="action.active?.() ? 'primary' : 'neutral'"
				:variant="action.active?.() ? 'soft' : 'ghost'"
				size="xs"
				:disabled="disabled"
				:aria-label="action.label"
				:aria-pressed="action.active?.()"
				@click="action.run()"
			/>
			<UButton
				v-if="showLink"
				icon="i-lucide-link"
				:color="editor.isActive('link') ? 'primary' : 'neutral'"
				:variant="editor.isActive('link') ? 'soft' : 'ghost'"
				size="xs"
				:disabled="disabled"
				aria-label="Link"
				@click="toggleLink"
			/>
		</div>

		<EditorContent
			:editor="editor"
			class="rich-text-editor__content"
		/>
	</div>
</template>

<script setup lang="ts">
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import type { WorkspaceMember } from "~/types/workspace";
import {
	emptyRichTextDocument,
	isRichTextEmpty,
	sanitizeRichTextHtml,
} from "~/utils/rich-text";

const model = defineModel<string>({ default: "" });

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		variant?: "default" | "compact";
		disabled?: boolean;
		mentionMembers?: WorkspaceMember[];
		minHeight?: string;
	}>(),
	{
		placeholder: "Write something…",
		variant: "default",
		disabled: false,
		mentionMembers: () => [],
		minHeight: "7rem",
	},
);

const mentionSuggestion = props.mentionMembers.length > 0
	? useTipTapMentionSuggestion(() => props.mentionMembers)
	: null;

const showLink = computed(() => props.variant === "default");

function buildExtensions() {
	const extensions = [
		StarterKit.configure({
			heading: props.variant === "default" ? { levels: [2, 3] } : false,
			blockquote: props.variant === "default",
			codeBlock: props.variant === "default",
		}),
		Placeholder.configure({
			placeholder: props.placeholder,
		}),
		Link.configure({
			openOnClick: false,
			HTMLAttributes: {
				class: "rich-text-content__link",
				rel: "noopener noreferrer",
				target: "_blank",
			},
		}),
	];

	if (mentionSuggestion?.value) {
		extensions.push(
			Mention.configure({
				HTMLAttributes: {
					class: "rich-text-mention",
				},
				renderHTML({ node }) {
					return [
						"span",
						{
							class: "rich-text-mention",
							"data-mention-id": node.attrs.id,
							"data-mention-label": node.attrs.label,
						},
						`@${node.attrs.label ?? node.attrs.id}`,
					];
				},
				suggestion: mentionSuggestion.value,
			}),
		);
	}

	return extensions;
}

const editor = useEditor({
	extensions: buildExtensions(),
	content: model.value || emptyRichTextDocument(),
	editable: !props.disabled,
	editorProps: {
		attributes: {
			class: "rich-text-editor__prose focus:outline-none",
			style: `min-height: ${props.minHeight}`,
		},
	},
	onUpdate: ({ editor: instance }) => {
		const html = sanitizeRichTextHtml(instance.getHTML());
		model.value = isRichTextEmpty(html) ? "" : html;
	},
});

const toolbarActions = computed(() => {
	const actions = [
		{
			name: "bold",
			label: "Bold",
			icon: "i-lucide-bold",
			run: () => editor.value?.chain().focus().toggleBold().run(),
			active: () => editor.value?.isActive("bold") ?? false,
		},
		{
			name: "italic",
			label: "Italic",
			icon: "i-lucide-italic",
			run: () => editor.value?.chain().focus().toggleItalic().run(),
			active: () => editor.value?.isActive("italic") ?? false,
		},
	];

	if (props.variant === "default") {
		actions.push(
			{
				name: "strike",
				label: "Strikethrough",
				icon: "i-lucide-strikethrough",
				run: () => editor.value?.chain().focus().toggleStrike().run(),
				active: () => editor.value?.isActive("strike") ?? false,
			},
			{
				name: "h2",
				label: "Heading",
				icon: "i-lucide-heading-2",
				run: () =>
					editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
				active: () => editor.value?.isActive("heading", { level: 2 }) ?? false,
			},
			{
				name: "bullet",
				label: "Bullet list",
				icon: "i-lucide-list",
				run: () => editor.value?.chain().focus().toggleBulletList().run(),
				active: () => editor.value?.isActive("bulletList") ?? false,
			},
			{
				name: "ordered",
				label: "Numbered list",
				icon: "i-lucide-list-ordered",
				run: () => editor.value?.chain().focus().toggleOrderedList().run(),
				active: () => editor.value?.isActive("orderedList") ?? false,
			},
			{
				name: "quote",
				label: "Quote",
				icon: "i-lucide-text-quote",
				run: () => editor.value?.chain().focus().toggleBlockquote().run(),
				active: () => editor.value?.isActive("blockquote") ?? false,
			},
		);
	}
	else {
		actions.push({
			name: "bullet",
			label: "Bullet list",
			icon: "i-lucide-list",
			run: () => editor.value?.chain().focus().toggleBulletList().run(),
			active: () => editor.value?.isActive("bulletList") ?? false,
		});
	}

	return actions;
});

watch(
	() => model.value,
	value => {
		if (!editor.value) {
			return;
		}
		const current = editor.value.getHTML();
		const next = value || emptyRichTextDocument();
		if (current !== next) {
			editor.value.commands.setContent(next, { emitUpdate: false });
		}
	},
);

watch(
	() => props.disabled,
	disabled => {
		editor.value?.setEditable(!disabled);
	},
);

function toggleLink() {
	if (!editor.value) {
		return;
	}
	if (editor.value.isActive("link")) {
		editor.value.chain().focus().unsetLink().run();
		return;
	}
	const href = window.prompt("Link URL");
	if (!href?.trim()) {
		return;
	}
	editor.value
		.chain()
		.focus()
		.extendMarkRange("link")
		.setLink({ href: href.trim() })
		.run();
}

onBeforeUnmount(() => {
	editor.value?.destroy();
});

defineExpose({
	focus: () => editor.value?.commands.focus(),
	clear: () => {
		model.value = "";
		editor.value?.commands.setContent(emptyRichTextDocument(), {
			emitUpdate: false,
		});
	},
});
</script>
