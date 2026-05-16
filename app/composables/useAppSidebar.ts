const SIDEBAR_COLLAPSED_KEY = "radius-sidebar-collapsed";

export function useAppSidebar() {
	const collapsed = useCookie<boolean>(SIDEBAR_COLLAPSED_KEY, {
		default: () => false,
		sameSite: "lax",
	});

	function toggle() {
		collapsed.value = !collapsed.value;
	}

	function expand() {
		collapsed.value = false;
	}

	return {
		collapsed,
		toggle,
		expand,
	};
}
