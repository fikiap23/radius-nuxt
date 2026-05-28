<template>
	<UPopover
		v-model:open="open"
		:content="{ align: 'end', side: 'bottom' }"
		:modal="false"
		:ui="{ content: 'p-0 overflow-hidden' }"
	>
		<UButton
			icon="i-lucide-bell"
			color="neutral"
			variant="ghost"
			size="sm"
			class="relative"
			aria-label="Notifications"
		>
			<UBadge
				v-if="unreadCount > 0"
				:label="badgeLabel"
				color="primary"
				size="xs"
				class="absolute -end-0.5 -top-0.5 min-w-4 justify-center px-1"
			/>
		</UButton>

		<template #content>
			<div class="notification-panel w-[min(100vw-2rem,22rem)]">
				<header class="notification-panel__header shrink-0">
					<h2 class="text-sm font-semibold text-highlighted">
						Notifications
					</h2>
					<UBadge
						v-if="unreadCount > 0"
						:label="`${unreadCount} unread`"
						color="primary"
						variant="subtle"
						size="xs"
					/>
				</header>

				<div class="notification-panel__body">
					<NotificationList
						:notifications="panelItems"
						v-model:filter="filter"
						:unread-count="unreadCount"
						:marking-all="markingAll"
						scrollable
						@mark-all-read="onMarkAllRead"
						@open="onOpen"
					/>
				</div>

				<footer class="notification-panel__footer shrink-0">
					<UButton
						label="View all"
						icon="i-lucide-arrow-right"
						trailing
						color="neutral"
						variant="ghost"
						size="sm"
						block
						to="/app/notifications"
						@click="open = false"
					/>
				</footer>
			</div>
		</template>
	</UPopover>
</template>

<script setup lang="ts">
import type { AppNotification, NotificationFilter } from "~/types/notification";

const open = ref(false);
const filter = ref<NotificationFilter>("all");
const markingAll = ref(false);

const {
	unreadCount,
	recent,
	forFilter,
	markAllRead,
	recipientEmail,
} = useNotification();
const { openNotificationLink } = useNotificationNavigation();

const badgeLabel = computed(() =>
	unreadCount.value > 9 ? "9+" : String(unreadCount.value),
);

const panelItems = computed(() => {
	const list =
		filter.value === "unread"
			? forFilter("unread").slice(0, 8)
			: recent(8);
	return list;
});

async function onMarkAllRead() {
	if (!recipientEmail.value) {
		return;
	}
	markingAll.value = true;
	await markAllRead(recipientEmail.value);
	markingAll.value = false;
}

async function onOpen(notification: AppNotification) {
	open.value = false;
	await openNotificationLink(notification);
}
</script>
