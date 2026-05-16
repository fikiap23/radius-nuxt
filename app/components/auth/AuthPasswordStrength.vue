<template>
	<div
		v-if="password.length > 0"
		class="space-y-2"
		aria-live="polite"
	>
		<div class="flex gap-1">
			<span
				v-for="rule in rules"
				:key="rule.key"
				:class="[
					'h-1 flex-1 rounded-full transition-colors',
					rule.met ? 'bg-primary' : 'bg-muted',
				]"
				:aria-label="`${rule.label}: ${rule.met ? 'met' : 'not met'}`"
			/>
		</div>
		<ul class="space-y-1 text-xs text-muted">
			<li
				v-for="rule in rules"
				:key="rule.key"
				class="flex items-center gap-1.5"
			>
				<UIcon
					:name="rule.met ? 'i-lucide-check' : 'i-lucide-circle'"
					:class="rule.met ? 'text-primary' : 'text-muted'"
					class="size-3.5 shrink-0"
				/>
				{{ rule.label }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	password: string;
}>();

const rules = computed(() => [
	{
		key: "length",
		label: "At least 8 characters",
		met: props.password.length >= 8,
	},
	{
		key: "upper",
		label: "One uppercase letter",
		met: /[A-Z]/.test(props.password),
	},
	{
		key: "number",
		label: "One number",
		met: /[0-9]/.test(props.password),
	},
]);
</script>
