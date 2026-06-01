import { NOTIFICATION_TYPE_ICONS } from "~/features/notification/config/notification";
import { SEED_NOTIFICATIONS } from "~/features/notification/data/notifications-seed";
import type {
	AppNotification,
	CreateNotificationPayload,
	NotificationPersistedState,
} from "~/features/notification/types/notification";
import { createNotificationId } from "~/features/notification/utils/notification";

const PERSIST_KEY = "radius-notification-state";
const MOCK_DELAY_MS = 200;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function readPersistedState(): NotificationPersistedState | null {
	if (!import.meta.client) {
		return null;
	}
	try {
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) {
			return null;
		}
		return JSON.parse(raw) as NotificationPersistedState;
	}
	catch {
		return null;
	}
}

function writePersistedState(state: NotificationPersistedState) {
	if (!import.meta.client) {
		return;
	}
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

export const useNotificationStore = defineStore("notification", () => {
	const notifications = ref<AppNotification[]>([...SEED_NOTIFICATIONS]);
	const hydrated = ref(false);

	function persist() {
		writePersistedState({ notifications: notifications.value });
	}

	function hydrateFromStorage() {
		const persisted = readPersistedState();
		if (persisted?.notifications?.length) {
			notifications.value = persisted.notifications;
		}
		hydrated.value = true;
	}

	function push(payload: CreateNotificationPayload) {
		const notification: AppNotification = {
			id: createNotificationId(),
			recipientEmail: payload.recipientEmail.toLowerCase(),
			workspaceId: payload.workspaceId,
			type: payload.type,
			title: payload.title,
			body: payload.body,
			icon: payload.icon ?? NOTIFICATION_TYPE_ICONS[payload.type],
			readAt: null,
			createdAt: new Date().toISOString(),
			link: payload.link ?? null,
		};
		notifications.value = [notification, ...notifications.value];
		persist();
		return notification;
	}

	function notifyMention(params: {
		recipientEmail: string;
		workspaceId: string;
		authorName: string;
		taskTitle: string;
		bodyPreview: string;
		taskId: string;
		projectId: string;
	}) {
		push({
			recipientEmail: params.recipientEmail,
			workspaceId: params.workspaceId,
			type: "mention",
			title: `${params.authorName} mentioned you`,
			body: `${params.taskTitle} — ${params.bodyPreview}`,
			icon: "i-lucide-at-sign",
			link: {
				kind: "task",
				taskId: params.taskId,
				projectId: params.projectId,
				workspaceId: params.workspaceId,
			},
		});
	}

	async function markRead(id: string) {
		await delay(100);
		const index = notifications.value.findIndex(n => n.id === id);
		if (index === -1) {
			return { ok: false as const, error: "Notification not found." };
		}
		if (notifications.value[index]!.readAt) {
			return { ok: true as const };
		}
		const readAt = new Date().toISOString();
		notifications.value = notifications.value.map(n =>
			n.id === id ? { ...n, readAt } : n,
		);
		persist();
		return { ok: true as const };
	}

	async function markAllRead(recipientEmail: string) {
		await delay(150);
		const email = recipientEmail.toLowerCase();
		const timestamp = new Date().toISOString();
		let changed = false;
		notifications.value = notifications.value.map(n => {
			if (n.recipientEmail !== email || n.readAt) {
				return n;
			}
			changed = true;
			return { ...n, readAt: timestamp };
		});
		if (changed) {
			persist();
		}
		return { ok: true as const };
	}

	async function deleteNotification(id: string) {
		await delay(100);
		const exists = notifications.value.some(n => n.id === id);
		if (!exists) {
			return { ok: false as const, error: "Notification not found." };
		}
		notifications.value = notifications.value.filter(n => n.id !== id);
		persist();
		return { ok: true as const };
	}

	return {
		notifications,
		hydrated,
		hydrateFromStorage,
		push,
		notifyMention,
		markRead,
		markAllRead,
		deleteNotification,
	};
});
