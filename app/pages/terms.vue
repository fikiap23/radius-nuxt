<template>
	<LegalPageShell
		title="Terms of Service"
		description="The rules for using Radius workspaces, projects, and collaboration features."
		updated-at="May 16, 2026"
		:sections="sections"
		alternate-to="/privacy"
		alternate-label="Privacy Policy"
	>
		<template #intro>
			These terms govern your access to {{ APP_NAME }}, a project management
			platform operated for teams managing tasks, sprints, and workspaces. By
			creating an account, you agree to the conditions below.
		</template>

		<section
			v-for="section in content"
			:id="section.id"
			:key="section.id"
			class="legal-section"
		>
			<h2>{{ section.title }}</h2>
			<p
				v-for="(paragraph, i) in section.paragraphs"
				:key="i"
			>
				{{ paragraph }}
			</p>
			<ul v-if="section.list?.length">
				<li
					v-for="item in section.list"
					:key="item"
				>
					{{ item }}
				</li>
			</ul>
		</section>
	</LegalPageShell>
</template>

<script setup lang="ts">
import { APP_NAME } from "~/config/brand";

definePageMeta({ layout: "landing" });

useSeoMeta({
	title: `Terms of Service — ${APP_NAME}`,
	description: `Terms of Service for ${APP_NAME} project management platform.`,
});

const sections = [
	{ id: "acceptance", title: "Acceptance" },
	{ id: "accounts", title: "Accounts & workspaces" },
	{ id: "acceptable-use", title: "Acceptable use" },
	{ id: "content", title: "Your content" },
	{ id: "billing", title: "Plans & billing" },
	{ id: "availability", title: "Service availability" },
	{ id: "liability", title: "Liability" },
	{ id: "changes", title: "Changes" },
	{ id: "contact", title: "Contact" },
];

const content = [
	{
		id: "acceptance",
		title: "1. Acceptance of terms",
		paragraphs: [
			"Radius provides software for project management, including tasks, boards, sprints, and team collaboration. These Terms apply to all visitors, registered users, and workspace members.",
			"If you use Radius on behalf of an organization, you represent that you have authority to bind that organization to these Terms.",
		],
	},
	{
		id: "accounts",
		title: "2. Accounts & workspaces",
		paragraphs: [
			"You must provide accurate registration information and keep your credentials secure. You are responsible for activity under your account.",
			"Workspace owners control membership, roles (Owner, Admin, Member, Viewer), and billing settings. Owners may remove members and transfer ownership according to product rules.",
		],
		list: [
			"You may not share accounts between individuals.",
			"You must notify us promptly of unauthorized access.",
			"Trial and free tiers may include usage limits described on our pricing page.",
		],
	},
	{
		id: "acceptable-use",
		title: "3. Acceptable use",
		paragraphs: [
			"You agree not to misuse Radius or interfere with other users. Prohibited conduct includes:",
		],
		list: [
			"Uploading malware or attempting to breach our systems.",
			"Scraping or reverse-engineering the service except where law permits.",
			"Using the service for unlawful, harassing, or fraudulent purposes.",
			"Circumventing plan limits or security controls.",
		],
	},
	{
		id: "content",
		title: "4. Your content",
		paragraphs: [
			"You retain ownership of tasks, comments, files, and other material you submit. You grant Radius a limited license to host, process, and display that content solely to operate the service.",
			"You are responsible for ensuring you have rights to any content you upload and that it does not violate third-party rights.",
		],
	},
	{
		id: "billing",
		title: "5. Plans & billing",
		paragraphs: [
			"Paid plans renew according to the billing cycle you select unless cancelled. Fees are non-refundable except where required by law or stated in writing.",
			"We may change pricing with reasonable notice. Continued use after a price change constitutes acceptance for subsequent billing periods.",
		],
	},
	{
		id: "availability",
		title: "6. Service availability",
		paragraphs: [
			"We strive for high availability but do not guarantee uninterrupted access. Maintenance, updates, or factors outside our control may cause downtime.",
			"Features marked as beta, preview, or coming soon may change or be withdrawn without notice.",
		],
	},
	{
		id: "liability",
		title: "7. Limitation of liability",
		paragraphs: [
			"Radius is provided \"as is\" to the fullest extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from your use of the service.",
			"Our total liability for any claim related to the service is limited to the amount you paid us in the twelve months before the claim, or one hundred US dollars if you use a free plan.",
		],
	},
	{
		id: "changes",
		title: "8. Changes to these terms",
		paragraphs: [
			"We may update these Terms to reflect product changes or legal requirements. We will post the revised version with an updated date. Material changes may be communicated by email or in-app notice.",
		],
	},
	{
		id: "contact",
		title: "9. Contact",
		paragraphs: [
			"Questions about these Terms can be sent to legal@radius.app. For product support, use the in-app help center or your workspace admin.",
		],
	},
];
</script>
