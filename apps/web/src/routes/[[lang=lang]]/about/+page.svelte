<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import Button from '$lib/components/ui/Button.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { aboutCopy, type Item, type LinkItem } from '$lib/data/about'
	import { currentLang, href, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const copy = $derived(aboutCopy(currentLang()))
	const lead = $derived(copy.leadership)
	const ai = $derived(copy.ai)
	const s = $derived(data.settings)
	const n = (i: number) => String(i + 1).padStart(2, '0')
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

{#snippet numbered(items: (Item | LinkItem)[])}
	<ol class="numbered">
		{#each items as item, i (item.title)}
			<li>
				<span class="num font-label">{n(i)}</span>
				<div>
					<h4>{item.title}</h4>
					<p>{item.body}</p>
					{#if 'links' in item && item.links?.length}
						<p class="links-row">
							{#each item.links as l (l.href)}
								<a href={href(l.href)} use:sound>{l.label} →</a>
							{/each}
						</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
{/snippet}

<main id="main">
	<div class="page-shell">
		<PageHeader label={copy.label} title={copy.title} lead={copy.lead} />

		<!-- 01 About -->
		<section class="section" aria-labelledby="s1">
			<h2 id="s1" class="section-label font-label"><span>01</span>{copy.aboutLabel}</h2>
			<div class="prose">
				{#each copy.story as p (p)}<p>{p}</p>{/each}
			</div>

			<h3 class="sub">{copy.building.label}</h3>
			<div class="prose">
				{#each copy.building.paragraphs as p (p)}<p>{p}</p>{/each}
			</div>

			<h3 class="sub">{copy.credentialsLabel}</h3>
			<ul class="rows">
				{#each s.experiences ?? [] as x (x.org)}
					<li><b>{x.org}</b><span>{x.role}</span></li>
				{/each}
				{#each s.awards ?? [] as a (a.org)}
					<li><b>{a.org}</b><span>{a.role}</span></li>
				{/each}
			</ul>
		</section>

		<!-- 02 Leadership -->
		<section class="section" aria-labelledby="s2">
			<h2 id="s2" class="section-label font-label"><span>02</span>{lead.label}</h2>
			<p class="intro">{lead.intro}</p>

			<ul class="teams">
				{#each lead.teams as team (team.title)}
					<li>
						<h3>{team.title}</h3>
						<p>{team.body}</p>
					</li>
				{/each}
			</ul>

			<p class="transition">{lead.transition}</p>
			{@render numbered(lead.practices)}

			{#if lead.testimonial}
				<blockquote class="quote">
					<p>“{lead.testimonial.quote}”</p>
					<footer>{lead.testimonial.name} · {lead.testimonial.role}</footer>
				</blockquote>
			{/if}
		</section>

		<!-- 03 How I design for AI -->
		<section class="section" aria-labelledby="s3">
			<h2 id="s3" class="section-label font-label"><span>03</span>{ai.label}</h2>
			<p class="intro">{ai.intro}</p>

			<div class="part">
				<h3 class="sub">{ai.techniques.label}</h3>
				<p class="part-lead">{ai.techniques.lead}</p>
				{@render numbered(ai.techniques.items)}
			</div>

			<div class="part">
				<p class="part-lead">{ai.rules.lead}</p>
				{@render numbered(ai.rules.items)}
			</div>

			<div class="part">
				<h3 class="sub">{ai.ethics.label}</h3>
				<p class="part-lead">{ai.ethics.lead}</p>
				{@render numbered(ai.ethics.items)}
			</div>

			<div class="part">
				<h3 class="sub">{ai.toolkit.label}</h3>
				<p class="part-lead">{ai.toolkit.lead}</p>
				<div class="toolkit">
					{#each ai.toolkit.groups as g (g.title)}
						<div>
							<h4 class="font-label">{g.title}</h4>
							<ul>
								{#each g.items as tool (tool)}<li>{tool}</li>{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="cta" aria-labelledby="cta-h">
			<h2 id="cta-h">{copy.cta.title}</h2>
			<p>{copy.cta.body}</p>
			<div class="ctas">
				<Button href={href('/work-with-me#enquire')}>{copy.cta.button}</Button>
			</div>

			<h3 class="font-label elsewhere">{copy.elsewhereLabel}</h3>
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
	.section {
		padding: clamp(2.5rem, 7vh, 4.5rem) 0 clamp(3rem, 8vh, 5rem);
		border-top: 1px solid var(--rule);
	}
	.section-label {
		display: flex;
		gap: 0.75rem;
		margin: 0 0 1.75rem;
		color: var(--fg-muted);
		font-weight: 500;
	}
	.section-label span {
		color: var(--accent);
	}
	.prose {
		max-width: 38rem;
	}
	.prose p,
	.intro {
		margin: 0 0 1.25rem;
		max-width: 38rem;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
		color: var(--fg-muted);
	}
	.intro {
		color: var(--fg);
	}
	.sub {
		margin: 2.5rem 0 0.75rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.part {
		margin-top: clamp(2.5rem, 6vh, 3.5rem);
	}
	.part .sub {
		margin-top: 0;
	}
	.part-lead,
	.transition {
		margin: 0 0 1.25rem;
		max-width: 38rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.transition {
		margin-top: 2.5rem;
	}

	.teams {
		display: grid;
		gap: 1rem;
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}
	.teams li {
		padding: 1.5rem;
		border: 1px solid var(--rule);
		border-radius: 1.25rem;
	}
	.teams h3 {
		margin: 0 0 0.5rem;
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: 1;
		letter-spacing: var(--text-h1--letter-spacing);
		font-weight: 400;
	}
	.teams p {
		margin: 0;
		color: var(--fg-muted);
		line-height: 1.55;
	}

	.numbered {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.numbered li {
		display: grid;
		grid-template-columns: 3rem 1fr;
		align-items: baseline;
		padding: 1rem 0;
		border-top: 1px solid var(--rule);
	}
	.numbered li:last-child {
		border-bottom: 1px solid var(--rule);
	}
	.num {
		color: var(--fg-muted);
	}
	.numbered h4 {
		margin: 0 0 0.3rem;
		font-size: 1rem;
		font-weight: 600;
	}
	.numbered p {
		margin: 0;
		max-width: 40rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.links-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin-top: 0.5rem !important;
		font-size: 0.9375rem;
	}
	.links-row a {
		color: var(--fg);
		text-decoration: underline;
		text-decoration-color: var(--rule);
		text-underline-offset: 4px;
	}
	.links-row a:hover {
		text-decoration-color: currentColor;
	}

	.quote {
		margin: 2.5rem 0 0;
		padding-left: 1.25rem;
		border-left: 2px solid var(--rule);
	}
	.quote p {
		margin: 0 0 0.75rem;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
	}
	.quote footer {
		color: var(--fg-muted);
		font-size: 0.9375rem;
	}

	.toolkit {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem 1.5rem;
	}
	.toolkit h4 {
		margin: 0 0 0.75rem;
		color: var(--fg-muted);
		font-weight: 500;
	}
	.toolkit ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.toolkit li {
		padding: 0.35rem 0;
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
		padding: clamp(3rem, 8vh, 5rem) 0 clamp(4rem, 12vh, 8rem);
		border-top: 1px solid var(--rule);
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
		margin: clamp(3rem, 8vh, 5rem) 0 1rem;
		color: var(--fg-muted);
		font-weight: 500;
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

	@media (min-width: 768px) {
		.teams {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.toolkit {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
