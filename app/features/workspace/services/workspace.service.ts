import type { ApiClient } from "~/core/api/client";
import type { ApiResult } from "~/core/api/types";
import { WorkspaceRoutes } from "~/features/workspace/contracts/workspace.contract";
import type {
	CreateWorkspacePayload,
	InviteMemberPayload,
	UpdateWorkspacePayload,
	Workspace,
	WorkspaceMember,
	WorkspaceRole,
} from "~/features/workspace/types/workspace";

export function createWorkspaceService(client: ApiClient) {
	return {
		getWorkspaces(): Promise<ApiResult<Workspace[]>> {
			return client.get<Workspace[]>(WorkspaceRoutes.list);
		},

		createWorkspace(body: CreateWorkspacePayload): Promise<ApiResult<Workspace>> {
			return client.post<Workspace>(WorkspaceRoutes.create, body);
		},

		updateWorkspace(id: string, body: UpdateWorkspacePayload): Promise<ApiResult<Workspace>> {
			return client.patch<Workspace>(WorkspaceRoutes.update(id), body);
		},

		getWorkspaceMembers(workspaceId: string): Promise<ApiResult<WorkspaceMember[]>> {
			return client.get<WorkspaceMember[]>(WorkspaceRoutes.membersList(workspaceId));
		},

		inviteMember(workspaceId: string, body: InviteMemberPayload): Promise<ApiResult<WorkspaceMember>> {
			return client.post<WorkspaceMember>(WorkspaceRoutes.inviteMember(workspaceId), body);
		},

		updateMemberRole(workspaceId: string, memberId: string, role: WorkspaceRole): Promise<ApiResult<{ ok: boolean }>> {
			return client.patch<{ ok: boolean }>(WorkspaceRoutes.updateMember(workspaceId, memberId), { role });
		},

		removeMember(workspaceId: string, memberId: string): Promise<ApiResult<{ ok: boolean }>> {
			return client.delete<{ ok: boolean }>(WorkspaceRoutes.removeMember(workspaceId, memberId));
		},
	};
}

export type WorkspaceService = ReturnType<typeof createWorkspaceService>;
