export default defineNuxtPlugin(() => {
	const store = useBoardStore();
	store.hydrateFromStorage();
});
