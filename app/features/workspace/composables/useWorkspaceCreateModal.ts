const createOpen = ref(false);

export function useWorkspaceCreateModal() {
	function openCreateModal() {
		createOpen.value = true;
	}

	function closeCreateModal() {
		createOpen.value = false;
	}

	return {
		createOpen,
		openCreateModal,
		closeCreateModal,
	};
}
