import { NOTIFICATION_PAGE_SIZE } from "~/config/notification";
import type {
	AppNotification,
	NotificationFilter,
	NotificationLink,
} from "~/types/notification";
import { isNotificationUnread } from "~/utils/notification";

export function useNotification() {
	const store = useNotificationStore();
	const { notifications, hydrated } = storeToRefs(store);
	const { user } = useAuth();

	const recipientEmail = computed(() => user.value?.email?.toLowerCase() ?? "");

	const mine = computed(() =>
		notifications.value.filter(
			n => n.recipientEmail === recipientEmail.value,
		),
	);

	const unreadCount = computed(
		() => mine.value.filter(isNotificationUnread).length,
	);

	function sorted(list: AppNotification[]) {
		return [...list].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}

	function forFilter(filter: NotificationFilter) {
		const list =
			filter === "unread"
				? mine.value.filter(isNotificationUnread)
				: mine.value;
		return sorted(list);
	}

	function recent(limit = 8) {
		return sorted(mine.value).slice(0, limit);
	}

	function paginated(filter: NotificationFilter, page: number) {
		const list = forFilter(filter);
		const totalPages = Math.max(1, Math.ceil(list.length / NOTIFICATION_PAGE_SIZE));
		const safePage = Math.min(Math.max(1, page), totalPages);
		const start = (safePage - 1) * NOTIFICATION_PAGE_SIZE;
		return {
			items: list.slice(start, start + NOTIFICATION_PAGE_SIZE),
			total: list.length,
			totalPages,
			page: safePage,
		};
	}

	return {
		notifications,
		hydrated,
		mine,
		unreadCount,
		recipientEmail,
		forFilter,
		recent,
		paginated,
		markRead: store.markRead,
		markAllRead: store.markAllRead,
		deleteNotification: store.deleteNotification,
	};
}

export function useNotificationNavigation() {
	const router = useRouter();
	const { setActiveWorkspace, activeWorkspaceId } = useWorkspace();
	const { openTask } = useTaskDrawer();
	const { markRead } = useNotification();

	async function openNotificationLink(
		notification: AppNotification,
		options?: { markRead?: boolean },
	) {
		const shouldMarkRead = options?.markRead ?? true;
		if (shouldMarkRead && !notification.readAt) {
			await markRead(notification.id);
		}

		const link = notification.link;
		if (!link) {
			return;
		}

		if (
			link.kind === "task"
			|| link.kind === "project"
			|| link.kind === "workspace"
		) {
			if (activeWorkspaceId.value !== link.workspaceId) {
				setActiveWorkspace(link.workspaceId);
			}
		}

		await navigateToLink(link);
	}

	async function navigateToLink(link: NotificationLink) {
		switch (link.kind) {
			case "task": {
				await router.push(`/app/projects/${link.projectId}/board`);
				await nextTick();
				await openTask(link.taskId, {
					projectId: link.projectId,
					workspaceId: link.workspaceId,
				});
				break;
			}
			case "project":
				await router.push(`/app/projects/${link.projectId}/board`);
				break;
			case "workspace":
				await router.push(`/app/workspaces/${link.workspaceId}/settings`);
				break;
			case "route":
				await router.push(link.to);
				break;
		}
	}

	return {
		openNotificationLink,
		navigateToLink,
	};
}
