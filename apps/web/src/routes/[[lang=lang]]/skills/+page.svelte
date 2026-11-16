<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { skillGroups } from '$lib/data/skills'
	import { services } from '$lib/data/services'
	import { currentLang, href, t } from '$lib/i18n'
	import { sound } from '$lib/actions/sfx'

	const groups = $derived(skillGroups(currentLang()))
	const offers = $derived(services(currentLang()))
	const offerFor = (id: string) => offers.find((o) => o.id === id)
	const hrefFor = (slug: string) => href(slug.startsWith('/') ? slug : `/projects/${slug}`)
</script>

<main id="main">
	<div class="page-shell">
		<PageHeader label={t('skills.label')} title={t('skills.title')} lead={t('skills.lead')} />
		<ul class="groups">
			{#each groups as group, i (group.id)}
				<li class="reveal" style="--i:{i}">
					<h2>{group.title}</h2>
					<p class="summary">{group.summary}</p>
					<ul class="chips">
						{#each group.skills as skill (skill)}<li>{skill}</li>{/each}
					</ul>
					<p class="proof font-label">
						<span>{t('skills.seeIn')}</span>
						{#each group.proof as p (p.slug)}
							<a href={hrefFor(p.slug)} use:sound>{p.label}</a>
						{/each}
					</p>
					{#if offerFor(group.serviceId)}
						<p class="proof font-label">
							<span>{t('skills.offeredAs')}</span>
							<a href={href('/work-with-me')} use:sound>{offerFor(group.serviceId)?.title}</a>
						</p>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</main>

<style>
	.groups {
		display: grid;
		gap: 3rem 3rem;
		margin: 0;
		padding: 0 0 clamp(4rem, 10vh, 7rem);
		list-style: none;
	}
	.groups > li {
		padding-top: 1.25rem;
		border-top: 1px solid var(--rule);
	}
	h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.summary {
		max-width: 28rem;
		margin: 0 0 1.25rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 1.25rem;
		padding: 0;
		list-style: none;
	}
	.chips li {
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.875rem;
	}
	.proof {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0;
		color: var(--fg-muted);
	}
	.proof + .proof {
		margin-top: 0.5rem;
	}
	.proof a {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	@media (min-width: 768px) {
		.groups {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
