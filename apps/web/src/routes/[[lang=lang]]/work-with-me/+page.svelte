<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import EnquiryForm from '$lib/components/ui/EnquiryForm.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { services } from '$lib/data/services'
	import { currentLang, href, t } from '$lib/i18n'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const list = $derived(services(currentLang()))
</script>

<main id="main">
	<div class="page-shell">
		<PageHeader label={t('wwm.label')} title={t('wwm.title')} lead={t('wwm.lead')} />
		<p class="unsure reveal" style="--i:2">{t('wwm.unsure')}</p>

		<ol class="services">
			{#each list as service, i (service.id)}
				<li class="reveal" style="--i:{i}">
					<span class="num font-label">0{i + 1}</span>
					<div>
						<h2>{service.title}</h2>
						<p>{service.summary}</p>
						<p class="proof">
							<span class="font-label">{t('wwm.seeIn')}</span>
							<a href={href(`/projects/${service.proof.slug}`)} use:sound>{service.proof.label}</a>
						</p>
					</div>
				</li>
			{/each}
		</ol>

		<div id="enquire">
			<EnquiryForm services={list} email={data.settings.email} endpoint={data.formEndpoint ?? undefined} />
		</div>
	</div>
</main>

<style>
	.unsure {
		max-width: 36rem;
		margin: 0 0 clamp(2rem, 5vh, 3rem);
		color: var(--fg-muted);
		line-height: 1.55;
	}
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

	@media (min-width: 768px) {
		.services > li {
			grid-template-columns: 5rem 1fr;
		}
	}
</style>
