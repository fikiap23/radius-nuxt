<template>
	<svg
		viewBox="0 0 320 160"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="w-full h-full text-primary"
		aria-hidden="true"
	>
		<g
			v-for="(col, i) in cols"
			:key="col.label"
		>
			<rect
				:x="12 + i * 104"
				y="16"
				width="96"
				height="128"
				rx="10"
				class="fill-muted/25 stroke-muted"
				stroke-width="1"
			/>
			<text
				:x="60 + i * 104"
				y="36"
				text-anchor="middle"
				class="fill-muted text-[9px] font-semibold uppercase"
				style="font-family: var(--font-sans)"
			>
				{{ col.label }}
			</text>
			<rect
				v-for="(card, j) in col.cards"
				:key="card"
				:x="20 + i * 104"
				:y="48 + j * 36"
				width="80"
				height="28"
				rx="6"
				class="fill-default stroke-muted"
				stroke-width="1"
			/>
			<text
				v-for="(card, j) in col.cards"
				:key="`${card}-t`"
				:x="60 + i * 104"
				:y="66 + j * 36"
				text-anchor="middle"
				class="fill-default text-[8px]"
				style="font-family: var(--font-sans)"
			>
				{{ card }}
			</text>
		</g>
	</svg>
</template>

<script setup lang="ts">
const cols = [
	{ label: "Todo", cards: ["Design", "API"] },
	{ label: "Doing", cards: ["Board"] },
	{ label: "Done", cards: ["Auth"] },
];
</script>
