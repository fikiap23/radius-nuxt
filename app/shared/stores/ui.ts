import {
	DEFAULT_APP_LAYOUT,
	isAppLayoutId,
	type AppLayoutId,
} from "~/config/app-layouts";

const SIDEBAR_COLLAPSED_KEY = "radius-sidebar-collapsed";
const APP_LAYOUT_KEY = "radius-app-layout";

export const useUiStore = defineStore("ui", () => {
	const sidebarCollapsed = useCookie<boolean>(SIDEBAR_COLLAPSED_KEY, {
		default: () => false,
		sameSite: "lax",
	});

	const appLayout = useCookie<AppLayoutId>(APP_LAYOUT_KEY, {
		default: () => DEFAULT_APP_LAYOUT,
		sameSite: "lax",
	});

	if (import.meta.client && !isAppLayoutId(appLayout.value)) {
		appLayout.value = DEFAULT_APP_LAYOUT;
	}

	function toggleSidebar() {
		sidebarCollapsed.value = !sidebarCollapsed.value;
	}

	function expandSidebar() {
		sidebarCollapsed.value = false;
	}

	function setAppLayout(layout: AppLayoutId) {
		appLayout.value = layout;
	}

	return {
		sidebarCollapsed,
		appLayout,
		toggleSidebar,
		expandSidebar,
		setAppLayout,
	};
});
