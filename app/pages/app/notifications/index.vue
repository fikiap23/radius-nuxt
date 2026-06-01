<template>
	<div class="app-page space-y-6">
		<UiAppPageIntro
			title="Notifications"
			:description="introDescription"
		>
			<UButton
				v-if="unreadCount > 0"
				label="Mark all read"
				icon="i-lucide-check-check"
				size="sm"
				variant="outline"
				color="neutral"
				:loading="markingAll"
				@click="onMarkAllRead"
			/>
		</UiAppPageIntro>

		<div class="app-card app-card--surface overflow-hidden">
			<NotificationList
				v-model:filter="filter"
				:notifications="pageData.items"
				:unread-count="unreadCount"
				:marking-all="markingAll"
				empty-title="No notifications"
				:empty-description="filter === 'unread'
					? 'You have no unread notifications.'
					: 'Notifications about mentions, tasks, and projects appear here.'"
				@mark-all-read="onMarkAllRead"
				@open="onOpen"
			/>

			<div
				v-if="pageData.total > 0"
				class="notification-page__pagination"
			>
				<p class="text-sm text-muted">
					Page {{ pageData.page }} of {{ pageData.totalPages }}
					<span class="text-toned">· {{ pageData.total }} total</span>
				</p>
				<div class="flex items-center gap-2">
					<UButton
						icon="i-lucide-chevron-left"
						label="Previous"
						size="sm"
						color="neutral"
						variant="outline"
						:disabled="pageData.page <= 1"
						@click="page = pageData.page - 1"
					/>
					<UButton
						icon="i-lucide-chevron-right"
						label="Next"
						trailing
						size="sm"
						color="neutral"
						variant="outline"
						:disabled="pageData.page >= pageData.totalPages"
						@click="page = pageData.page + 1"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/core/config/brand";
import type { AppNotification, NotificationFilter } from "~/features/notification/types/notification";

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Notifications",
	appDescription: "Mentions, assignments, and workspace updates",
});

useSeoMeta({
	title: `Notifications — ${APP_NAME}`,
});

const filter = ref<NotificationFilter>("all");
const page = ref(1);
const markingAll = ref(false);

const {
	unreadCount,
	paginated,
	markAllRead,
	recipientEmail,
} = useNotification();
const { openNotificationLink } = useNotificationNavigation();

const pageData = computed(() => paginated(filter.value, page.value));

const introDescription = computed(() => {
	if (unreadCount.value > 0) {
		return `${unreadCount.value} unread notification${unreadCount.value === 1 ? "" : "s"}`;
	}
	return "Mentions, assignments, and workspace activity";
});

watch(filter, () => {
	page.value = 1;
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
	await openNotificationLink(notification);
}
</script>
