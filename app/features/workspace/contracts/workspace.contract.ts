/**
 * Workspace API Contract
 */

export const WorkspaceRoutes = {
	list: "/workspaces",
	create: "/workspaces",
	update: (id: string) => `/workspaces/${id}`,
	membersList: (workspaceId: string) => `/workspaces/${workspaceId}/members`,
	inviteMember: (workspaceId: string) => `/workspaces/${workspaceId}/members`,
	updateMember: (workspaceId: string, memberId: string) => `/workspaces/${workspaceId}/members/${memberId}`,
	removeMember: (workspaceId: string, memberId: string) => `/workspaces/${workspaceId}/members/${memberId}`,
} as const;
