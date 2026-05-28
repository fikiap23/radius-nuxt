<template>
	<div class="flex w-full items-stretch gap-2">
		<UPopover
			v-model:open="open"
			:content="{ align: 'start', side: 'bottom', sideOffset: 4 }"
			class="min-w-0 flex-1"
		>
			<div class="w-full">
				<UButton
					type="button"
					color="neutral"
					variant="outline"
					icon="i-lucide-calendar"
					trailing-icon="i-lucide-chevron-down"
					class="w-full justify-between font-normal"
				>
					<span :class="model ? 'text-default' : 'text-muted'">
						{{ triggerLabel }}
					</span>
				</UButton>
			</div>
			<template #content>
				<div class="flex w-72 flex-col gap-2 p-2">
					<div class="grid grid-cols-2 gap-2">
						<USelect
							v-model="selectedMonth"
							:items="monthOptions"
							value-key="value"
							class="w-full"
							aria-label="Month"
						/>
						<USelect
							v-model="selectedYear"
							:items="yearOptions"
							value-key="value"
							class="w-full"
							aria-label="Year"
						/>
					</div>
					<UCalendar
						v-model="model"
						v-model:placeholder="placeholder"
						:month-controls="false"
						:year-controls="false"
						@update:model-value="onDayPicked"
					/>
				</div>
			</template>
		</UPopover>
		<UButton
			v-if="model"
			type="button"
			color="neutral"
			variant="ghost"
			icon="i-lucide-x"
			aria-label="Clear due date"
			@click="clear"
		/>
	</div>
</template>

<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import { formatCalendarDateLabel } from "~/utils/task";

const model = defineModel<CalendarDate | null>();
const open = defineModel<boolean>("open", { default: false });

const placeholder = shallowRef(today(getLocalTimeZone()));

const monthOptions = computed(() =>
	Array.from({ length: 12 }, (_, index) => {
		const month = index + 1;
		const label = new Intl.DateTimeFormat(undefined, { month: "long" }).format(
			new Date(2024, index, 1),
		);
		return { label, value: month };
	}),
);

const yearOptions = computed(() => {
	const now = new Date().getFullYear();
	return Array.from({ length: 101 }, (_, index) => {
		const year = now - 50 + index;
		return { label: String(year), value: year };
	});
});

const triggerLabel = computed(() =>
	model.value ? formatCalendarDateLabel(model.value) : "No due date",
);

const selectedMonth = computed({
	get: () => placeholder.value.month,
	set(month: number | string) {
		placeholder.value = placeholder.value.set({ month: Number(month) });
	},
});

const selectedYear = computed({
	get: () => placeholder.value.year,
	set(year: number | string) {
		placeholder.value = placeholder.value.set({ year: Number(year) });
	},
});

watch(open, (isOpen) => {
	if (isOpen) {
		placeholder.value = model.value ?? today(getLocalTimeZone());
	}
});

function onDayPicked() {
	open.value = false;
}

function clear() {
	model.value = null;
}
</script>
