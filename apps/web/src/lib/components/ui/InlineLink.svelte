<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import { flashCopied } from '$lib/cursorNotice.svelte'
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

	const copyEmail = $derived(icon === 'email' ? href.replace(/^mailto:/i, '') : '')

	async function onCopy(event: MouseEvent) {
		if (!copyEmail) return
		event.preventDefault()
		try {
			await navigator.clipboard.writeText(copyEmail)
			flashCopied()
		} catch {
			window.location.href = href
		}
	}
</script>

<span class="relative inline-flex h-[1.25em]">
	<a
		{href}
		class="inline-flex h-[1.25em] items-center gap-[0.28em] rounded-full px-2.5 ring-[0.08em] ring-transparent transition-colors hover:ring-chrome-ink focus-visible:ring-chrome-ink {className}"
		{...rest}
		aria-label={copyEmail ? 'Copy email address' : rest['aria-label']}
		onclick={copyEmail ? onCopy : undefined}
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
