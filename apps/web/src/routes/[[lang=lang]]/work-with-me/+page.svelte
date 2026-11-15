<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import Button from '$lib/components/ui/Button.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { services } from '$lib/data/services'
	import { currentLang, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const list = $derived(services(currentLang()))
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
		<PageHeader label={t('wwm.label')} title={t('wwm.title')} lead={t('wwm.lead')} />
		<ol class="services">
			{#each list as service, i (service.id)}
				<li class="reveal" style="--i:{i}">
					<span class="num font-label">0{i + 1}</span>
					<div>
						<h2>{service.title}</h2>
						<p>{service.summary}</p>
						<ul class="tags">
							{#each service.deliverables as d (d)}<li>{d}</li>{/each}
						</ul>
					</div>
				</li>
			{/each}
		</ol>

		<section id="contact" class="contact" aria-labelledby="contact-h">
			<p class="font-label label">{t('contact.label')}</p>
			<h2 id="contact-h" class="title">{t('contact.title')}</h2>
			{#if s.bio}<p class="bio">{s.bio}</p>{/if}

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
					{#if s.cv}<Button href={s.cv} variant="ghost" target="_blank" rel="noopener noreferrer">{t('contact.cv')}</Button>{/if}
				</div>
			</div>

			<div class="lists">
				<div>
					<h3 class="font-label">{t('contact.experience')}</h3>
					<ul class="rows">
						{#each s.experiences as x (x.org)}
							<li><b>{x.org}</b><span>{x.role}</span></li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="font-label">{t('contact.awards')}</h3>
					<ul class="rows">
						{#each s.awards as a (a.org)}
							<li><b>{a.org}</b><span>{a.role}</span></li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.services {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.services > li {
		display: grid;
		gap: 0.75rem 2rem;
		padding: 1.75rem 0;
		border-top: 1px solid var(--rule);
	}
	.services > li:last-child {
		border-bottom: 1px solid var(--rule);
	}
	.num {
		color: var(--fg-muted);
	}
	.services h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.services p {
		max-width: 36rem;
		margin: 0 0 1rem;
		line-height: 1.55;
		color: var(--fg-muted);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.tags li {
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.875rem;
	}

	.contact {
		padding: clamp(4rem, 12vh, 7rem) 0 clamp(4rem, 10vh, 7rem);
		/* Clears the fixed nav when jumped to via #contact. */
		scroll-margin-top: 4rem;
	}
	.label {
		margin: 0 0 1rem;
		color: var(--fg-muted);
	}
	.title {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: var(--text-h1--line-height);
		letter-spacing: var(--text-h1--letter-spacing);
		font-weight: 400;
	}
	.bio {
		max-width: 38rem;
		margin: 1.25rem 0 0;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
		color: var(--fg-muted);
	}
	.reach {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		padding: 2.5rem 0 clamp(3rem, 8vh, 5rem);
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
	}
	.lists h3 {
		margin: 0 0 1rem;
		color: var(--fg-muted);
		font-weight: 500;
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
	.rows span {
		color: var(--fg-muted);
		text-align: right;
	}

	@media (min-width: 768px) {
		.services > li {
			grid-template-columns: 5rem 1fr;
		}
		.lists {
			grid-template-columns: repeat(2, 1fr);
			gap: 4rem;
		}
	}
</style>
