import type { WorkspaceRole } from "~/types/workspace";

export interface WorkspaceRoleMeta {
	label: string;
	color: "primary" | "info" | "neutral" | "warning";
	description: string;
}

export const WORKSPACE_ROLE_META: Record<WorkspaceRole, WorkspaceRoleMeta> = {
	owner: {
		label: "Owner",
		color: "primary",
		description: "Full control including billing and deletion",
	},
	admin: {
		label: "Admin",
		color: "info",
		description: "Manage members, projects, and settings",
	},
	member: {
		label: "Member",
		color: "neutral",
		description: "Create and edit work across projects",
	},
	viewer: {
		label: "Viewer",
		color: "warning",
		description: "Read-only access to workspace content",
	},
};

export type InvitableWorkspaceRole = Exclude<WorkspaceRole, "owner">;

export const INVITE_ROLE_OPTIONS: {
	value: InvitableWorkspaceRole;
	label: string;
}[] = [
	{ value: "admin", label: WORKSPACE_ROLE_META.admin.label },
	{ value: "member", label: WORKSPACE_ROLE_META.member.label },
	{ value: "viewer", label: WORKSPACE_ROLE_META.viewer.label },
];

export const MEMBER_ROLE_OPTIONS: { value: WorkspaceRole; label: string }[] =
	Object.entries(WORKSPACE_ROLE_META).map(([value, meta]) => ({
		value: value as WorkspaceRole,
		label: meta.label,
	}));

export function canInviteMembers(role: WorkspaceRole | null | undefined) {
	return role === "owner" || role === "admin";
}

export function canManageWorkspace(role: WorkspaceRole | null | undefined) {
	return role === "owner" || role === "admin";
}
