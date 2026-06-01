import { toHtml } from "hast-util-to-html";

import { richTextLowlight } from "~/features/task/utils/rich-text-lowlight";

function languageFromCodeElement(code: HTMLElement) {
	for (const token of code.classList) {
		if (token.startsWith("language-")) {
			return token.slice("language-".length) || "";
		}
	}
	const parent = code.closest("pre");
	if (parent?.dataset.language) {
		return parent.dataset.language;
	}
	return "";
}

/** Re-highlight plain code blocks (e.g. legacy saves) for display. */
export function enhanceRichTextCodeBlocks(html: string) {
	if (!html.trim()) {
		return html;
	}

	const doc = new DOMParser().parseFromString(html, "text/html");

	for (const code of doc.querySelectorAll("pre code")) {
		if (code.querySelector("[class*='hljs-']")) {
			continue;
		}

		const text = code.textContent ?? "";
		if (!text.trim()) {
			continue;
		}

		const language = languageFromCodeElement(code as HTMLElement);

		try {
			const tree = language
				? richTextLowlight.highlight(language, text)
				: richTextLowlight.highlightAuto(text);
			code.innerHTML = toHtml(tree);
			const detected = tree.data?.language;
			if (!language && typeof detected === "string" && detected) {
				code.classList.add(`language-${detected}`);
			}
		}
		catch {
			try {
				const tree = richTextLowlight.highlightAuto(text);
				code.innerHTML = toHtml(tree);
				const detected = tree.data?.language;
				if (typeof detected === "string" && detected) {
					code.classList.add(`language-${detected}`);
				}
			}
			catch {
				/* keep plain text */
			}
		}
	}

	return doc.body.innerHTML;
}
