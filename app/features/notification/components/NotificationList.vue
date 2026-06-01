<template>
	<div
		class="notification-list"
		:class="scrollable && 'notification-list--scrollable'"
	>
		<div
			v-if="showToolbar"
			class="notification-list__toolbar shrink-0"
		>
			<div class="flex gap-1 rounded-lg border border-muted p-0.5">
				<UButton
					v-for="option in filterOptions"
					:key="option.value"
					:label="option.label"
					size="xs"
					:color="filter === option.value ? 'primary' : 'neutral'"
					:variant="filter === option.value ? 'soft' : 'ghost'"
					@click="filter = option.value"
				/>
			</div>

			<UButton
				v-if="unreadCount > 0"
				label="Mark all read"
				icon="i-lucide-check-check"
				size="xs"
				color="neutral"
				variant="ghost"
				:loading="markingAll"
				@click="emit('mark-all-read')"
			/>
		</div>

		<div
			class="notification-list__content"
			:class="scrollable && 'notification-list__content--scrollable'"
		>
			<UiEmptyState
				v-if="notifications.length === 0"
				icon="i-lucide-bell-off"
				:title="emptyTitle"
				:description="emptyDescription"
				class="py-8"
			/>

			<ul
				v-else
				class="divide-y divide-muted/60"
			>
				<li
					v-for="item in notifications"
					:key="item.id"
				>
					<NotificationListItem
						:notification="item"
						@open="emit('open', $event)"
					/>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { AppNotification, NotificationFilter } from "~/features/notification/types/notification";

	withDefaults(
	defineProps<{
		notifications: AppNotification[];
		unreadCount?: number;
		markingAll?: boolean;
		showToolbar?: boolean;
		scrollable?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
	}>(),
	{
		unreadCount: 0,
		markingAll: false,
		showToolbar: true,
		scrollable: false,
		emptyTitle: "No notifications",
		emptyDescription: "You're all caught up.",
	},
);

const filter = defineModel<NotificationFilter>("filter", { default: "all" });

const emit = defineEmits<{
	"mark-all-read": [];
	open: [notification: AppNotification];
}>();

const filterOptions: { label: string; value: NotificationFilter }[] = [
	{ label: "All", value: "all" },
	{ label: "Unread", value: "unread" },
];
</script>
