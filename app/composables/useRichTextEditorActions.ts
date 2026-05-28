import type { Editor } from "@tiptap/vue-3";

export type RichTextActionName =
	| "undo"
	| "redo"
	| "paragraph"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "bold"
	| "italic"
	| "underline"
	| "strike"
	| "code"
	| "bullet"
	| "ordered"
	| "quote"
	| "codeBlock"
	| "hr"
	| "link"
	| "unlink"
	| "clear";

export function runRichTextAction(editor: Editor, name: RichTextActionName) {
	const chain = editor.chain().focus();

	switch (name) {
		case "undo":
			chain.undo().run();
			break;
		case "redo":
			chain.redo().run();
			break;
		case "paragraph":
			chain.setParagraph().run();
			break;
		case "h1":
			chain.toggleHeading({ level: 1 }).run();
			break;
		case "h2":
			chain.toggleHeading({ level: 2 }).run();
			break;
		case "h3":
			chain.toggleHeading({ level: 3 }).run();
			break;
		case "h4":
			chain.toggleHeading({ level: 4 }).run();
			break;
		case "h5":
			chain.toggleHeading({ level: 5 }).run();
			break;
		case "h6":
			chain.toggleHeading({ level: 6 }).run();
			break;
		case "bold":
			chain.toggleBold().run();
			break;
		case "italic":
			chain.toggleItalic().run();
			break;
		case "underline":
			chain.toggleUnderline().run();
			break;
		case "strike":
			chain.toggleStrike().run();
			break;
		case "code":
			chain.toggleCode().run();
			break;
		case "bullet":
			chain.toggleBulletList().run();
			break;
		case "ordered":
			chain.toggleOrderedList().run();
			break;
		case "quote":
			chain.toggleBlockquote().run();
			break;
		case "codeBlock":
			chain.toggleCodeBlock().run();
			break;
		case "hr":
			chain.setHorizontalRule().run();
			break;
		case "unlink":
			chain.unsetLink().run();
			break;
		case "clear":
			chain.clearNodes().unsetAllMarks().run();
			break;
	}
}

export function isRichTextActionActive(
	editor: Editor,
	name: RichTextActionName,
) {
	switch (name) {
		case "bold":
			return editor.isActive("bold");
		case "italic":
			return editor.isActive("italic");
		case "underline":
			return editor.isActive("underline");
		case "strike":
			return editor.isActive("strike");
		case "code":
			return editor.isActive("code");
		case "paragraph":
			return editor.isActive("paragraph");
		case "h1":
			return editor.isActive("heading", { level: 1 });
		case "h2":
			return editor.isActive("heading", { level: 2 });
		case "h3":
			return editor.isActive("heading", { level: 3 });
		case "h4":
			return editor.isActive("heading", { level: 4 });
		case "h5":
			return editor.isActive("heading", { level: 5 });
		case "h6":
			return editor.isActive("heading", { level: 6 });
		case "bullet":
			return editor.isActive("bulletList");
		case "ordered":
			return editor.isActive("orderedList");
		case "quote":
			return editor.isActive("blockquote");
		case "codeBlock":
			return editor.isActive("codeBlock");
		case "link":
			return editor.isActive("link");
		default:
			return false;
	}
}

export function isRichTextActionDisabled(
	editor: Editor,
	name: RichTextActionName,
) {
	switch (name) {
		case "undo":
			return !editor.can().undo();
		case "redo":
			return !editor.can().redo();
		case "unlink":
			return !editor.isActive("link");
		default:
			return false;
	}
}

export function currentTextStyleLabel(editor: Editor, fullHeadings: boolean) {
	if (editor.isActive("heading", { level: 1 })) {
		return "Heading 1";
	}
	if (editor.isActive("heading", { level: 2 })) {
		return "Heading 2";
	}
	if (editor.isActive("heading", { level: 3 })) {
		return "Heading 3";
	}
	if (fullHeadings) {
		if (editor.isActive("heading", { level: 4 })) {
			return "Heading 4";
		}
		if (editor.isActive("heading", { level: 5 })) {
			return "Heading 5";
		}
		if (editor.isActive("heading", { level: 6 })) {
			return "Heading 6";
		}
	}
	return "Normal text";
}
