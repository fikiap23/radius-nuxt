const GREETINGS = {
	morning: "Good morning",
	afternoon: "Good afternoon",
	evening: "Good evening",
} as const;

export function useGreeting() {
	const greeting = computed(() => {
		const hour = new Date().getHours();
		if (hour < 12) {
			return GREETINGS.morning;
		}
		if (hour < 17) {
			return GREETINGS.afternoon;
		}
		return GREETINGS.evening;
	});

	return { greeting };
}
