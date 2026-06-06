<template>
	<div class="ui-file-uploader space-y-2">
		<label
			v-if="label"
			class="block text-xs font-semibold uppercase tracking-wider text-muted/80"
		>
			{{ label }}
		</label>

		<!-- Uploaded state / Preview -->
		<div
			v-if="previewUrl"
			class="ui-file-uploader__preview relative overflow-hidden rounded-xl border border-muted/80 bg-muted/20 transition-all duration-300 hover:border-primary/40 group"
		>
			<!-- Image Preview -->
			<div v-if="isImage" class="relative h-40 w-full overflow-hidden">
				<img
					:src="previewUrl"
					alt="Upload preview"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				>
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
					<div class="min-w-0 pr-2">
						<p class="text-xs font-medium text-white truncate">
							{{ fileName || 'Uploaded Image' }}
						</p>
						<p v-if="fileSize" class="text-[10px] text-white/85">
							{{ formatBytes(fileSize) }}
						</p>
					</div>
					<UButton
						size="xs"
						color="error"
						variant="soft"
						icon="i-lucide-trash-2"
						:disabled="disabled"
						@click="removeFile"
					>
						Remove
					</UButton>
				</div>
			</div>

			<!-- Generic File Card Preview -->
			<div v-else class="flex items-center justify-between p-4">
				<div class="flex items-center gap-3 min-w-0">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<UIcon :name="fileIcon" class="size-5" />
					</div>
					<div class="min-w-0">
						<p class="text-sm font-medium text-highlighted truncate">
							{{ fileName || 'Uploaded File' }}
						</p>
						<p v-if="fileSize" class="text-xs text-muted">
							{{ formatBytes(fileSize) }}
						</p>
					</div>
				</div>
				<UButton
					size="xs"
					color="neutral"
					variant="ghost"
					icon="i-lucide-x"
					:disabled="disabled"
					@click="removeFile"
				/>
			</div>
		</div>

		<!-- Dropzone / Idle / Loading state -->
		<div
			v-else
			class="ui-file-uploader__dropzone relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-300 cursor-pointer"
			:class="[
				isDragActive ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-muted hover:border-primary/50 hover:bg-muted/10',
				(disabled || uploading) && 'opacity-65 cursor-not-allowed pointer-events-none',
			]"
			@dragover.prevent="onDragOver"
			@dragleave.prevent="onDragLeave"
			@drop.prevent="onDrop"
			@click="fileInputRef?.click()"
		>
			<input
				ref="fileInputRef"
				type="file"
				:accept="accept"
				class="hidden"
				:disabled="disabled || uploading"
				@change="onFileChange"
			>

			<!-- Loading State -->
			<div v-if="uploading" class="flex flex-col items-center space-y-3 py-2">
				<div class="relative flex h-12 w-12 items-center justify-center">
					<div class="absolute inset-0 rounded-full border-4 border-primary/20" />
					<div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
					<UIcon name="i-lucide-loader-2" class="size-5 text-primary animate-spin" />
				</div>
				<div class="text-center">
					<p class="text-sm font-medium text-highlighted">
						Uploading file...
					</p>
					<p class="text-xs text-muted">
						Please wait while we secure your upload
					</p>
				</div>
			</div>

			<!-- Idle State -->
			<div v-else class="flex flex-col items-center space-y-2 text-center py-2">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30 text-muted transition-colors group-hover:text-primary">
					<UIcon :name="icon" class="size-6 text-muted-foreground" />
				</div>
				<div>
					<p class="text-sm font-medium text-highlighted">
						<span class="text-primary hover:underline font-semibold">Click to upload</span> or drag and drop
					</p>
					<p class="text-xs text-muted mt-1">
						{{ placeholder || `Supports files up to ${formatBytes(maxSize)}` }}
					</p>
				</div>
			</div>
		</div>

		<!-- Error Message -->
		<Transition
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0 translate-y-[-10px]"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-[-10px]"
		>
			<UAlert
				v-if="uploadError"
				color="error"
				variant="soft"
				icon="i-lucide-circle-alert"
				:title="uploadError"
			/>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { useStorage } from "~/features/storage/composables/useStorage";
import type { StorageUploadPurpose } from "~/features/storage/contracts/storage.contract";

