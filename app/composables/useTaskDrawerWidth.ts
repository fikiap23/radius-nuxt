const STORAGE_KEY = "radius-task-drawer-width";

const DEFAULT_WIDTH = 672;
const MIN_WIDTH = 360;
const MAX_WIDTH = 1200;

function clampWidth(value: number) {
	const max = Math.min(MAX_WIDTH, Math.round(window.innerWidth * 0.92));
	return Math.min(max, Math.max(MIN_WIDTH, Math.round(value)));
}

function readStoredWidth() {
	if (!import.meta.client) {
		return DEFAULT_WIDTH;
	}
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		return DEFAULT_WIDTH;
	}
	const parsed = Number.parseInt(raw, 10);
	return Number.isFinite(parsed) ? clampWidth(parsed) : DEFAULT_WIDTH;
}

export function useTaskDrawerWidth() {
	const widthPx = useState("task-drawer-width", () => readStoredWidth());
	const isResizing = ref(false);

	function persistWidth() {
		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, String(widthPx.value));
		}
	}

	function resetWidth() {
		widthPx.value = DEFAULT_WIDTH;
		persistWidth();
	}

	function startResize(event: PointerEvent) {
		if (!import.meta.client) {
			return;
		}
		event.preventDefault();
		isResizing.value = true;

		const startX = event.clientX;
		const startWidth = widthPx.value;

		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";

		const onMove = (moveEvent: PointerEvent) => {
			const delta = startX - moveEvent.clientX;
			widthPx.value = clampWidth(startWidth + delta);
		};

		const onUp = () => {
			isResizing.value = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			persistWidth();
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
	}

	onMounted(() => {
		widthPx.value = readStoredWidth();
	});

	return {
		widthPx,
		isResizing,
		startResize,
		resetWidth,
	};
}
