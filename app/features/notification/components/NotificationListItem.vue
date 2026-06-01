<template>
	<button
		type="button"
		class="notification-item"
		:class="!notification.readAt && 'notification-item--unread'"
		@click="emit('open', notification)"
	>
		<div
			class="notification-item__icon"
			:class="!notification.readAt && 'notification-item__icon--unread'"
		>
			<UIcon
				:name="notification.icon"
				class="size-4"
			/>
		</div>

		<div class="min-w-0 flex-1 text-left">
			<p class="text-sm font-medium text-highlighted">
				{{ notification.title }}
			</p>
			<p class="mt-0.5 line-clamp-2 text-xs text-muted">
				{{ notification.body }}
			</p>
			<p class="mt-1 text-[10px] text-muted">
				{{ timeLabel }}
			</p>
		</div>

		<span
			v-if="!notification.readAt"
			class="notification-item__dot"
			aria-hidden="true"
		/>
	</button>
</template>

<script setup lang="ts">
import type { AppNotification } from "~/features/notification/types/notification";
import { formatNotificationTime } from "~/features/notification/utils/notification";

const props = defineProps<{
	notification: AppNotification;
}>();

const emit = defineEmits<{
	open: [notification: AppNotification];
}>();

const timeLabel = computed(() =>
	formatNotificationTime(props.notification.createdAt),
);
</script>
