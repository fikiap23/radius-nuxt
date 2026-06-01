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

export const PROJECT_COVER_IMAGE_MAX_BYTES = 512_000;

const PROJECT_COVER_IMAGE_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
]);

export async function readProjectCoverImageFile(
	file: File,
): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string }> {
	if (!PROJECT_COVER_IMAGE_TYPES.has(file.type)) {
		return { ok: false, error: "Use JPEG, PNG, WebP, or GIF." };
	}
	if (file.size > PROJECT_COVER_IMAGE_MAX_BYTES) {
		return { ok: false, error: "Image must be under 500 KB." };
	}

	return new Promise(resolve => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result === "string") {
				resolve({ ok: true, dataUrl: result });
				return;
			}
			resolve({ ok: false, error: "Could not read image." });
		};
		reader.onerror = () => {
			resolve({ ok: false, error: "Could not read image." });
		};
		reader.readAsDataURL(file);
	});
}

export function isValidProjectCoverImageUrl(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return false;
	}
	try {
		const url = new URL(trimmed);
		return url.protocol === "http:" || url.protocol === "https:";
	}
	catch {
		return trimmed.startsWith("data:image/");
	}
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
