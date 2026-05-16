/**
 * Thin wrapper around Pinia UI store — keeps existing call sites stable.
 */
export function useAppSidebar() {
	const store = useUiStore();
	const { sidebarCollapsed } = storeToRefs(store);

	return {
		collapsed: sidebarCollapsed,
		toggle: store.toggleSidebar,
		expand: store.expandSidebar,
	};
}
