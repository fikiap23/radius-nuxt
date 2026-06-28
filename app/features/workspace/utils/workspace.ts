export function slugifyWorkspaceName(name: string) {
	return name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);
}

export function createWorkspaceId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `ws-${Date.now()}`;
}

export function createMemberId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `mem-${Date.now()}`;
}

export function workspaceInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) {
		return "?";
	}
	if (parts.length === 1) {
		return parts[0]!.slice(0, 2).toUpperCase();
	}
	return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function workspaceAvatarHue(slug: string) {
	let hash = 0;
	for (let i = 0; i < slug.length; i++) {
		hash = slug.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % 360;
}

export function isAssignableMember(member: WorkspaceMember) {
	return member.status === "active" && Boolean(member.userId);
}

export function assignableMembers(members: WorkspaceMember[]) {
	return members.filter(isAssignableMember);
}

export function findMemberByUserId(
	members: WorkspaceMember[],
	userId: string | null | undefined,
) {
	if (!userId) {
		return undefined;
	}
	return members.find(member => member.userId === userId);
}
