<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import Button from '$lib/components/ui/Button.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { aboutCopy } from '$lib/data/about'
	import { currentLang, href, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const copy = $derived(aboutCopy(currentLang()))
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
		<PageHeader label={copy.label} title={copy.title} lead={copy.lead} />

		<section class="block story" aria-label={copy.label}>
			<div class="prose">
				{#each copy.story as p (p)}<p>{p}</p>{/each}
			</div>
		</section>

		<section class="block" aria-labelledby="building-h">
			<h2 id="building-h" class="font-label label">{copy.building.label}</h2>
			<div class="prose">
				{#each copy.building.paragraphs as p (p)}<p>{p}</p>{/each}
			</div>
		</section>

		<section class="block" aria-labelledby="cred-h">
			<h2 id="cred-h" class="font-label label">{copy.credentialsLabel}</h2>
			<ul class="rows">
				{#each s.experiences ?? [] as x (x.org)}
					<li><b>{x.org}</b><span>{x.role}</span></li>
				{/each}
				{#each s.awards ?? [] as a (a.org)}
					<li><b>{a.org}</b><span>{a.role}</span></li>
				{/each}
			</ul>
		</section>

		<section class="cta" aria-labelledby="cta-h">
			<h2 id="cta-h">{copy.cta.title}</h2>
			<p>{copy.cta.body}</p>
			<div class="ctas">
				<Button href={href('/work-with-me#enquire')}>{copy.cta.button}</Button>
			</div>

			<h3 class="font-label label elsewhere">{copy.elsewhereLabel}</h3>
			<div class="reach" aria-label={t('contact.reach')}>
				{#if s.email}
					<button type="button" class="email" onclick={copyEmail} use:sound={{ click: false }}>
						<span>{s.email}</span>
						<span class="font-label">{copied ? t('common.copied') : t('common.copy')}</span>
					</button>
				{/if}
				<div class="links">
					{#if s.linkedin}<Button href={s.linkedin} variant="ghost" target="_blank" rel="noopener noreferrer">LinkedIn</Button>{/if}
					{#if s.github}<Button href={s.github} variant="ghost" target="_blank" rel="noopener noreferrer">GitHub</Button>{/if}
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.block {
		padding: 0 0 clamp(3rem, 8vh, 5rem);
	}
	.label {
		margin: 0 0 1rem;
		color: var(--fg-muted);
		font-weight: 500;
	}
	.prose {
		max-width: 38rem;
	}
	.prose p {
		margin: 0 0 1.25rem;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
		color: var(--fg-muted);
	}
	.rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.rows li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 0;
		border-top: 1px solid var(--rule);
	}
	.rows li:last-child {
		border-bottom: 1px solid var(--rule);
	}
	.rows span {
		color: var(--fg-muted);
		text-align: right;
	}

	.cta {
		padding: clamp(2rem, 6vh, 4rem) 0 clamp(4rem, 12vh, 8rem);
	}
	.cta h2 {
		margin: 0;
		max-width: 16ch;
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: var(--text-h1--line-height);
		letter-spacing: var(--text-h1--letter-spacing);
		font-weight: 400;
	}
	.cta > p {
		max-width: 32rem;
		margin: 1rem 0 0;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.ctas {
		margin-top: 1.75rem;
	}
	.elsewhere {
		margin-top: clamp(3rem, 8vh, 5rem);
	}
	.reach {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
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

</style>
