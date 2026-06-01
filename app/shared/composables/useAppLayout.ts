import {
	appLayoutById,
	appLayoutPresets,
	type AppLayoutId,
} from "~/core/config/app-layouts";

/**
 * Active app shell layout (sidebar + content chrome).
 */
export function useAppLayout() {
	const store = useUiStore();
	const { appLayout } = storeToRefs(store);

	const preset = computed(() => appLayoutById[appLayout.value]);

	const showSidebar = computed(() => preset.value.sidebar);

	const contentWidthClass = computed(() => {
		switch (preset.value.contentWidth) {
			case "wide":
				return "w-full max-w-none";
			case "narrow":
				return "mx-auto w-full max-w-3xl";
			default:
				return "mx-auto w-full max-w-app";
		}
	});

	function setLayout(layout: AppLayoutId) {
		store.setAppLayout(layout);
	}

	return {
		layoutId: appLayout,
		preset,
		presets: appLayoutPresets,
		showSidebar,
		contentWidthClass,
		setLayout,
	};
}
