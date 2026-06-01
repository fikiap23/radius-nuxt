import type { Component } from "vue";
import LandingIllustrationCollaboration from "./illustrations/LandingIllustrationCollaboration.vue";
import LandingIllustrationIssues from "./illustrations/LandingIllustrationIssues.vue";
import LandingIllustrationKanban from "./illustrations/LandingIllustrationKanban.vue";
import LandingIllustrationSprint from "./illustrations/LandingIllustrationSprint.vue";
import LandingIllustrationTasks from "./illustrations/LandingIllustrationTasks.vue";
import LandingIllustrationWorkspace from "./illustrations/LandingIllustrationWorkspace.vue";

export type LandingFeatureIllustrationId =
	| "workspace"
	| "kanban"
	| "sprint"
	| "tasks"
	| "issues"
	| "collaboration";

export const landingFeatureIllustrations: Record<
	LandingFeatureIllustrationId,
	Component
> = {
	workspace: LandingIllustrationWorkspace,
	kanban: LandingIllustrationKanban,
	sprint: LandingIllustrationSprint,
	tasks: LandingIllustrationTasks,
	issues: LandingIllustrationIssues,
	collaboration: LandingIllustrationCollaboration,
};
