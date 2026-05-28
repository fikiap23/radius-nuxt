<template>
	<UModal
		v-model:open="open"
		title="Formatting help"
		description="Keyboard shortcuts and Markdown tips"
	>
		<template #body>
			<div class="space-y-6 text-sm">
				<section>
					<h3 class="mb-2 font-semibold text-highlighted">
						Text style
					</h3>
					<ul class="rich-text-help-table">
						<li><span>Normal text</span><kbd>Ctrl Alt 0</kbd></li>
						<li><span>Heading 1</span><kbd>Ctrl Alt 1</kbd></li>
						<li><span>Heading 2</span><kbd>Ctrl Alt 2</kbd></li>
						<li><span>Heading 3</span><kbd>Ctrl Alt 3</kbd></li>
					</ul>
				</section>

				<section>
					<h3 class="mb-2 font-semibold text-highlighted">
						Inline formatting
					</h3>
					<ul class="rich-text-help-table">
						<li><span>Bold</span><kbd>Ctrl B</kbd></li>
						<li><span>Italic</span><kbd>Ctrl I</kbd></li>
						<li><span>Underline</span><kbd>Ctrl U</kbd></li>
						<li><span>Strikethrough</span><kbd>Ctrl Shift S</kbd></li>
						<li><span>Inline code</span><kbd>Ctrl E</kbd></li>
					</ul>
				</section>

				<section>
					<h3 class="mb-2 font-semibold text-highlighted">
						Blocks &amp; lists
					</h3>
					<ul class="rich-text-help-table">
						<li><span>Bullet list</span><kbd>Ctrl Shift 8</kbd></li>
						<li><span>Numbered list</span><kbd>Ctrl Shift 7</kbd></li>
						<li><span>Quote</span><kbd>Ctrl Shift .</kbd></li>
						<li><span>Code block</span><kbd>Ctrl Alt C</kbd></li>
					</ul>
				</section>

				<section>
					<h3 class="mb-2 font-semibold text-highlighted">
						Markdown (paste)
					</h3>
					<p class="text-muted leading-relaxed">
						Paste Markdown directly — lists, links, and inline code are converted automatically.
					</p>
					<pre class="mt-2 rounded-lg border border-muted bg-muted/30 p-3 text-xs text-toned">**bold** · *italic* · `code` · [link](https://)</pre>
				</section>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });
</script>
