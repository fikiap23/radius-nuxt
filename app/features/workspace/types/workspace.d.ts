export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export type WorkspaceMemberStatus = "active" | "pending";

export interface Workspace {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
}

export interface WorkspaceMember {
	id: string;
	workspaceId: string;
	userId: string | null;
	name: string;
	email: string;
	role: WorkspaceRole;
	status: WorkspaceMemberStatus;
}

export interface CreateWorkspacePayload {
	name: string;
	slug?: string;
}

export interface UpdateWorkspacePayload {
	name?: string;
	slug?: string;
}

export interface InviteMemberPayload {
	email: string;
	role: Exclude<WorkspaceRole, "owner">;
}

export interface WorkspacePersistedState {
	workspaces: Workspace[];
	members: WorkspaceMember[];
}
