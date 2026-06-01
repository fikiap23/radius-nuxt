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
			<div class="rich-text-editor__toolbar-group">
				<UDropdownMenu
					:items="styleMenuItems"
					:content="{ align: 'start' }"
					:modal="false"
				>
					<UButton
						icon="i-lucide-type"
						:aria-label="`Text style: ${styleLabel}`"
						color="neutral"
						variant="ghost"
						size="xs"
						square
						:disabled="disabled"
						class="rich-text-editor__icon-btn"
					/>
				</UDropdownMenu>
			</div>

			<span
				class="rich-text-editor__toolbar-sep"
				aria-hidden="true"
			/>

			<div class="rich-text-editor__toolbar-group">
				<UButton
					icon="i-lucide-bold"
					aria-label="Bold"
					color="neutral"
					:variant="isActive('bold') ? 'soft' : 'ghost'"
					size="xs"
					square
					:disabled="disabled"
					class="rich-text-editor__icon-btn"
					@click="run('bold')"
				/>
				<UButton
					icon="i-lucide-italic"
					aria-label="Italic"
					color="neutral"
					:variant="isActive('italic') ? 'soft' : 'ghost'"
					size="xs"
					square
					:disabled="disabled"
					class="rich-text-editor__icon-btn"
					@click="run('italic')"
				/>

				<UDropdownMenu
					:items="moreMenuItems"
					:content="{ align: 'start' }"
					:modal="false"
				>
					<UButton
						icon="i-lucide-ellipsis"
						aria-label="More formatting"
						color="neutral"
						variant="ghost"
						size="xs"
						square
						:disabled="disabled"
						class="rich-text-editor__icon-btn"
					/>
				</UDropdownMenu>
			</div>

			<span
				class="rich-text-editor__toolbar-sep"
				aria-hidden="true"
			/>

			<div class="rich-text-editor__toolbar-group">
				<UDropdownMenu
					:items="listMenuItems"
					:content="{ align: 'start' }"
					:modal="false"
				>
					<UButton
						icon="i-lucide-list"
						aria-label="Lists"
						color="neutral"
						:variant="listActive ? 'soft' : 'ghost'"
						size="xs"
						square
						:disabled="disabled"
						class="rich-text-editor__icon-btn"
					/>
				</UDropdownMenu>

				<UButton
					icon="i-lucide-link"
					aria-label="Link"
					color="neutral"
					:variant="isActive('link') ? 'soft' : 'ghost'"
					size="xs"
					square
					:disabled="disabled"
					class="rich-text-editor__icon-btn"
					@click="toggleLink"
				/>

				<UDropdownMenu
					v-if="variant === 'default'"
					:items="insertMenuItems"
					:content="{ align: 'start' }"
					:modal="false"
				>
					<UButton
						icon="i-lucide-plus"
						aria-label="Insert"
						color="neutral"
						variant="ghost"
						size="xs"
						square
						:disabled="disabled"
						class="rich-text-editor__icon-btn"
					/>
				</UDropdownMenu>
			</div>
		</div>

		<EditorContent
			:editor="editor"
			class="rich-text-editor__content"
		/>

		<button
			v-if="showHelp && variant === 'default'"
			type="button"
			class="rich-text-editor__footer"
			:disabled="disabled"
			@click="helpOpen = true"
		>
			Formatting help
		</button>

		<RichTextFormattingHelp v-model:open="helpOpen" />
	</div>
</template>

<script setup lang="ts">
import type { Extensions } from "@tiptap/core";
import type { DropdownMenuItem } from "@nuxt/ui";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import type { RichTextActionName } from "~/composables/useRichTextEditorActions";
import {
	currentTextStyleLabel,
	isRichTextActionActive,
	isRichTextActionDisabled,
	runRichTextAction,
} from "~/composables/useRichTextEditorActions";
import type { WorkspaceMember } from "~/types/workspace";
import { createRichTextCodeBlockExtension } from "~/utils/rich-text-lowlight";
import { RichTextTrelloKeymap } from "~/utils/rich-text-keymap";
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
		showHelp?: boolean;
	}>(),
	{
		placeholder: "Write something…",
		variant: "default",
		disabled: false,
		mentionMembers: () => [],
		minHeight: "7rem",
		showHelp: true,
	},
);

const helpOpen = ref(false);

const mentionSuggestion = useTipTapMentionSuggestion(
	() => props.mentionMembers,
);

const fullHeadings = computed(() => props.variant === "default");

function buildExtensions(): Extensions {
	const isDefault = props.variant === "default";

	const extensions: Extensions = [
		StarterKit.configure({
			heading: { levels: isDefault ? [1, 2, 3, 4, 5, 6] : [3] },
			blockquote: isDefault ? {} : false,
			code: {
				HTMLAttributes: { class: "rich-text-inline-code" },
			},
			codeBlock: false,
			horizontalRule: isDefault ? {} : false,
		}),
		...(isDefault ? [createRichTextCodeBlockExtension()] : []),
		Underline,
		Placeholder.configure({
			placeholder: props.placeholder,
		}),
		Link.configure({
			openOnClick: false,
			autolink: true,
			linkOnPaste: true,
			HTMLAttributes: {
				class: "rich-text-content__link",
				rel: "noopener noreferrer",
				target: "_blank",
			},
		}),
		RichTextTrelloKeymap,
	];

	if (props.mentionMembers.length > 0) {
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
	onSelectionUpdate: () => {
		selectionTick.value += 1;
	},
	onTransaction: () => {
		selectionTick.value += 1;
	},
});

