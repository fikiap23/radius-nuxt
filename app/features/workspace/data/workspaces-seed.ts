import type { Workspace, WorkspaceMember } from "~/features/workspace/types/workspace";

export const SEED_WORKSPACES: Workspace[] = [
	{
		id: "ws-radius-hq",
		name: "Radius HQ",
		slug: "radius-hq",
		createdAt: "2025-11-01T10:00:00.000Z",
	},
	{
		id: "ws-side-project",
		name: "Side Project",
		slug: "side-project",
		createdAt: "2026-01-15T14:30:00.000Z",
	},
	{
		id: "ws-design-lab",
		name: "Design Lab",
		slug: "design-lab",
		createdAt: "2026-03-02T09:00:00.000Z",
	},
];

export const SEED_MEMBERS: WorkspaceMember[] = [
	{
		id: "mem-hq-owner",
		workspaceId: "ws-radius-hq",
		name: "Alex Morgan",
		email: "alex@radius.mock",
		role: "owner",
		status: "active",
	},
	{
		id: "mem-hq-admin",
		workspaceId: "ws-radius-hq",
		name: "Jordan Lee",
		email: "jordan@radius.mock",
		role: "admin",
		status: "active",
	},
	{
		id: "mem-hq-member",
		workspaceId: "ws-radius-hq",
		name: "Sam Rivera",
		email: "sam@radius.mock",
		role: "member",
		status: "active",
	},
	{
		id: "mem-side-owner",
		workspaceId: "ws-side-project",
		name: "Alex Morgan",
		email: "alex@radius.mock",
		role: "admin",
		status: "active",
	},
	{
		id: "mem-side-viewer",
		workspaceId: "ws-side-project",
		name: "Casey Kim",
		email: "casey@radius.mock",
		role: "viewer",
		status: "active",
	},
	{
		id: "mem-design-owner",
		workspaceId: "ws-design-lab",
		name: "Alex Morgan",
		email: "alex@radius.mock",
		role: "owner",
		status: "active",
	},
	{
		id: "mem-design-pending",
		workspaceId: "ws-design-lab",
		name: "Pending invite",
		email: "invite@radius.mock",
		role: "member",
		status: "pending",
	},
];

/**
 * Ensures the logged-in user has membership in at least one workspace.
 */
export function ensureUserMembership(
	members: WorkspaceMember[],
	user: { name: string; email: string } | null,
): WorkspaceMember[] {
	if (!user?.email) {
		return members;
	}

	const hasMembership = members.some(
		m => m.email.toLowerCase() === user.email.toLowerCase(),
	);
	if (hasMembership) {
		return members.map(member => {
			if (member.email.toLowerCase() !== user.email.toLowerCase()) {
				return member;
			}
			return {
				...member,
				name: user.name,
				email: user.email,
			};
		});
	}

	return [
		...members,
		{
			id: `mem-${user.email}`,
			workspaceId: SEED_WORKSPACES[0]!.id,
			name: user.name,
			email: user.email,
			role: "owner",
			status: "active",
		},
	];
}
