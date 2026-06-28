import { isRichTextHtml, richTextToPlain } from "~/features/task/utils/rich-text";

/** Stored mention format: @[Display Name](memberId) */
export const COMMENT_MENTION_REGEX = /@\[([^\]]+)\]\(([^)]+)\)/g;

export type CommentBodySegment =
	| { type: "text"; text: string }
	| { type: "mention"; label: string; memberId: string };

export function parseCommentBody(body: string): CommentBodySegment[] {
	const segments: CommentBodySegment[] = [];
	let lastIndex = 0;

	for (const match of body.matchAll(COMMENT_MENTION_REGEX)) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			segments.push({ type: "text", text: body.slice(lastIndex, index) });
		}
		segments.push({
			type: "mention",
			label: match[1]!,
			memberId: match[2]!,
		});
		lastIndex = index + match[0].length;
	}

	if (lastIndex < body.length) {
		segments.push({ type: "text", text: body.slice(lastIndex) });
	}

	return segments.length ? segments : [{ type: "text", text: body }];
}

export function extractMentionIds(body: string): string[] {
	const ids = new Set<string>();
	for (const match of body.matchAll(COMMENT_MENTION_REGEX)) {
		ids.add(match[2]!);
	}
	return [...ids];
}

export function extractMentionIdsFromBody(body: string): string[] {
	const ids = new Set<string>(extractMentionIds(body));

	if (import.meta.client && isRichTextHtml(body)) {
		const doc = new DOMParser().parseFromString(body, "text/html");
		for (const el of doc.querySelectorAll("[data-mention-id]")) {
			const id = el.getAttribute("data-mention-id");
			if (id) {
				ids.add(id);
			}
		}
	}

	return [...ids];
}

/**
 * Returns the partial query after `@` when the caret is typing a mention,
 * or null when not in mention mode.
 */
export function getActiveMentionQuery(
	body: string,
	cursor: number,
): string | null {
	const before = body.slice(0, cursor);
	const at = before.lastIndexOf("@");
	if (at === -1) {
		return null;
	}

	const afterAt = before.slice(at + 1);
	if (afterAt.startsWith("[")) {
		return null;
	}
	if (/\s/.test(afterAt)) {
		return null;
	}

	return afterAt;
}

export function buildMentionToken(name: string, memberId: string) {
	return `@[${name}](${memberId})`;
}

export function insertMentionToken(
	body: string,
	cursor: number,
	member: { userId: string; name: string },
) {
	const query = getActiveMentionQuery(body, cursor);
	if (query === null) {
		return { body, cursor };
	}

	const at = body.slice(0, cursor).lastIndexOf("@");
	const token = `${buildMentionToken(member.name, member.userId)} `;
	const nextBody = body.slice(0, at) + token + body.slice(cursor);
	const nextCursor = at + token.length;
	return { body: nextBody, cursor: nextCursor };
}

export function commentBodyPreview(body: string, maxLength = 80) {
	let plain = body;
	if (isRichTextHtml(body)) {
		plain = richTextToPlain(body);
	}
	else {
		plain = body.replace(COMMENT_MENTION_REGEX, (_, name: string) => `@${name}`);
	}
	if (plain.length <= maxLength) {
		return plain;
	}
	return `${plain.slice(0, maxLength).trim()}…`;
}
