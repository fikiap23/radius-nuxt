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
			<UiFileUploader
				v-model="coverImageTempKey"
				purpose="project_cover"
				accept="image/jpeg,image/png,image/webp,image/gif"
				:max-size="5 * 1024 * 1024"
				label="Custom image"
				placeholder="JPEG, PNG, WebP, or GIF — max 5 MB"
				:preview-url="coverImageUrl"
				@upload-success="onUploadSuccess"
				@remove="removeCustomImage"
			/>
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
} from "~/features/project/utils/project";

const cover = defineModel<ProjectCoverPreset>("cover", { required: true });
const coverImageUrl = defineModel<string | null>("coverImageUrl", {
	default: null,
});
const coverImageTempKey = defineModel<string | null>("coverImageTempKey", {
	default: null,
});

const props = defineProps<{
	previewName?: string;
	previewIcon?: string;
}>();

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
	coverImageTempKey.value = null;
	imageError.value = null;
}

interface UploadPayload {
	tempKey: string;
	file: File;
	previewUrl: string;
}

function onUploadSuccess(payload: UploadPayload) {
	coverImageUrl.value = payload.previewUrl;
	imageError.value = null;
}

function removeCustomImage() {
	coverImageUrl.value = null;
	coverImageTempKey.value = null;
	imageError.value = null;
	imageUrlDraft.value = "";
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
	coverImageTempKey.value = null;
}
</script>
