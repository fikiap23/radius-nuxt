<template>
	<svg
		viewBox="0 0 320 160"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="w-full h-full text-primary"
		aria-hidden="true"
	>
		<rect
			x="8"
			y="12"
			width="304"
			height="136"
			rx="12"
			class="stroke-muted fill-elevated/80"
			stroke-width="1.5"
		/>
		<text
			x="24"
			y="40"
			class="fill-highlighted text-[11px] font-semibold"
			style="font-family: var(--font-sans)"
		>
			Sprint 12 · Burndown
		</text>
		<line
			x1="24"
			y1="120"
			x2="296"
			y2="120"
			class="stroke-muted"
			stroke-width="1"
		/>
		<polyline
			:points="burndownLine"
			class="stroke-primary"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			fill="none"
		/>
		<polyline
			:points="idealLine"
			class="stroke-muted"
			stroke-width="1.5"
			stroke-dasharray="4 4"
			stroke-linecap="round"
			fill="none"
		/>
		<rect
			x="24"
			y="128"
			width="48"
			height="8"
			rx="2"
			class="fill-primary/20"
		/>
		<text
			x="24"
			y="152"
			class="fill-muted text-[8px]"
			style="font-family: var(--font-sans)"
		>
			Actual
		</text>
		<rect
			x="88"
			y="128"
			width="48"
			height="8"
			rx="2"
			class="fill-muted/40"
		/>
		<text
			x="88"
			y="152"
			class="fill-muted text-[8px]"
			style="font-family: var(--font-sans)"
		>
			Ideal
		</text>
	</svg>
</template>

<script setup lang="ts">
const burndownLine = "24,56 72,72 120,88 168,100 216,108 264,112 296,116";
const idealLine = "24,56 296,116";
</script>
