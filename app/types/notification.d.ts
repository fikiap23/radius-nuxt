export type NotificationType =
	| "mention"
	| "comment"
	| "assign"
	| "project"
	| "workspace"
	| "system";

export type NotificationFilter = "all" | "unread";

export type NotificationLink =
	| {
		kind: "task";
		taskId: string;
		projectId: string;
		workspaceId: string;
	}
	| {
		kind: "project";
		projectId: string;
		workspaceId: string;
	}
	| {
		kind: "workspace";
		workspaceId: string;
	}
	| {
		kind: "route";
		to: string;
	};

export interface AppNotification {
	id: string;
	recipientEmail: string;
	workspaceId: string;
	type: NotificationType;
	title: string;
	body: string;
	icon: string;
	readAt: string | null;
	createdAt: string;
	link: NotificationLink | null;
}

export interface NotificationPersistedState {
	notifications: AppNotification[];
}

export interface CreateNotificationPayload {
	recipientEmail: string;
	workspaceId: string;
	type: NotificationType;
	title: string;
	body: string;
	icon?: string;
	link?: NotificationLink | null;
}
