const SIDEBAR_COLLAPSED_KEY = "radius-sidebar-collapsed";

export const useUiStore = defineStore("ui", () => {
	const sidebarCollapsed = useCookie<boolean>(SIDEBAR_COLLAPSED_KEY, {
		default: () => false,
		sameSite: "lax",
	});

	function toggleSidebar() {
		sidebarCollapsed.value = !sidebarCollapsed.value;
	}

	function expandSidebar() {
		sidebarCollapsed.value = false;
	}

	return {
		sidebarCollapsed,
		toggleSidebar,
		expandSidebar,
	};
});
