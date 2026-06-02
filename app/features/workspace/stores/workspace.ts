import type {
	CreateWorkspacePayload,
	InviteMemberPayload,
	UpdateWorkspacePayload,
	Workspace,
	WorkspaceMember,
	WorkspaceRole,
} from "~/features/workspace/types/workspace";
import { useWorkspaceApi } from "~/features/workspace/composables/useWorkspaceApi";
import { useAuthStore } from "~/features/auth/stores/auth";

const ACTIVE_WORKSPACE_COOKIE = "radius-active-workspace";

export const useWorkspaceStore = defineStore("workspace", () => {
	const authStore = useAuthStore();
	const workspaceApi = useWorkspaceApi();

	const activeWorkspaceId = useCookie<string | null>(ACTIVE_WORKSPACE_COOKIE, {
		default: () => null,
		sameSite: "lax",
	});

	const workspaces = ref<Workspace[]>([]);
	const members = ref<WorkspaceMember[]>([]);
	const hydrated = ref(false);

	async function hydrateFromStorage() {
		if (!authStore.isAuthenticated) {
			workspaces.value = [];
			members.value = [];
			activeWorkspaceId.value = null;
			hydrated.value = true;
			return;
		}

		const result = await workspaceApi.getWorkspaces();
		if (result.ok) {
			workspaces.value = result.data;

			const loadedMembers: WorkspaceMember[] = [];
			for (const ws of result.data) {
				const membersRes = await workspaceApi.getWorkspaceMembers(ws.id);
				if (membersRes.ok) {
					loadedMembers.push(...membersRes.data);
				}
			}
			members.value = loadedMembers;
		}

		hydrated.value = true;
		ensureActiveWorkspace();
	}

	function userWorkspaceIds() {
		const email = authStore.user?.email?.toLowerCase();
		if (!email) {
			return [];
		}
		return [
			...new Set(
				members.value
					.filter(m => m.email.toLowerCase() === email)
					.map(m => m.workspaceId),
			),
		];
	}

	const accessibleWorkspaces = computed(() => {
		const ids = new Set(userWorkspaceIds());
		return workspaces.value.filter(ws => ids.has(ws.id));
	});

	const activeWorkspace = computed(() =>
		accessibleWorkspaces.value.find(ws => ws.id === activeWorkspaceId.value)
		?? accessibleWorkspaces.value[0]
		?? null,
	);

	const activeMembers = computed(() =>
		members.value.filter(m => m.workspaceId === activeWorkspace.value?.id),
	);

	const myRole = computed<WorkspaceRole | null>(() => {
		const email = authStore.user?.email?.toLowerCase();
		if (!email || !activeWorkspace.value) {
			return null;
		}
		return (
			members.value.find(
				m =>
					m.workspaceId === activeWorkspace.value!.id
					&& m.email.toLowerCase() === email,
			)?.role ?? null
		);
	});

	function ensureActiveWorkspace() {
		const accessible = accessibleWorkspaces.value;
		if (accessible.length === 0) {
			activeWorkspaceId.value = null;
			return;
		}

		const currentValid = accessible.some(ws => ws.id === activeWorkspaceId.value);
		if (!currentValid) {
			activeWorkspaceId.value = accessible[0]!.id;
		}
	}

	function getWorkspaceById(id: string) {
		return workspaces.value.find(ws => ws.id === id) ?? null;
	}

	function getMembersForWorkspace(workspaceId: string) {
		return members.value.filter(m => m.workspaceId === workspaceId);
	}

	function getMyRoleInWorkspace(workspaceId: string) {
		const email = authStore.user?.email?.toLowerCase();
		if (!email) {
			return null;
		}
		return (
			members.value.find(
				m =>
					m.workspaceId === workspaceId
					&& m.email.toLowerCase() === email,
			)?.role ?? null
		);
	}

	function memberCount(workspaceId: string) {
		return getMembersForWorkspace(workspaceId).length;
	}

	async function setActiveWorkspace(id: string) {
		const accessible = accessibleWorkspaces.value;
		if (!accessible.some(ws => ws.id === id)) {
			return { ok: false as const, error: "You do not have access to this workspace." };
		}
		activeWorkspaceId.value = id;
		return { ok: true as const, workspace: getWorkspaceById(id)! };
	}

	async function createWorkspace(payload: CreateWorkspacePayload) {
		const name = payload.name.trim();
		if (!name) {
			return { ok: false as const, error: "Workspace name is required." };
		}

		const user = authStore.user;
		if (!user) {
			return { ok: false as const, error: "Sign in to create a workspace." };
		}

		const result = await workspaceApi.createWorkspace({
			name,
			slug: payload.slug?.trim() || undefined,
		});

		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to create workspace." };
		}

		const workspace = result.data;
		workspaces.value = [...workspaces.value, workspace];

		const membersRes = await workspaceApi.getWorkspaceMembers(workspace.id);
		if (membersRes.ok) {
			members.value = [...members.value, ...membersRes.data];
		} else {
			// Fallback: local active member representation until refresh
			members.value = [
				...members.value,
				{
					id: "mbr_" + Math.random().toString(36).substring(2, 9),
					workspaceId: workspace.id,
					name: user.name,
					email: user.email,
					role: "owner" as const,
					status: "active" as const,
				},
			];
		}

		activeWorkspaceId.value = workspace.id;
		return { ok: true as const, workspace };
	}

	async function updateWorkspace(id: string, payload: UpdateWorkspacePayload) {
		const result = await workspaceApi.updateWorkspace(id, payload);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to update workspace." };
		}

		const updated = result.data;
		workspaces.value = workspaces.value.map(ws =>
			ws.id === id ? updated : ws,
		);

		return { ok: true as const, workspace: updated };
	}

	async function inviteMember(workspaceId: string, payload: InviteMemberPayload) {
		const email = payload.email.trim().toLowerCase();
		if (!email || !email.includes("@")) {
			return { ok: false as const, error: "Enter a valid email address." };
		}

		const workspaceMembers = getMembersForWorkspace(workspaceId);
		if (workspaceMembers.some(m => m.email.toLowerCase() === email)) {
			return {
				ok: false as const,
				error: "This person is already a member or has a pending invite.",
			};
		}

		const result = await workspaceApi.inviteMember(workspaceId, payload);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to invite member." };
		}

		const member = result.data;
		members.value = [...members.value, member];

		return { ok: true as const, member };
	}

	async function updateMemberRole(memberId: string, role: WorkspaceRole) {
		const member = members.value.find(m => m.id === memberId);
		if (!member) {
			return { ok: false as const, error: "Member not found." };
		}

		const result = await workspaceApi.updateMemberRole(member.workspaceId, memberId, role);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to update member role." };
		}

		members.value = members.value.map(m =>
			m.id === memberId ? { ...m, role } : m,
		);

		return { ok: true as const };
	}

	async function removeMember(memberId: string) {
		const member = members.value.find(m => m.id === memberId);
		if (!member) {
			return { ok: false as const, error: "Member not found." };
		}

		const result = await workspaceApi.removeMember(member.workspaceId, memberId);
		if (!result.ok) {
			return { ok: false as const, error: result.error || "Failed to remove member." };
		}

		members.value = members.value.filter(m => m.id !== memberId);
		ensureActiveWorkspace();

		return { ok: true as const };
	}

	watch(
		() => authStore.user?.email,
		async (newEmail) => {
			if (newEmail) {
				await hydrateFromStorage();
			} else {
				workspaces.value = [];
				members.value = [];
				activeWorkspaceId.value = null;
			}
		},
	);

	return {
		activeWorkspaceId,
		workspaces,
		members,
		hydrated,
		accessibleWorkspaces,
		activeWorkspace,
		activeMembers,
		myRole,
		hydrateFromStorage,
		ensureActiveWorkspace,
		getWorkspaceById,
		getMembersForWorkspace,
		getMyRoleInWorkspace,
		memberCount,
		setActiveWorkspace,
		createWorkspace,
		updateWorkspace,
		inviteMember,
		updateMemberRole,
		removeMember,
	};
});
