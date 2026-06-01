const createOpen = ref(false);

export function useProjectCreateModal() {
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
