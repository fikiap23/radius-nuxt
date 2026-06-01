<template>
	<form
		class="space-y-4"
		@submit.prevent="onSubmit"
	>
		<div class="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
			<UFormField
				label="Email"
				name="email"
				required
			>
				<UInput
					v-model="email"
					type="email"
					placeholder="teammate@company.com"
					autocomplete="email"
					:disabled="disabled"
				/>
			</UFormField>

			<UFormField
				label="Role"
				name="role"
				class="sm:min-w-36"
			>
				<USelect
					v-model="role"
					:items="INVITE_ROLE_OPTIONS"
					value-key="value"
					label-key="label"
					:disabled="disabled"
				/>
			</UFormField>

			<UButton
				type="submit"
				label="Send invite"
				icon="i-lucide-user-plus"
				:loading="loading"
				:disabled="disabled"
				class="sm:mb-0.5"
			/>
		</div>

		<UAlert
			v-if="error"
			color="error"
			variant="soft"
			icon="i-lucide-circle-alert"
			:title="error"
		/>
	</form>
</template>

<script setup lang="ts">
import { INVITE_ROLE_OPTIONS } from "~/features/workspace/config/workspace-roles";
import type { InvitableWorkspaceRole } from "~/features/workspace/config/workspace-roles";

const props = defineProps<{
	workspaceId: string;
	disabled?: boolean;
}>();

const emit = defineEmits<{
	invited: [];
}>();

const { inviteMember } = useWorkspace();
const toast = useToast();

const email = ref("");
const role = ref<InvitableWorkspaceRole>("member");
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
	if (props.disabled) {
		return;
	}

	error.value = null;
	loading.value = true;

	const result = await inviteMember(props.workspaceId, {
		email: email.value,
		role: role.value,
	});

	loading.value = false;

	if (!result.ok) {
		error.value = result.error;
		return;
	}

	toast.add({
		title: "Invite sent",
		description: `${email.value} will appear as pending until they accept.`,
		color: "success",
		icon: "i-lucide-mail",
	});

	email.value = "";
	role.value = "member";
	emit("invited");
}
</script>
