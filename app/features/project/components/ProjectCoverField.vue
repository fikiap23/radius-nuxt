<template>
	<div class="space-y-4">
		<div
			class="project-cover-field__preview overflow-hidden rounded-xl border border-muted"
		>
			<ProjectCover
				:cover="cover"
				:cover-image-url="coverImageUrl"
				size="banner"
				rounded="none"
			>
				<div class="project-card__cover-inner">
					<ProjectIcon
						:icon="previewIcon"
						size="md"
					/>
				</div>
			</ProjectCover>
		</div>

		<div>
			<p class="mb-2 text-xs font-medium text-muted">
				Color preset
			</p>
			<div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
				<button
					v-for="preset in PROJECT_COVER_PRESETS"
					:key="preset.id"
					type="button"
					class="project-cover-picker"
					:class="[
						`project-cover--${preset.id}`,
						cover === preset.id && !coverImageUrl && 'project-cover-picker--active',
					]"
					:aria-label="preset.label"
					:aria-pressed="cover === preset.id && !coverImageUrl"
					@click="selectPreset(preset.id)"
				/>
			</div>
		</div>

		<div class="space-y-2">
			<p class="text-xs font-medium text-muted">
				Custom image
			</p>
			<div class="flex flex-wrap gap-2">
				<UButton
					type="button"
					label="Upload image"
					icon="i-lucide-upload"
					color="neutral"
					variant="outline"
					:loading="uploading"
					@click="fileInputRef?.click()"
				/>
				<UButton
					v-if="coverImageUrl"
					type="button"
					label="Remove image"
					icon="i-lucide-image-off"
					color="neutral"
					variant="ghost"
					@click="coverImageUrl = null"
				/>
			</div>
			<input
				ref="fileInputRef"
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				class="sr-only"
				@change="onFileChange"
			>
			<p class="text-xs text-muted">
				JPEG, PNG, WebP, or GIF — max 500 KB. Saved with the project.
			</p>
		</div>

		<UFormField
			label="Image URL"
			name="coverImageUrl"
			hint="Optional link to an image (https://…)"
		>
			<div class="flex gap-2">
				<UInput
					v-model="imageUrlDraft"
					placeholder="https://example.com/cover.jpg"
					class="min-w-0 flex-1"
				/>
				<UButton
					type="button"
					label="Apply"
					color="neutral"
					variant="outline"
					:disabled="!imageUrlDraft.trim()"
					@click="applyImageUrl"
				/>
			</div>
		</UFormField>

		<UAlert
			v-if="imageError"
			color="error"
			variant="soft"
			:title="imageError"
			class="mt-2"
		/>
	</div>
</template>

<script setup lang="ts">
import { PROJECT_COVER_PRESETS } from "~/features/project/config/project";
import type { ProjectCoverPreset } from "~/features/project/types/project";
import {
	defaultProjectIcon,
	isValidProjectCoverImageUrl,
	readProjectCoverImageFile,
} from "~/features/project/utils/project";

const cover = defineModel<ProjectCoverPreset>("cover", { required: true });
const coverImageUrl = defineModel<string | null>("coverImageUrl", {
	default: null,
});

const props = defineProps<{
	previewName?: string;
	previewIcon?: string;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const imageError = ref<string | null>(null);
const imageUrlDraft = ref("");

const previewIcon = computed(
	() => props.previewIcon ?? defaultProjectIcon(props.previewName ?? ""),
);

watch(coverImageUrl, url => {
	if (url?.startsWith("http")) {
		imageUrlDraft.value = url;
	}
});

function selectPreset(id: ProjectCoverPreset) {
	cover.value = id;
	coverImageUrl.value = null;
	imageError.value = null;
}

async function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file) {
		return;
	}

	imageError.value = null;
	uploading.value = true;
	const result = await readProjectCoverImageFile(file);
	uploading.value = false;

	if (!result.ok) {
		imageError.value = result.error;
		return;
	}

	coverImageUrl.value = result.dataUrl;
}

function applyImageUrl() {
	const trimmed = imageUrlDraft.value.trim();
	if (!trimmed) {
		return;
	}
	if (!isValidProjectCoverImageUrl(trimmed)) {
		imageError.value = "Enter a valid http(s) or data:image URL.";
		return;
	}
	imageError.value = null;
	coverImageUrl.value = trimmed;
}
</script>
