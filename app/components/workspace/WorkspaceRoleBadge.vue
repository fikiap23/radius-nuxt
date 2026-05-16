<template>
	<UBadge
		:color="meta.color"
		variant="subtle"
		size="sm"
	>
		{{ meta.label }}
	</UBadge>
</template>

<script setup lang="ts">
import { WORKSPACE_ROLE_META } from "~/config/workspace-roles";
import type { WorkspaceRole } from "~/types/workspace";

const props = defineProps<{
	role: WorkspaceRole;
}>();

const meta = computed(() => WORKSPACE_ROLE_META[props.role]);
</script>