/** Bump to refresh active style label in toolbar */
const selectionTick = ref(0);

const styleLabel = computed(() => {
	selectionTick.value;
	if (!editor.value) {
		return "Normal text";
	}
	return currentTextStyleLabel(editor.value, fullHeadings.value);
});

const listActive = computed(() => {
	selectionTick.value;
	return (
		isActive("bullet")
		|| isActive("ordered")
	);
});

function isActive(name: RichTextActionName) {
	if (!editor.value) {
		return false;
	}
	return isRichTextActionActive(editor.value, name);
}

function run(name: RichTextActionName) {
	if (!editor.value) {
		return;
	}
	runRichTextAction(editor.value, name);
}

function menuItem(
	label: string,
	action: RichTextActionName,
	options?: { kbds?: string[]; disabled?: boolean },
): DropdownMenuItem {
	return {
		label,
		type: "checkbox",
		checked: isActive(action),
		kbds: options?.kbds,
		disabled: options?.disabled,
		onSelect: () => run(action),
	};
}

const styleMenuItems = computed((): DropdownMenuItem[][] => {
	selectionTick.value;

	const items: DropdownMenuItem[] = [
		menuItem("Normal text", "paragraph", { kbds: ["Ctrl", "Alt", "0"] }),
	];

	if (fullHeadings.value) {
		items.push(
			menuItem("Heading 1", "h1", { kbds: ["Ctrl", "Alt", "1"] }),
			menuItem("Heading 2", "h2", { kbds: ["Ctrl", "Alt", "2"] }),
			menuItem("Heading 3", "h3", { kbds: ["Ctrl", "Alt", "3"] }),
			menuItem("Heading 4", "h4", { kbds: ["Ctrl", "Alt", "4"] }),
			menuItem("Heading 5", "h5", { kbds: ["Ctrl", "Alt", "5"] }),
			menuItem("Heading 6", "h6", { kbds: ["Ctrl", "Alt", "6"] }),
		);
	}
	else {
		items.push(
			menuItem("Small heading", "h3", { kbds: ["Ctrl", "Alt", "3"] }),
		);
	}

	return [items];
});

const moreMenuItems = computed((): DropdownMenuItem[][] => {
	const row: DropdownMenuItem[] = [
		menuItem("Underline", "underline", { kbds: ["Ctrl", "U"] }),
		menuItem("Strikethrough", "strike", { kbds: ["Ctrl", "Shift", "S"] }),
		menuItem("Inline code", "code", { kbds: ["Ctrl", "E"] }),
	];

	if (fullHeadings.value) {
		row.push(
			menuItem("Quote", "quote"),
			menuItem("Code block", "codeBlock"),
			menuItem("Divider", "hr"),
		);
	}

	row.push(
		{
			label: "Remove link",
			icon: "i-lucide-unlink",
			disabled: !editor.value || isRichTextActionDisabled(editor.value, "unlink"),
			onSelect: () => run("unlink"),
		},
		{
			label: "Clear formatting",
			icon: "i-lucide-remove-formatting",
			onSelect: () => run("clear"),
		},
	);

	return [row];
});

const listMenuItems = computed((): DropdownMenuItem[][] => {
	selectionTick.value;
	return [
		[
			menuItem("Bullet list", "bullet", { kbds: ["Ctrl", "Shift", "8"] }),
			menuItem("Numbered list", "ordered", { kbds: ["Ctrl", "Shift", "7"] }),
		],
	];
});

const codeBlockLanguages = [
	{ label: "Auto-detect", lang: "" },
	{ label: "TypeScript", lang: "typescript" },
	{ label: "JavaScript", lang: "javascript" },
	{ label: "JSON", lang: "json" },
	{ label: "CSS", lang: "css" },
	{ label: "HTML", lang: "xml" },
	{ label: "Bash", lang: "bash" },
] as const;

function insertCodeBlock(language: string) {
	if (!editor.value) {
		return;
	}
	const chain = editor.value.chain().focus();
	if (editor.value.isActive("codeBlock")) {
		chain.updateAttributes("codeBlock", {
			language: language || null,
		}).run();
	}
	else {
		chain.setCodeBlock({ language: language || undefined }).run();
	}
}

const insertMenuItems = computed((): DropdownMenuItem[][] => [
	[
		menuItem("Quote", "quote"),
		menuItem("Divider", "hr"),
		{
			label: "Code block",
			icon: "i-lucide-code-xml",
			children: [
				codeBlockLanguages.map(({ label, lang }) => ({
					label,
					onSelect: () => insertCodeBlock(lang),
				})),
			],
		},
	],
]);

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
	const previous = editor.value.getAttributes("link").href as string | undefined;
	const href = window.prompt("Link URL", previous ?? "https://");
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
