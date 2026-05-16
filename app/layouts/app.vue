<template>
	<LayoutAppShell>
		<template #header>
			<div class="flex w-full items-center justify-between gap-4">
				<LayoutBrandLogo size="sm" />
				<div class="flex min-w-0 items-center gap-2 sm:gap-3">
				<p
					v-if="user"
					class="hidden truncate text-sm text-muted sm:block"
				>
					{{ user.name }}
				</p>
				<UButton
					label="Sign out"
					color="neutral"
					variant="ghost"
					size="sm"
					icon="i-lucide-log-out"
					@click="logout"
				/>
				</div>
			</div>
		</template>

		<slot />
	</LayoutAppShell>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();
</script>
