export function useAppPageMeta() {
	const route = useRoute();

	const title = computed(() => route.meta.appTitle as string | undefined);
	const description = computed(
		() => route.meta.appDescription as string | undefined,
	);

	const breadcrumbs = computed(() => {
		if (route.path === "/app") {
			return [{ label: title.value ?? "Dashboard" }];
		}

		const items: { label: string; to?: string }[] = [
			{ label: "App", to: "/app" },
		];

		if (title.value) {
			items.push({ label: title.value });
		}

		return items;
	});

	return {
		title,
		description,
		breadcrumbs,
	};
}
