<template>
	<div class="app-header-bar">
		<UButton
			icon="i-lucide-menu"
			color="neutral"
			variant="ghost"
			size="sm"
			class="shrink-0 lg:hidden"
			aria-label="Open navigation"
			@click="emit('open-sidebar')"
		/>

		<div class="ms-auto flex items-center gap-2 sm:gap-3">
			<LayoutThemeToggle compact />

			<UDropdownMenu
				:items="userMenuItems"
				:content="{ align: 'end' }"
			>
				<UButton
					color="neutral"
					variant="ghost"
					size="sm"
					class="max-w-[12rem] gap-2 ps-1.5 pe-2"
				>
					<UAvatar
						:text="userInitials"
						size="xs"
						class="shrink-0"
					/>
					<span
						v-if="user"
						class="hidden truncate text-sm font-medium text-default sm:inline"
					>
						{{ user.name }}
					</span>
					<UIcon
						name="i-lucide-chevron-down"
						class="size-4 shrink-0 text-muted"
					/>
				</UButton>
			</UDropdownMenu>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const emit = defineEmits<{
	"open-sidebar": [];
}>();

const { user, logout } = useAuth();

const userInitials = computed(() => {
	if (!user.value?.name) {
		return "?";
	}
	return user.value.name
		.split(" ")
		.map(part => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
});

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
	[
		{
			label: user.value?.name ?? "Account",
			type: "label",
		},
		{
			label: user.value?.email ?? "",
			type: "label",
			disabled: true,
		},
	],
	[
		{
			label: "Settings",
			icon: "i-lucide-settings",
			to: "/app/settings",
		},
	],
	[
		{
			label: "Sign out",
			icon: "i-lucide-log-out",
			color: "error",
			onSelect: () => logout(),
		},
	],
]);
</script>
