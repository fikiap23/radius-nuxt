<template>
	<section class="space-y-2">
		<h3 class="text-sm font-medium text-highlighted">
			Attachments
		</h3>

		<ul
			v-if="items.length"
			class="divide-y divide-muted/60 rounded-lg border border-muted"
		>
			<li
				v-for="file in items"
				:key="file.id"
				class="px-3 py-2"
			>
				<div class="flex items-center gap-3">
					<a
						v-if="file.url && isImageAttachment(file.mimeType)"
						:href="file.url"
						target="_blank"
						rel="noopener noreferrer"
						class="shrink-0 overflow-hidden rounded-md border border-muted"
						:aria-label="`View ${file.name}`"
					>
						<img
							:src="file.url"
							:alt="file.name"
							class="size-10 object-cover"
							loading="lazy"
						>
					</a>
					<UIcon
						v-else
						:name="attachmentIcon(file.mimeType)"
						class="size-4 shrink-0 text-muted"
					/>

					<div class="min-w-0 flex-1">
						<a
							v-if="file.url"
							:href="file.url"
							target="_blank"
							rel="noopener noreferrer"
							class="block truncate text-sm font-medium text-primary hover:underline"
						>
							{{ file.name }}
						</a>
						<p
							v-else
							class="truncate text-sm font-medium text-highlighted"
						>
							{{ file.name }}
						</p>
						<p class="text-xs text-muted">
							{{ formatFileSize(file.size) }}
						</p>
					</div>

					<div class="flex shrink-0 items-center gap-0.5">
						<UButton
							v-if="file.url"
							icon="i-lucide-external-link"
							color="neutral"
							variant="ghost"
							size="xs"
							:aria-label="`Open ${file.name}`"
							:to="file.url"
							target="_blank"
						/>
						<UButton
							icon="i-lucide-trash-2"
							color="neutral"
							variant="ghost"
							size="xs"
							aria-label="Remove attachment"
							:loading="removingId === file.id"
							@click="onRemove(file.id)"
						/>
					</div>
				</div>

				<a
					v-if="file.url && isImageAttachment(file.mimeType)"
					:href="file.url"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-2 block overflow-hidden rounded-lg border border-muted"
				>
					<img
						:src="file.url"
						:alt="file.name"
						class="max-h-48 w-full object-contain bg-elevated"
						loading="lazy"
					>
				</a>
			</li>
		</ul>

		<div class="flex flex-wrap items-center gap-2">
			<input
				ref="fileInput"
				type="file"
				class="sr-only"
				@change="onFileChange"
			>
			<UButton
				label="Upload file"
				icon="i-lucide-upload"
				size="sm"
				variant="outline"
				color="neutral"
				:loading="uploading"
				@click="fileInput?.click()"
			/>
			<p class="text-xs text-muted">
				Max file size depends on workspace policy.
			</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { TaskAttachment } from "~/features/task/types/task";
import {
	attachmentIcon,
	formatFileSize,
	isImageAttachment,
} from "~/features/task/utils/task";

defineProps<{
	items: TaskAttachment[];
	uploading?: boolean;
	removingId?: string | null;
}>();

const emit = defineEmits<{
	upload: [file: File];
	remove: [attachmentId: string];
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	if (file) {
		emit("upload", file);
	}
	input.value = "";
}

function onRemove(id: string) {
	emit("remove", id);
}
</script>
