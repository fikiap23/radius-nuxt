<template>
	<span
		class="workspace-avatar inline-flex shrink-0 items-center justify-center rounded-lg font-semibold text-white"
		:class="sizeClass"
		:style="{ backgroundColor: `hsl(${hue} 55% 42%)` }"
		aria-hidden="true"
	>
		{{ initials }}
	</span>
</template>

<script setup lang="ts">
import { workspaceAvatarHue, workspaceInitials } from "~/features/workspace/utils/workspace";

const props = withDefaults(
	defineProps<{
		name: string;
		slug?: string;
		size?: "xs" | "sm" | "md";
	}>(),
	{
		size: "sm",
	},
);

const initials = computed(() => workspaceInitials(props.name));

const hue = computed(() =>
	workspaceAvatarHue(props.slug ?? props.name.toLowerCase()),
);

const sizeClass = computed(() => {
	switch (props.size) {
		case "xs":
			return "size-6 text-[10px]";
		case "md":
			return "size-10 text-sm";
		default:
			return "size-8 text-xs";
	}
});
</script>
