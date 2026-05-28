const HTML_TAG_RE = /<\/?[a-z][\s\S]*?>/i;

const ALLOWED_TAGS = new Set([
	"p",
	"br",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"s",
	"ul",
	"ol",
	"li",
	"a",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"blockquote",
	"code",
	"pre",
	"hr",
	"span",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
	a: new Set(["href", "target", "rel", "class"]),
	span: new Set(["class", "data-mention-id", "data-mention-label"]),
};

export function isRichTextHtml(value: string) {
	return HTML_TAG_RE.test(value.trim());
}

export function isRichTextEmpty(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return true;
	}
	if (!isRichTextHtml(trimmed)) {
		return !trimmed;
	}
	const plain = richTextToPlain(trimmed);
	return !plain.trim();
}

export function richTextToPlain(html: string) {
	if (!import.meta.client) {
		return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	}
	const doc = new DOMParser().parseFromString(html, "text/html");
	return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function sanitizeRichTextHtml(html: string) {
	if (!import.meta.client || !html.trim()) {
		return "";
	}

	const doc = new DOMParser().parseFromString(html, "text/html");
	const clean = document.createElement("div");

	for (const node of [...doc.body.childNodes]) {
		const cloned = sanitizeNode(node);
		if (cloned) {
			clean.appendChild(cloned);
		}
	}

	return clean.innerHTML;
}

function sanitizeNode(node: Node): Node | null {
	if (node.nodeType === Node.TEXT_NODE) {
		return document.createTextNode(node.textContent ?? "");
	}

	if (node.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}

	const el = node as HTMLElement;
	const tag = el.tagName.toLowerCase();
	if (!ALLOWED_TAGS.has(tag)) {
		return document.createTextNode(el.textContent ?? "");
	}

	const out = document.createElement(tag);
	const allowed = ALLOWED_ATTRS[tag];
	if (allowed) {
		for (const attr of el.attributes) {
			if (allowed.has(attr.name)) {
				out.setAttribute(attr.name, attr.value);
			}
		}
	}

	if (tag === "a") {
		out.setAttribute("rel", "noopener noreferrer");
		out.setAttribute("target", "_blank");
	}

	for (const child of [...el.childNodes]) {
		const sanitized = sanitizeNode(child);
		if (sanitized) {
			out.appendChild(sanitized);
		}
	}

	return out;
}

export function emptyRichTextDocument() {
	return "<p></p>";
}
