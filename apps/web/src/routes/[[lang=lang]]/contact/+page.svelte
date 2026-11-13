<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import Button from '$lib/components/ui/Button.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const s = $derived(data.settings)
	let copied = $state(false)

	async function copyEmail() {
		if (!s.email) return
		try {
			await navigator.clipboard.writeText(s.email)
			copied = true
			flashCopied()
			sfx.confirm()
			setTimeout(() => (copied = false), 2000)
		} catch {
			window.location.href = `mailto:${s.email}`
		}
	}
</script>

<main id="main">
	<div class="page-shell">
		<PageHeader label={t('contact.label')} title={t('contact.title')} lead={s.bio} />

		<section class="reach reveal" style="--i:3" aria-label={t('contact.reach')}>
			{#if s.email}
				<button type="button" class="email" onclick={copyEmail} use:sound={{ click: false }}>
					<span>{s.email}</span>
					<span class="font-label">{copied ? t('common.copied') : t('common.copy')}</span>
				</button>
			{/if}
			<div class="links">
				{#if s.linkedin}<Button href={s.linkedin} variant="ghost" target="_blank" rel="noopener noreferrer">LinkedIn</Button>{/if}
				{#if s.github}<Button href={s.github} variant="ghost" target="_blank" rel="noopener noreferrer">GitHub</Button>{/if}
				{#if s.cv}<Button href={s.cv} variant="ghost" target="_blank" rel="noopener noreferrer">{t('contact.cv')}</Button>{/if}
			</div>
		</section>

		<section class="lists">
			<div>
				<h2 class="font-label">{t('contact.experience')}</h2>
				<ul>
					{#each s.experiences as x (x.org)}
						<li><b>{x.org}</b><span>{x.role}</span></li>
					{/each}
				</ul>
			</div>
			<div>
				<h2 class="font-label">{t('contact.awards')}</h2>
				<ul>
					{#each s.awards as a (a.org)}
						<li><b>{a.org}</b><span>{a.role}</span></li>
					{/each}
				</ul>
			</div>
		</section>
	</div>
</main>

<style>
	.reach {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		padding-bottom: clamp(3rem, 8vh, 5rem);
	}
	.email {
		display: inline-flex;
		align-items: baseline;
		gap: 1rem;
		max-width: 100%;
		padding: 0;
		border: 0;
		border-bottom: 1px solid var(--rule);
		background: transparent;
		color: var(--fg);
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: 1.15;
		letter-spacing: var(--text-h2--letter-spacing);
		text-align: left;
		overflow-wrap: anywhere;
		cursor: pointer;
		transition: border-color 200ms var(--ease);
	}
	.email:hover {
		border-color: var(--fg);
	}
	.email .font-label {
		flex: none;
		color: var(--accent);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.lists {
		display: grid;
		gap: 2.5rem;
		padding-bottom: clamp(4rem, 10vh, 7rem);
	}
	h2 {
		margin: 0 0 1rem;
		color: var(--fg-muted);
		font-weight: 500;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 0;
		border-top: 1px solid var(--rule);
	}
	li span {
		color: var(--fg-muted);
		text-align: right;
	}
	@media (min-width: 768px) {
		.lists {
			grid-template-columns: repeat(2, 1fr);
			gap: 4rem;
		}
	}
</style>
