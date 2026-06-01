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
		<g
			v-for="(task, i) in tasks"
			:key="task.label"
		>
			<rect
				x="24"
				:y="36 + i * 32"
				width="16"
				height="16"
				rx="4"
				:class="task.done ? 'fill-primary/30 stroke-primary' : 'fill-transparent stroke-muted'"
				stroke-width="1.5"
			/>
			<path
				v-if="task.done"
				d="M28 44 L32 48 L38 40"
				class="stroke-primary"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<text
				x="52"
				:y="48 + i * 32"
				class="fill-default text-[10px]"
				style="font-family: var(--font-sans)"
			>
				{{ task.label }}
			</text>
			<circle
				:cx="280"
				:cy="44 + i * 32"
				r="5"
				:class="task.priorityClass"
			/>
		</g>
	</svg>
</template>

<script setup lang="ts">
const tasks = [
	{ label: "Ship landing illustrations", done: true, priorityClass: "fill-error/70" },
	{ label: "Wire task drawer fields", done: false, priorityClass: "fill-warning/70" },
	{ label: "Add label filters", done: false, priorityClass: "fill-success/70" },
];
</script>
