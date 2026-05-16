export default defineNuxtPlugin(() => {
	const store = useWorkspaceStore();
	store.hydrateFromStorage();
});
