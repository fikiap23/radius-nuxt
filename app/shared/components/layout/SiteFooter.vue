<template>
	<footer class="border-t border-muted bg-muted/30">
		<div class="mx-auto max-w-app px-page py-12">
			<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
				<div class="space-y-4 lg:col-span-2">
					<LayoutBrandLogo show-tagline />
					<p class="max-w-sm text-sm text-muted leading-relaxed">
						{{ APP_DESCRIPTION }}
					</p>
				</div>

				<div>
					<p class="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
						Product
					</p>
					<ul class="space-y-2 text-sm">
						<li>
							<ULink
								to="#features"
								class="text-default hover:text-primary"
							>
								Features
							</ULink>
						</li>
						<li>
							<ULink
								to="#pricing"
								class="text-default hover:text-primary"
							>
								Pricing
							</ULink>
						</li>
						<li>
							<ULink
								to="/auth/register"
								class="text-default hover:text-primary"
							>
								Get started
							</ULink>
						</li>
					</ul>
				</div>

				<div>
					<p class="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
						Legal
					</p>
					<ul class="space-y-2 text-sm">
						<li>
							<ULink
								to="/terms"
								class="text-default hover:text-primary"
							>
								Terms
							</ULink>
						</li>
						<li>
							<ULink
								to="/privacy"
								class="text-default hover:text-primary"
							>
								Privacy
							</ULink>
						</li>
					</ul>
				</div>
			</div>

			<div
				class="mt-10 flex flex-col gap-4 border-t border-muted pt-8 sm:flex-row sm:items-center sm:justify-between"
			>
				<p class="text-sm text-muted">
					&copy; {{ year }} {{ APP_NAME }}. All rights reserved.
				</p>
				<div class="flex gap-2">
					<UButton
						icon="i-simple-icons-github"
						color="neutral"
						variant="ghost"
						size="sm"
						aria-label="GitHub"
						to="https://github.com"
						target="_blank"
					/>
					<UButton
						icon="i-simple-icons-x"
						color="neutral"
						variant="ghost"
						size="sm"
						aria-label="X"
						to="https://x.com"
						target="_blank"
					/>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { APP_DESCRIPTION, APP_NAME } from "~/config/brand";

const year = new Date().getFullYear();
</script>
