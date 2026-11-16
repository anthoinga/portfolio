<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import Button from '$lib/components/ui/Button.svelte'
	import EnquiryForm from '$lib/components/ui/EnquiryForm.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { faq, process, services, terms } from '$lib/data/services'
	import { currentLang, href, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const lang = $derived(currentLang())
	const list = $derived(services(lang))
	const steps = $derived(process(lang))
	const workingTerms = $derived(terms(lang))
	const questions = $derived(faq(lang))
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
						<p class="meta font-label">{service.shape} · {service.length}</p>
						<p>{service.summary}</p>
						<p class="for"><b>{t('wwm.forWhom')}</b> {service.forWhom}</p>
						<ul class="tags" aria-label={t('wwm.gets')}>
							{#each service.deliverables as d (d)}<li>{d}</li>{/each}
						</ul>
						<p class="proof">
							<span class="font-label">{t('wwm.seeIn')}</span>
							<a href={href(`/projects/${service.proof.slug}`)} use:sound>{service.proof.label}</a>
						</p>
					</div>
				</li>
			{/each}
		</ol>

		<section class="block" aria-labelledby="start-h">
			<h2 id="start-h" class="font-label label">{t('wwm.processLabel')}</h2>
			<ol class="steps">
				{#each steps as step, i (step.title)}
					<li>
						<span class="num font-label">0{i + 1}</span>
						<h3>{step.title}</h3>
						<p>{step.body}</p>
					</li>
				{/each}
			</ol>
		</section>

		<section class="block" aria-labelledby="terms-h">
			<h2 id="terms-h" class="font-label label">{t('wwm.termsLabel')}</h2>
			<dl class="terms">
				{#each workingTerms as term (term.title)}
					<div>
						<dt>{term.title}</dt>
						<dd>{term.body}</dd>
					</div>
				{/each}
			</dl>
		</section>

		<section class="block" aria-labelledby="faq-h">
			<h2 id="faq-h" class="font-label label">{t('wwm.faqLabel')}</h2>
			<dl class="faq">
				{#each questions as item (item.q)}
					<div>
						<dt>{item.q}</dt>
						<dd>{item.a}</dd>
					</div>
				{/each}
			</dl>
		</section>

		<div id="enquire">
			<EnquiryForm services={list} email={s.email} endpoint={data.formEndpoint ?? undefined} />
		</div>

		<section id="contact" class="contact" aria-labelledby="contact-h">
			<p class="font-label label">{t('wwm.aboutLabel')}</p>
			{#if s.bio}<p class="bio">{s.bio}</p>{/if}

			<h2 id="contact-h" class="title">{t('contact.title')}</h2>
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

			<h3 class="font-label sub">{t('contact.credentials')}</h3>
			<ul class="rows">
				{#each s.experiences as x (x.org)}
					<li><b>{x.org}</b><span>{x.role}</span></li>
				{/each}
				{#each s.awards as a (a.org)}
					<li><b>{a.org}</b><span>{a.role}</span></li>
				{/each}
			</ul>
		</section>
	</div>
</main>

<style>
	.services,
	.steps {
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
		margin: 0 0 0.4rem;
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
	.services .meta {
		margin: 0 0 0.75rem;
		color: var(--accent);
	}
	.for b {
		color: var(--fg);
		font-weight: 500;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 1rem;
		padding: 0;
		list-style: none;
	}
	.tags li {
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.875rem;
	}
	.services .proof {
		margin: 0;
		font-size: 0.9375rem;
	}
	.proof .font-label {
		margin-right: 0.5rem;
	}
	.proof a {
		color: var(--fg);
		text-decoration: underline;
		text-decoration-color: var(--rule);
		text-underline-offset: 4px;
	}
	.proof a:hover {
		text-decoration-color: currentColor;
	}

	.block {
		padding: clamp(3rem, 8vh, 5rem) 0 0;
	}
	.label {
		margin: 0 0 1rem;
		color: var(--fg-muted);
		font-weight: 500;
	}
	.steps {
		display: grid;
		gap: 1.5rem;
	}
	.steps li {
		padding-top: 1.1rem;
		border-top: 1px solid var(--rule);
	}
	.steps h3 {
		margin: 0.6rem 0 0.4rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.steps p {
		margin: 0;
		max-width: 28rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.terms,
	.faq {
		display: grid;
		gap: 0;
		margin: 0;
	}
	.terms > div,
	.faq > div {
		display: grid;
		gap: 0.35rem 2rem;
		padding: 1.1rem 0;
		border-top: 1px solid var(--rule);
	}
	.terms > div:last-child,
	.faq > div:last-child {
		border-bottom: 1px solid var(--rule);
	}
	dt {
		font-weight: 500;
	}
	dd {
		margin: 0;
		max-width: 40rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}

	.contact {
		padding: 0 0 clamp(4rem, 10vh, 7rem);
		/* Clears the fixed nav when jumped to via #contact. */
		scroll-margin-top: 4rem;
	}
	.title {
		margin: 2rem 0 0;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.bio {
		max-width: 38rem;
		margin: 0;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
		color: var(--fg-muted);
	}
	.reach {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		padding: 1.25rem 0 clamp(3rem, 8vh, 5rem);
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
	.sub {
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
		.steps {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 2rem;
		}
		.terms > div,
		.faq > div {
			grid-template-columns: 14rem 1fr;
		}
	}
</style>
