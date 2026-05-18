import { PROJECT_ICON_OPTIONS } from "~/config/project";
import type { ProjectCoverPreset, ProjectStatus } from "~/types/project";

export function createProjectId() {
	if (import.meta.client && typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `proj-${Date.now()}`;
}

export function defaultProjectIcon(name: string) {
	const trimmed = name.trim().toLowerCase();
	if (!trimmed) {
		return PROJECT_ICON_OPTIONS[0]!.value;
	}
	const match = PROJECT_ICON_OPTIONS.find(opt =>
		opt.label.toLowerCase().startsWith(trimmed[0] ?? ""),
	);
	return match?.value ?? PROJECT_ICON_OPTIONS[4]!.value;
}

export function defaultProjectCover(): ProjectCoverPreset {
	return "ocean";
}

export function projectStatusLabel(status: ProjectStatus) {
	switch (status) {
		case "on_hold":
			return "On hold";
		case "completed":
			return "Completed";
		default:
			return "Active";
	}
}

export function isProjectArchived(archivedAt: string | null) {
	return archivedAt !== null;
}
