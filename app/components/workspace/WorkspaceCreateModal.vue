<template>
	<UModal
		v-model:open="open"
		title="Create workspace"
		description="Organize projects and members in a dedicated space."
	>
		<template #body>
			<UForm
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					label="Name"
					name="name"
					required
				>
					<UInput
						v-model="state.name"
						placeholder="Acme Inc."
						autocomplete="organization"
						@update:model-value="onNameChange"
					/>
				</UFormField>

				<UFormField
					label="URL slug"
					name="slug"
					hint="Used in workspace URLs"
				>
					<UInput
						v-model="state.slug"
						placeholder="acme-inc"
						autocomplete="off"
						@input="slugTouched = true"
					/>
				</UFormField>

				<UAlert
					v-if="error"
					color="error"
					variant="soft"
					icon="i-lucide-circle-alert"
					:title="error"
				/>

				<div class="flex justify-end gap-2 pt-2">
					<UButton
						label="Cancel"
						color="neutral"
						variant="outline"
						@click="open = false"
					/>
					<UButton
						type="submit"
						label="Create workspace"
						:loading="loading"
						icon="i-lucide-plus"
					/>
				</div>
			</UForm>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { slugifyWorkspaceName } from "~/utils/workspace";

const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
	created: [workspaceId: string];
}>();

const { createWorkspace } = useWorkspace();
const toast = useToast();

const loading = ref(false);
const error = ref<string | null>(null);
const slugTouched = ref(false);

const state = reactive({
	name: "",
	slug: "",
});

watch(open, isOpen => {
	if (!isOpen) {
		state.name = "";
		state.slug = "";
		error.value = null;
		slugTouched.value = false;
	}
});

function onNameChange() {
	if (!slugTouched.value) {
		state.slug = slugifyWorkspaceName(state.name);
	}
}

async function onSubmit() {
	error.value = null;
	loading.value = true;

	const result = await createWorkspace({
		name: state.name,
		slug: state.slug,
	});

	loading.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({
		title: "Workspace created",
		description: `${result.workspace.name} is ready.`,
		color: "success",
		icon: "i-lucide-building-2",
	});

	open.value = false;
	emit("created", result.workspace.id);
}
</script>
