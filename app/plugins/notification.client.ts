export default defineNuxtPlugin(() => {
	const store = useNotificationStore();
	store.hydrateFromStorage();
});
