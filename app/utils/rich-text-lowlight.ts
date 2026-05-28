import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

/** Shared lowlight instance (highlight.js grammars). */
export const richTextLowlight = createLowlight(common);

export function createRichTextCodeBlockExtension() {
	return CodeBlockLowlight.configure({
		lowlight: richTextLowlight,
		defaultLanguage: "plaintext",
		languageClassPrefix: "language-",
		HTMLAttributes: {
			class: "rich-text-code-block",
			spellcheck: "false",
			autocorrect: "off",
			autocapitalize: "off",
		},
	});
}
