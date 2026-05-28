/**
 * Reka UI dialogs can leave body scroll/pointer locks after close.
 * Do not remove overlay nodes from the DOM — Vue/Reka still patch them and
 * that causes "insertBefore" on null errors.
 */
export default defineNuxtPlugin(() => {
	const router = useRouter();

	function unlockBody() {
		document.body.style.removeProperty("pointer-events");
		document.body.style.removeProperty("overflow");
		document.body.style.removeProperty("padding-right");
		document.body.removeAttribute("data-scroll-locked");
	}

	router.afterEach(() => {
		unlockBody();
	});

	if (import.meta.client) {
		unlockBody();
	}
});
