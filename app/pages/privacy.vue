<template>
	<LegalPageShell
		title="Privacy Policy"
		description="How Radius collects, uses, and protects your data when you manage projects and collaborate with your team."
		updated-at="May 16, 2026"
		:sections="sections"
		alternate-to="/terms"
		alternate-label="Terms of Service"
	>
		<template #intro>
			We respect your privacy. This policy explains what information we collect
			when you use {{ APP_NAME }}, how we use it, and the choices you have. It
			applies to our website, application, and related services.
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
import { APP_NAME } from "~/core/config/brand";

definePageMeta({ layout: "landing" });

useSeoMeta({
	title: `Privacy Policy — ${APP_NAME}`,
	description: `Privacy Policy for ${APP_NAME} project management platform.`,
});

const sections = [
	{ id: "overview", title: "Overview" },
	{ id: "data-we-collect", title: "Data we collect" },
	{ id: "how-we-use", title: "How we use data" },
	{ id: "sharing", title: "Sharing" },
	{ id: "security", title: "Security" },
	{ id: "retention", title: "Retention" },
	{ id: "your-rights", title: "Your rights" },
	{ id: "cookies", title: "Cookies" },
	{ id: "children", title: "Children" },
	{ id: "contact", title: "Contact" },
];

const content = [
	{
		id: "overview",
		title: "1. Overview",
		paragraphs: [
			"Radius is a project management platform. We process personal data to provide accounts, workspaces, collaboration features, and customer support.",
			"Data controller contact: privacy@radius.app. For EU/UK users, we process data under lawful bases such as contract performance, legitimate interests, and consent where required.",
		],
	},
	{
		id: "data-we-collect",
		title: "2. Data we collect",
		paragraphs: ["We may collect the following categories of information:"],
		list: [
			"Account data: name, email, profile photo, authentication provider identifiers.",
			"Workspace data: organization name, membership, roles, billing contact.",
			"Content you submit: tasks, comments, files, sprint data, and activity logs.",
			"Usage data: pages viewed, feature usage, device type, IP address, and approximate location derived from IP.",
			"Support communications: messages you send to our help team.",
		],
	},
	{
		id: "how-we-use",
		title: "3. How we use your data",
		paragraphs: [
			"We use personal data to operate and improve Radius, including hosting your workspaces, syncing boards, sending notifications, preventing abuse, and analyzing aggregated usage trends.",
			"We may send product updates and onboarding emails. You can opt out of non-essential marketing messages at any time.",
		],
	},
	{
		id: "sharing",
		title: "4. When we share data",
		paragraphs: [
			"We do not sell your personal information. We share data only as needed to run the service:",
		],
		list: [
			"Infrastructure and analytics providers under data processing agreements.",
			"Payment processors when you subscribe to a paid plan.",
			"Other workspace members according to your role and visibility settings.",
			"Authorities when required by law or to protect rights and safety.",
		],
	},
	{
		id: "security",
		title: "5. Security",
		paragraphs: [
			"We use industry-standard measures including encryption in transit, access controls, and monitoring. No method of transmission or storage is completely secure; please use a strong password and enable available security features.",
		],
	},
	{
		id: "retention",
		title: "6. Data retention",
		paragraphs: [
			"We retain account and workspace data while your account is active. After deletion, we remove or anonymize data within a reasonable period unless we must keep it for legal, security, or backup obligations.",
		],
	},
	{
		id: "your-rights",
		title: "7. Your rights",
		paragraphs: [
			"Depending on your location, you may have rights to access, correct, delete, export, or restrict processing of your personal data, and to object to certain processing.",
			"To exercise these rights, contact privacy@radius.app. We will respond within the timeframe required by applicable law.",
		],
	},
	{
		id: "cookies",
		title: "8. Cookies & similar technologies",
		paragraphs: [
			"We use essential cookies for authentication and session management. Analytics cookies, if enabled, help us understand how the product is used. You can manage preferences in your browser and through in-app settings where available.",
		],
	},
	{
		id: "children",
		title: "9. Children's privacy",
		paragraphs: [
			"Radius is not directed at children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us data, contact us to request deletion.",
		],
	},
	{
		id: "contact",
		title: "10. Contact & updates",
		paragraphs: [
			"We may update this Privacy Policy from time to time. Material changes will be posted with a revised date. Questions: privacy@radius.app.",
		],
	},
];
</script>
