export default defineNuxtPlugin(() => {
	const store = useProjectStore();
	store.hydrateFromStorage();
});
