<template>
	<NuxtLink
		:to="to"
		:class="[
			'group inline-flex items-center gap-2.5 font-display font-bold',
			promo ? 'text-on-promo' : 'text-highlighted',
			props.class,
		]"
	>
		<span
			:class="[
				'flex items-center justify-center rounded-lg bg-primary font-extrabold text-surface-promo shadow-lg shadow-primary/30 transition-transform group-hover:-rotate-3 group-hover:scale-105',
				markSize,
			]"
		>
			R
		</span>
		<span :class="showTagline ? 'flex flex-col leading-tight' : ''">
			<span :class="textSize">{{ APP_NAME }}</span>
			<span
				v-if="showTagline"
				:class="[
					'text-[10px] font-sans font-medium uppercase tracking-widest',
					promo ? 'text-on-promo-muted' : 'text-muted',
				]"
			>
				{{ APP_TAGLINE }}
			</span>
		</span>
	</NuxtLink>
</template>

<script setup lang="ts">
import { APP_NAME, APP_TAGLINE } from "~/config/brand";

const props = withDefaults(
	defineProps<{
		to?: string;
		size?: "sm" | "md" | "lg";
		showTagline?: boolean;
		promo?: boolean;
		class?: string;
	}>(),
	{
		to: "/",
		size: "md",
		showTagline: false,
		promo: false,
	},
);

const markSize = computed(() => {
	if (props.size === "sm") {
		return "size-8 text-sm";
	}
	if (props.size === "lg") {
		return "size-10 text-lg rounded-xl";
	}
	return "size-9 text-sm";
});

const textSize = computed(() => {
	if (props.size === "lg") {
		return "text-xl tracking-tight";
	}
	return "text-base tracking-tight";
});
</script>
