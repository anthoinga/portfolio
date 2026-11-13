<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import { href, t } from '$lib/i18n'
	import type { SiteSettings } from '$lib/sanity/types'

	let { settings }: { settings: SiteSettings } = $props()

	const year = new Date().getFullYear()
	const links = $derived(
		[
			settings.email && { href: `mailto:${settings.email}`, label: t('footer.email') },
			settings.linkedin && { href: settings.linkedin, label: 'LinkedIn' },
			settings.github && { href: settings.github, label: 'GitHub' },
			settings.cv && { href: settings.cv, label: t('footer.cv') },
			{ href: href('/privacy'), label: t('footer.privacy') }
		].filter(Boolean) as { href: string; label: string }[]
	)
</script>

<footer class="page-shell footer">
	<p class="name">{settings.name} <span>© {year}</span></p>
	<ul>
		{#each links as link (link.label)}
			<li>
				<a
					href={link.href}
					target={link.href.startsWith('http') ? '_blank' : undefined}
					rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
					use:sound>{link.label}</a
				>
			</li>
		{/each}
	</ul>
</footer>

<style>
	.footer {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem 2rem;
		padding: 3rem 0 2.5rem;
		border-top: 1px solid var(--rule);
		font-size: 0.9375rem;
		color: var(--fg-muted);
	}
	.name {
		margin: 0;
		color: var(--fg);
	}
	.name span {
		margin-left: 0.5rem;
		color: var(--fg-muted);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a {
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 4px;
		transition:
			color 200ms var(--ease),
			text-decoration-color 200ms var(--ease);
	}
	a:hover {
		color: var(--fg);
		text-decoration-color: currentColor;
	}
</style>
