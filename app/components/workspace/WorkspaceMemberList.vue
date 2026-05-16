<template>
	<div class="space-y-3">
		<div
			v-if="members.length === 0"
			class="rounded-xl border border-dashed border-muted px-4 py-8 text-center text-sm text-muted"
		>
			No members yet. Invite someone to collaborate.
		</div>

		<ul
			v-else
			class="divide-y divide-muted rounded-xl border border-muted"
		>
			<li
				v-for="member in members"
				:key="member.id"
				class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex min-w-0 items-center gap-3">
					<UAvatar
						:text="memberInitials(member.name)"
						size="sm"
						class="shrink-0"
					/>
					<div class="min-w-0">
						<p class="truncate font-medium text-highlighted">
							{{ member.name }}
							<UBadge
								v-if="member.status === 'pending'"
								color="warning"
								variant="subtle"
								size="xs"
								class="ms-2 align-middle"
							>
								Pending
							</UBadge>
						</p>
						<p class="truncate text-sm text-muted">
							{{ member.email }}
						</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-2 sm:justify-end">
					<WorkspaceRoleBadge :role="member.role" />

					<USelect
						v-if="canEdit && member.role !== 'owner'"
						:model-value="member.role"
						:items="editableRoles"
						value-key="value"
						label-key="label"
						size="sm"
						class="min-w-28"
						@update:model-value="(value: WorkspaceRole) => onRoleChange(member.id, value)"
					/>

					<UButton
						v-if="canEdit && member.role !== 'owner'"
						icon="i-lucide-trash-2"
						color="error"
						variant="ghost"
						size="sm"
						aria-label="Remove member"
						@click="confirmRemove(member)"
					/>
				</div>
			</li>
		</ul>

		<UModal
			v-if="removeOpen"
			v-model:open="removeOpen"
			title="Remove member"
			:description="removeTarget ? `Remove ${removeTarget.name} from this workspace?` : undefined"
		>
			<template #footer>
				<UButton
					label="Cancel"
					color="neutral"
					variant="outline"
					@click="removeOpen = false"
				/>
				<UButton
					label="Remove"
					color="error"
					:loading="removeLoading"
					@click="onRemoveConfirm"
				/>
			</template>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import { MEMBER_ROLE_OPTIONS, canManageWorkspace } from "~/config/workspace-roles";
import type { WorkspaceMember, WorkspaceRole } from "~/types/workspace";
import { workspaceInitials } from "~/utils/workspace";

const props = defineProps<{
	members: WorkspaceMember[];
	myRole: WorkspaceRole | null;
}>();

const { updateMemberRole, removeMember } = useWorkspace();
const toast = useToast();

const canEdit = computed(() => canManageWorkspace(props.myRole));

const editableRoles = computed(() =>
	MEMBER_ROLE_OPTIONS.filter(option => option.value !== "owner"),
);

const removeOpen = ref(false);
const removeLoading = ref(false);
const removeTarget = ref<WorkspaceMember | null>(null);

function memberInitials(name: string) {
	return workspaceInitials(name);
}

async function onRoleChange(memberId: string, role: WorkspaceRole) {
	const result = await updateMemberRole(memberId, role);
	if (!result.ok) {
		toast.add({
			title: "Could not update role",
			description: result.error,
			color: "error",
		});
	}
}

function confirmRemove(member: WorkspaceMember) {
	removeTarget.value = member;
	removeOpen.value = true;
}

async function onRemoveConfirm() {
	if (!removeTarget.value) {
		return;
	}

	removeLoading.value = true;
	const result = await removeMember(removeTarget.value.id);
	removeLoading.value = false;

	if (!result.ok) {
		toast.add({
			title: "Could not remove member",
			description: result.error,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Member removed",
		color: "success",
	});

	removeOpen.value = false;
	removeTarget.value = null;
}
</script>
