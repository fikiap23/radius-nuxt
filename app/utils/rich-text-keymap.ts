import { Extension } from "@tiptap/core";

/** Trello-style heading shortcuts (Ctrl+Alt+0–6). */
export const RichTextTrelloKeymap = Extension.create({
	name: "richTextTrelloKeymap",
	addKeyboardShortcuts() {
		return {
			"Mod-Alt-0": () => this.editor.commands.setParagraph(),
			"Mod-Alt-1": () =>
				this.editor.commands.toggleHeading({ level: 1 }),
			"Mod-Alt-2": () =>
				this.editor.commands.toggleHeading({ level: 2 }),
			"Mod-Alt-3": () =>
				this.editor.commands.toggleHeading({ level: 3 }),
			"Mod-Alt-4": () =>
				this.editor.commands.toggleHeading({ level: 4 }),
			"Mod-Alt-5": () =>
				this.editor.commands.toggleHeading({ level: 5 }),
			"Mod-Alt-6": () =>
				this.editor.commands.toggleHeading({ level: 6 }),
		};
	},
});
