export function useAppPageMeta() {
	const route = useRoute();
	const { getWorkspaceById } = useWorkspace();

	const title = computed(() => {
		const workspaceSettingsMatch = route.path.match(
			/^\/app\/workspaces\/([^/]+)\/settings$/,
		);
		if (workspaceSettingsMatch) {
			const ws = getWorkspaceById(workspaceSettingsMatch[1]!);
			return ws?.name ?? (route.meta.appTitle as string | undefined);
		}
		return route.meta.appTitle as string | undefined;
	});

	const description = computed(
		() => route.meta.appDescription as string | undefined,
	);

	const breadcrumbs = computed(() => {
		if (route.path === "/app") {
			return [{ label: title.value ?? "Dashboard" }];
		}

		if (route.path === "/app/workspaces") {
			return [
				{ label: "App", to: "/app" },
				{ label: "Workspaces" },
			];
		}

		const workspaceSettingsMatch = route.path.match(
			/^\/app\/workspaces\/([^/]+)\/settings$/,
		);
		if (workspaceSettingsMatch) {
			const ws = getWorkspaceById(workspaceSettingsMatch[1]!);
			const items: { label: string; to?: string }[] = [
				{ label: "App", to: "/app" },
				{ label: "Workspaces", to: "/app/workspaces" },
			];
			if (ws) {
				items.push({ label: ws.name });
			}
			items.push({ label: "Settings" });
			return items;
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
