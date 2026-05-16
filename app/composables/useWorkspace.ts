/**
 * Thin wrapper around Pinia workspace store.
 */
export function useWorkspace() {
	const store = useWorkspaceStore();
	const {
		activeWorkspaceId,
		accessibleWorkspaces,
		activeWorkspace,
		activeMembers,
		myRole,
		hydrated,
	} = storeToRefs(store);

	return {
		activeWorkspaceId,
		accessibleWorkspaces,
		activeWorkspace,
		activeMembers,
		myRole,
		hydrated,
		hydrateFromStorage: store.hydrateFromStorage,
		ensureActiveWorkspace: store.ensureActiveWorkspace,
		getWorkspaceById: store.getWorkspaceById,
		getMembersForWorkspace: store.getMembersForWorkspace,
		getMyRoleInWorkspace: store.getMyRoleInWorkspace,
		memberCount: store.memberCount,
		setActiveWorkspace: store.setActiveWorkspace,
		createWorkspace: store.createWorkspace,
		updateWorkspace: store.updateWorkspace,
		inviteMember: store.inviteMember,
		updateMemberRole: store.updateMemberRole,
		removeMember: store.removeMember,
	};
}
