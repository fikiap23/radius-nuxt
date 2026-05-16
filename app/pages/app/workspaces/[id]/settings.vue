<template>
	<div class="app-page space-y-6">
		<UiAppPageIntro
			v-if="workspace"
			:eyebrow="workspace.slug"
			:title="workspace.name"
			description="Workspace settings and members"
		/>

		<UAlert
			v-else
			color="warning"
			variant="soft"
			icon="i-lucide-triangle-alert"
			title="Workspace not found"
			description="This workspace does not exist or you do not have access."
		>
			<template #actions>
				<UButton
					label="All workspaces"
					to="/app/workspaces"
					size="sm"
				/>
			</template>
		</UAlert>

		<template v-if="workspace">
			<UTabs
				:items="tabs"
				class="w-full"
			>
				<template #general>
					<UiAppCard
						title="General"
						description="Name and URL slug for this workspace"
						icon="i-lucide-settings-2"
					>
						<form
							class="max-w-lg space-y-4"
							@submit.prevent="onSaveGeneral"
						>
							<UFormField
								label="Name"
								name="name"
								required
							>
								<UInput
									v-model="generalForm.name"
									:disabled="!canManage"
								/>
							</UFormField>

							<UFormField
								label="Slug"
								name="slug"
								hint="Used in URLs"
							>
								<UInput
									v-model="generalForm.slug"
									:disabled="!canManage"
								/>
							</UFormField>

							<UAlert
								v-if="generalError"
								color="error"
								variant="soft"
								:title="generalError"
							/>

							<UButton
								v-if="canManage"
								type="submit"
								label="Save changes"
								:loading="generalLoading"
							/>
						</form>
					</UiAppCard>
				</template>

				<template #members>
					<UiAppCard
						title="Invite member"
						description="Send an invite by email with a role"
						icon="i-lucide-user-plus"
					>
						<WorkspaceWorkspaceInviteForm
							:workspace-id="workspace.id"
							:disabled="!canInvite"
						/>
					</UiAppCard>

					<UiAppCard
						class="mt-4"
						title="Members"
						:description="`${members.length} people in this workspace`"
						icon="i-lucide-users"
					>
						<WorkspaceWorkspaceMemberList
							:members="members"
							:my-role="myRoleInWorkspace"
						/>
					</UiAppCard>
				</template>
			</UTabs>
		</template>
	</div>
</template>

<script setup lang="ts">
import { canInviteMembers, canManageWorkspace } from "~/config/workspace-roles";
import { APP_NAME } from "~/config/brand";

const route = useRoute();
const workspaceId = computed(() => route.params.id as string);

const {
	getWorkspaceById,
	getMembersForWorkspace,
	getMyRoleInWorkspace,
	updateWorkspace,
	setActiveWorkspace,
} = useWorkspace();

const toast = useToast();

const workspace = computed(() => getWorkspaceById(workspaceId.value));
const members = computed(() => getMembersForWorkspace(workspaceId.value));
const myRoleInWorkspace = computed(() =>
	getMyRoleInWorkspace(workspaceId.value),
);
const canManage = computed(() => canManageWorkspace(myRoleInWorkspace.value));
const canInvite = computed(() => canInviteMembers(myRoleInWorkspace.value));

definePageMeta({
	layout: "app",
	middleware: "auth",
	appTitle: "Workspace settings",
});

useSeoMeta({
	title: () =>
		workspace.value
			? `${workspace.value.name} — Settings — ${APP_NAME}`
			: `Workspace settings — ${APP_NAME}`,
});

onMounted(async () => {
	if (workspace.value) {
		await setActiveWorkspace(workspace.value.id);
	}
});

const tabs = [
	{ label: "General", slot: "general", icon: "i-lucide-settings-2" },
	{ label: "Members", slot: "members", icon: "i-lucide-users" },
];

const generalForm = reactive({
	name: "",
	slug: "",
});

watch(
	workspace,
	ws => {
		if (ws) {
			generalForm.name = ws.name;
			generalForm.slug = ws.slug;
		}
	},
	{ immediate: true },
);

const generalLoading = ref(false);
const generalError = ref<string | null>(null);

async function onSaveGeneral() {
	if (!workspace.value || !canManage.value) {
		return;
	}

	generalError.value = null;
	generalLoading.value = true;

	const result = await updateWorkspace(workspace.value.id, {
		name: generalForm.name,
		slug: generalForm.slug,
	});

	generalLoading.value = false;

	if (!result.ok) {
		generalError.value = result.error;
		return;
	}

	toast.add({
		title: "Workspace updated",
		color: "success",
		icon: "i-lucide-check",
	});
}
</script>
