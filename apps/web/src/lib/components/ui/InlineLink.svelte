<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import IconEmail from './IconEmail.svelte'
	import IconGithub from './IconGithub.svelte'
	import IconLinkedIn from './IconLinkedIn.svelte'

	let {
		href,
		class: className = '',
		icon,
		children,
		...rest
	}: {
		href: string
		class?: string
		icon?: 'email' | 'github' | 'linkedin'
		children: Snippet
	} & HTMLAnchorAttributes = $props()
</script>

<span class="relative inline-flex h-[1.25em]">
	<a
		{href}
		class="inline-flex h-[1.25em] items-center gap-[0.28em] rounded-full px-2.5 ring-[0.08em] ring-transparent transition-colors hover:text-[#E08925] hover:ring-current focus-visible:text-[#E08925] focus-visible:ring-current {className}"
		{...rest}
	>
		{#if icon === 'email'}
			<span class="inline-flex size-[0.9em] shrink-0"><IconEmail /></span>
		{:else if icon === 'github'}
			<span class="inline-flex size-[0.9em] shrink-0"><IconGithub /></span>
		{:else if icon === 'linkedin'}
			<span class="inline-flex size-[0.78em] shrink-0"><IconLinkedIn /></span>
		{/if}
		<span class="text-[0.9em] tracking-[-0.02em]">{@render children()}</span>
	</a>
</span>
