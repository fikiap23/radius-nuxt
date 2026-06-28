export default defineNuxtPlugin(() => {
	const store = useTaskStore();
	store.hydrateCommentsFromStorage();
});
