<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'

	let {
		href,
		class: className = '',
		children,
		...rest
	}: { href: string; class?: string; children: Snippet } & HTMLAnchorAttributes = $props()
</script>

<a
	{href}
	class="pointer-events-auto inline-flex items-center justify-center rounded-full bg-chrome text-chrome-ink {className}"
	data-sveltekit-noscroll
	{...rest}
>
	{@render children()}
</a>
