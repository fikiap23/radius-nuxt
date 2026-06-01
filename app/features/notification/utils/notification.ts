import { NOTIFICATION_TYPE_ICONS } from "~/features/notification/config/notification";
import type { AppNotification, NotificationLink, NotificationType } from "~/features/notification/types/notification";
import { formatActivityTime } from "~/features/task/utils/task";

export function notificationIcon(
	type: NotificationType,
	override?: string,
) {
	return override ?? NOTIFICATION_TYPE_ICONS[type];
}

export function formatNotificationTime(iso: string) {
	return formatActivityTime(iso);
}

export function notificationLinkToPath(link: NotificationLink | null): string | null {
	if (!link) {
		return null;
	}
	switch (link.kind) {
		case "task":
			return `/app/projects/${link.projectId}/board`;
		case "project":
			return `/app/projects/${link.projectId}/board`;
		case "workspace":
			return `/app/workspaces/${link.workspaceId}/settings`;
		case "route":
			return link.to;
		default:
			return null;
	}
}

export function isNotificationUnread(notification: AppNotification) {
	return notification.readAt === null;
}

export function createNotificationId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `ntf-${Date.now()}`;
}
