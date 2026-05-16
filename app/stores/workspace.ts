import {
	SEED_MEMBERS,
	SEED_WORKSPACES,
	ensureUserMembership,
} from "~/data/workspaces-seed";
import type {
	CreateWorkspacePayload,
	InviteMemberPayload,
	UpdateWorkspacePayload,
	Workspace,
	WorkspaceMember,
	WorkspacePersistedState,
	WorkspaceRole,
} from "~/types/workspace";
import {
	createMemberId,
	createWorkspaceId,
	slugifyWorkspaceName,
} from "~/utils/workspace";

const ACTIVE_WORKSPACE_COOKIE = "radius-active-workspace";
const PERSIST_KEY = "radius-workspace-state";
const MOCK_DELAY_MS = 400;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function readPersistedState(): WorkspacePersistedState | null {
	if (!import.meta.client) {
		return null;
	}
	try {
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) {
			return null;
		}
		return JSON.parse(raw) as WorkspacePersistedState;
	}
	catch {
		return null;
	}
}

function writePersistedState(state: WorkspacePersistedState) {
	if (!import.meta.client) {
		return;
	}
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

function uniqueSlug(base: string, workspaces: Workspace[], excludeId?: string) {
	let slug = slugifyWorkspaceName(base) || "workspace";
	let candidate = slug;
	let counter = 1;

	while (
		workspaces.some(ws => ws.slug === candidate && ws.id !== excludeId)
	) {
		counter += 1;
		candidate = `${slug}-${counter}`;
	}

	return candidate;
}

export const useWorkspaceStore = defineStore("workspace", () => {
	const authStore = useAuthStore();

	const activeWorkspaceId = useCookie<string | null>(ACTIVE_WORKSPACE_COOKIE, {
		default: () => null,
		sameSite: "lax",
	});

	const workspaces = ref<Workspace[]>([...SEED_WORKSPACES]);
	const members = ref<WorkspaceMember[]>([...SEED_MEMBERS]);
	const hydrated = ref(false);

	function persist() {
		writePersistedState({
			workspaces: workspaces.value,
			members: members.value,
		});
	}

	function hydrateFromStorage() {
		const persisted = readPersistedState();
		if (persisted?.workspaces?.length) {
			workspaces.value = persisted.workspaces;
			members.value = persisted.members;
		}

		members.value = ensureUserMembership(members.value, authStore.user);
		persist();
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
		await delay(150);
		const accessible = accessibleWorkspaces.value;
		if (!accessible.some(ws => ws.id === id)) {
			return { ok: false as const, error: "You do not have access to this workspace." };
		}
		activeWorkspaceId.value = id;
		return { ok: true as const, workspace: getWorkspaceById(id)! };
	}

	async function createWorkspace(payload: CreateWorkspacePayload) {
		await delay();
		const name = payload.name.trim();
		if (!name) {
			return { ok: false as const, error: "Workspace name is required." };
		}

		const user = authStore.user;
		if (!user) {
			return { ok: false as const, error: "Sign in to create a workspace." };
		}

		const slug = uniqueSlug(
			payload.slug?.trim() || name,
			workspaces.value,
		);

		const workspace: Workspace = {
			id: createWorkspaceId(),
			name,
			slug,
			createdAt: new Date().toISOString(),
		};

		const member: WorkspaceMember = {
			id: createMemberId(),
			workspaceId: workspace.id,
			name: user.name,
			email: user.email,
			role: "owner",
			status: "active",
		};

		workspaces.value = [...workspaces.value, workspace];
		members.value = [...members.value, member];
		activeWorkspaceId.value = workspace.id;
		persist();

		return { ok: true as const, workspace };
	}

	async function updateWorkspace(id: string, payload: UpdateWorkspacePayload) {
		await delay();
		const index = workspaces.value.findIndex(ws => ws.id === id);
		if (index === -1) {
			return { ok: false as const, error: "Workspace not found." };
		}

		const current = workspaces.value[index]!;
		const name = payload.name?.trim() ?? current.name;
		const slug = uniqueSlug(
			payload.slug?.trim() || name,
			workspaces.value,
			id,
		);

		const updated: Workspace = {
			...current,
			name,
			slug,
		};

		workspaces.value = workspaces.value.map(ws =>
			ws.id === id ? updated : ws,
		);
		persist();

		return { ok: true as const, workspace: updated };
	}

	async function inviteMember(workspaceId: string, payload: InviteMemberPayload) {
		await delay();
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

		const displayName = email.split("@")[0] ?? email;
		const member: WorkspaceMember = {
			id: createMemberId(),
			workspaceId,
			name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
			email,
			role: payload.role,
			status: "pending",
		};

		members.value = [...members.value, member];
		persist();

		return { ok: true as const, member };
	}

	async function updateMemberRole(
		memberId: string,
		role: WorkspaceRole,
	) {
		await delay(200);
		const member = members.value.find(m => m.id === memberId);
		if (!member) {
			return { ok: false as const, error: "Member not found." };
		}
		if (member.role === "owner" && role !== "owner") {
			const owners = getMembersForWorkspace(member.workspaceId).filter(
				m => m.role === "owner" && m.id !== memberId,
			);
			if (owners.length === 0) {
				return {
					ok: false as const,
					error: "Each workspace must have at least one owner.",
				};
			}
		}

		members.value = members.value.map(m =>
			m.id === memberId ? { ...m, role } : m,
		);
		persist();

		return { ok: true as const };
	}

	async function removeMember(memberId: string) {
		await delay(200);
		const member = members.value.find(m => m.id === memberId);
		if (!member) {
			return { ok: false as const, error: "Member not found." };
		}
		if (member.role === "owner") {
			const owners = getMembersForWorkspace(member.workspaceId).filter(
				m => m.role === "owner",
			);
			if (owners.length <= 1) {
				return {
					ok: false as const,
					error: "Transfer ownership before removing the last owner.",
				};
			}
		}

		members.value = members.value.filter(m => m.id !== memberId);
		persist();
		ensureActiveWorkspace();

		return { ok: true as const };
	}

	watch(
		() => authStore.user?.email,
		() => {
			if (!hydrated.value) {
				return;
			}
			members.value = ensureUserMembership(members.value, authStore.user);
			persist();
			ensureActiveWorkspace();
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
