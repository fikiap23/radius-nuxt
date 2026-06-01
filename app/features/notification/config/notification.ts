import type { NotificationType } from "~/features/notification/types/notification";

export const NOTIFICATION_PAGE_SIZE = 10;

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
	mention: "i-lucide-at-sign",
	comment: "i-lucide-message-square",
	assign: "i-lucide-user-plus",
	project: "i-lucide-folder-kanban",
	workspace: "i-lucide-building-2",
	system: "i-lucide-bell",
};
