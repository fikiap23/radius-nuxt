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
		<rect
			x="24"
			y="32"
			width="272"
			height="48"
			rx="8"
			class="fill-default stroke-muted"
			stroke-width="1"
		/>
		<circle
			cx="44"
			cy="56"
			r="10"
			class="fill-error/20 stroke-error/60"
			stroke-width="1"
		/>
		<text
			x="44"
			y="60"
			text-anchor="middle"
			class="fill-error text-[10px] font-bold"
			style="font-family: var(--font-sans)"
		>
			!
		</text>
		<text
			x="64"
			y="52"
			class="fill-highlighted text-[10px] font-semibold"
			style="font-family: var(--font-sans)"
		>
			BUG-142 · Login redirect loop
		</text>
		<text
			x="64"
			y="68"
			class="fill-muted text-[8px]"
			style="font-family: var(--font-sans)"
		>
			Severity: High · Chrome / prod
		</text>
		<rect
			x="24"
			y="92"
			width="120"
			height="20"
			rx="4"
			class="fill-muted/25"
		/>
		<text
			x="32"
			y="106"
			class="fill-toned text-[8px]"
			style="font-family: var(--font-sans)"
		>
			Repro steps
		</text>
		<rect
			x="152"
			y="92"
			width="144"
			height="44"
			rx="6"
			class="fill-muted/15 stroke-muted"
			stroke-width="1"
		/>
		<text
			x="164"
			y="110"
			class="fill-muted text-[8px]"
			style="font-family: var(--font-sans)"
		>
			1. Sign in with OAuth
		</text>
		<text
			x="164"
			y="124"
			class="fill-muted text-[8px]"
			style="font-family: var(--font-sans)"
		>
			2. Redirect to /app twice
		</text>
	</svg>
</template>