const props = withDefaults(
	defineProps<{
		modelValue?: string | null;
		previewUrl?: string | null;
		purpose?: StorageUploadPurpose;
		accept?: string;
		maxSize?: number;
		label?: string;
		placeholder?: string;
		icon?: string;
		disabled?: boolean;
	}>(),
	{
		modelValue: null,
		previewUrl: null,
		purpose: "project_cover",
		accept: "image/jpeg,image/png,image/webp,image/gif",
		maxSize: 5 * 1024 * 1024,
		icon: "i-lucide-upload-cloud",
		disabled: false,
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: string | null];
	"upload-success": [payload: { tempKey: string; file: File; previewUrl: string }];
	"upload-error": [error: string];
	"remove": [];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragActive = ref(false);
const uploadError = ref<string | null>(null);

// Local file metadata
const fileName = ref<string | null>(null);
const fileSize = ref<number | null>(null);
const fileType = ref<string | null>(null);

// Preview URL (either local blob URL or existing modelValue URL)
const localPreviewUrl = ref<string | null>(null);

const previewUrl = computed(() => {
	if (localPreviewUrl.value) {
		return localPreviewUrl.value;
	}
	return props.previewUrl || props.modelValue;
});

const isImage = computed(() => {
	if (fileType.value) {
		return fileType.value.startsWith("image/");
	}
	if (previewUrl.value) {
		const cleanUrl = previewUrl.value.split("?")[0] || "";
		return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl) || cleanUrl.startsWith("data:image/") || cleanUrl.startsWith("blob:");
	}
	return false;
});

const fileIcon = computed(() => {
	if (!fileType.value) return "i-lucide-file";
	if (fileType.value.includes("pdf")) return "i-lucide-file-text";
	if (fileType.value.includes("word") || fileType.value.includes("officedocument.wordprocessingml")) return "i-lucide-file-text";
	if (fileType.value.includes("zip") || fileType.value.includes("rar")) return "i-lucide-archive";
	return "i-lucide-file";
});

const { upload, uploading } = useStorage();

function onDragOver() {
	if (props.disabled || uploading.value) return;
	isDragActive.value = true;
}

function onDragLeave() {
	isDragActive.value = false;
}

async function onDrop(event: DragEvent) {
	isDragActive.value = false;
	if (props.disabled || uploading.value) return;
	const file = event.dataTransfer?.files?.[0];
	if (file) {
		await processAndUploadFile(file);
	}
}

async function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (file) {
		await processAndUploadFile(file);
	}
}

async function processAndUploadFile(file: File) {
	uploadError.value = null;

	if (props.accept) {
		const acceptedTypes = props.accept.split(",").map(t => t.trim());
		const fileTypeMatch = acceptedTypes.some((type) => {
			if (type.startsWith("image/")) {
				return file.type.startsWith("image/");
			}
			if (type.startsWith("application/")) {
				return file.type === type;
			}
			if (type.startsWith(".")) {
				return file.name.toLowerCase().endsWith(type.toLowerCase());
			}
			return false;
		});

		if (!fileTypeMatch) {
			const errorMsg = `Invalid file type. Accepted: ${props.accept}`;
			uploadError.value = errorMsg;
			emit("upload-error", errorMsg);
			return;
		}
	}

	if (file.size > props.maxSize) {
		const errorMsg = `File is too large. Max size: ${formatBytes(props.maxSize)}`;
		uploadError.value = errorMsg;
		emit("upload-error", errorMsg);
		return;
	}

	fileName.value = file.name;
	fileSize.value = file.size;
	fileType.value = file.type;

	const result = await upload(file, props.purpose);

	if (!result.ok) {
		uploadError.value = result.error;
		emit("upload-error", result.error);
		return;
	}

	const blobUrl = URL.createObjectURL(file);
	localPreviewUrl.value = blobUrl;

	emit("update:modelValue", result.tempKey);
	emit("upload-success", {
		tempKey: result.tempKey,
		file,
		previewUrl: blobUrl,
	});
}

function removeFile() {
	if (localPreviewUrl.value?.startsWith("blob:")) {
		URL.revokeObjectURL(localPreviewUrl.value);
	}
	localPreviewUrl.value = null;
	fileName.value = null;
	fileSize.value = null;
	fileType.value = null;
	uploadError.value = null;

	emit("update:modelValue", null);
	emit("remove");
}

function formatBytes(bytes: number, decimals = 2) {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

onUnmounted(() => {
	if (localPreviewUrl.value?.startsWith("blob:")) {
		URL.revokeObjectURL(localPreviewUrl.value);
	}
});
</script>
