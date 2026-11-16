<script lang="ts">
	import DemoCard from '$lib/components/chrome/DemoCard.svelte'
	import ProjectCard from '$lib/components/chrome/ProjectCard.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import { sound } from '$lib/actions/sfx'
	import { homeCopy } from '$lib/data/home'
	import { services } from '$lib/data/services'
	import { currentLang, href } from '$lib/i18n'
	import { uiDemos } from '$lib/data/uiDemos'
	import { attachHeroDock } from '$lib/heroDock'
	import { prefersReducedMotion } from '$lib/motion'
	import { viewport } from '$lib/scrollRoot.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const lang = $derived(currentLang())
	const copy = $derived(homeCopy[lang])
	const offers = $derived(services(lang))
	const teaser = uiDemos.slice(0, 2)

	let slot: HTMLElement | undefined = $state()
	let nameEl: HTMLElement | undefined = $state()
	let statusEl: HTMLElement | undefined = $state()
	let leadEl: HTMLElement | undefined = $state()
	let ctasEl: HTMLElement | undefined = $state()
	const leadWords = $derived(copy.lead.split(' '))

	/** Groups the lead's word spans into their rendered lines. */
	function leadLines(lead: HTMLElement) {
		const lines: HTMLElement[][] = []
		let top = NaN
		for (const word of lead.querySelectorAll<HTMLElement>('[data-word]')) {
			if (word.offsetTop !== top) {
				lines.push([])
				top = word.offsetTop
			}
			lines[lines.length - 1].push(word)
		}
		return lines
	}

	$effect(() => {
		leadWords
		const scroller = viewport.scroller
		if (!scroller || !main || !slot || !nameEl || !statusEl || !leadEl || !ctasEl) return
		const [status, lead, ctas] = [statusEl, leadEl, ctasEl]
		return attachHeroDock({
			scroller,
			content: main,
			slot,
			name: nameEl,
			steps: () => [[status], ...leadLines(lead), ...[...ctas.querySelectorAll<HTMLElement>('a')].map((a) => [a])]
		})
	})

	function toWork(event: MouseEvent) {
		const target = document.getElementById('work')
		if (!target) return
		event.preventDefault()
		target.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
	}

	// The sticky-collapse cards measure scroll position from the top of the feed.
	let main: HTMLElement | undefined = $state()
	let feed: HTMLElement | undefined = $state()
	let feedTop = $state(0)

	function measure() {
		if (!feed || !viewport.scroller) return
		feedTop = feed.getBoundingClientRect().top + viewport.scroller.scrollTop
	}

	$effect(() => {
		viewport.viewW
		if (!main) return
		const ro = new ResizeObserver(measure)
		ro.observe(main)
		measure()
		void document.fonts?.ready.then(measure)
		return () => ro.disconnect()
	})
</script>

<main id="main" bind:this={main}>
	<section class="page-shell hero">
		<!-- Scroll fades go on wrappers and word spans so they don't override the .reveal entrances. -->
		<div bind:this={statusEl}>
			<p class="status reveal" style="--i:0">
				<span class="dot" aria-hidden="true"></span>
				{copy.status}
			</p>
		</div>
		<h1 bind:this={slot}>
			<span class="name" bind:this={nameEl}><span class="reveal" style="--i:1">{data.settings.name}</span></span>
		</h1>
		<p class="lead reveal" style="--i:2" bind:this={leadEl}>
			{#each leadWords as word, i (i)}<span data-word>{word}</span>{' '}{/each}
		</p>
		<div class="ctas reveal" style="--i:3" bind:this={ctasEl}>
			<Button href={href('/work-with-me#enquire')}>{copy.ctaPrimary}</Button>
			<Button href="#work" onclick={toWork} variant="ghost">{copy.ctaSecondary}</Button>
		</div>
	</section>

	<section class="page-shell proof reveal" style="--i:4" aria-label={copy.proof.outcomesLabel}>
		<h2 class="font-label proof-label">{copy.proof.outcomesLabel}</h2>
		<ul class="outcomes">
			{#each copy.proof.outcomes as o (o.label)}
				<li><b>{o.stat}</b> <span>{o.label}</span></li>
			{/each}
		</ul>
		{#if data.settings.awards?.length}
			<p class="recognised">
				<span class="font-label">{copy.proof.recognisedLabel}</span>
				{#each data.settings.awards as award, i (award.org)}{i ? ' · ' : ' '}{award.org}{award.role ? ` (${award.role})` : ''}{/each}
			</p>
		{/if}
	</section>

	<section class="page-shell block" aria-labelledby="svc-h">
		<header class="row">
			<h2 id="svc-h" class="font-label">{copy.services.label}</h2>
			<a href={href('/work-with-me')} class="more" use:sound>{copy.services.all} →</a>
		</header>
		<ol class="offers">
			{#each offers as offer, i (offer.id)}
				<li>
					<span class="num font-label">0{i + 1}</span>
					<a href={href('/work-with-me')} use:sound>
						<h3>{offer.title}</h3>
						<p>{offer.summary}</p>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	<section id="work" class="page-shell block" aria-labelledby="work-h">
		<header class="row">
			<h2 id="work-h" class="font-label">{copy.work.label}</h2>
		</header>
		<p class="note">{copy.work.note}</p>
		<div bind:this={feed} class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
			{#each data.projects as project, i (project._id)}
				<ProjectCard {project} index={i} topOffset={feedTop} />
			{/each}
		</div>
	</section>

	<section class="page-shell block" aria-labelledby="play-h">
		<header class="row">
			<h2 id="play-h" class="font-label">{copy.playground.label}</h2>
			<a href={href('/playground')} class="more" use:sound>{copy.playground.all} →</a>
		</header>
		<p class="statement">{copy.playground.title}</p>
		<div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
			{#each teaser as demo, i (demo.id)}
				<DemoCard {demo} index={i} wideFirst={false} sticky={false} />
			{/each}
		</div>
	</section>

	<section class="page-shell cta">
		<p class="note tour">{copy.cta.tour}</p>
		<h2>{copy.cta.title}</h2>
		<p>{copy.cta.body}</p>
		<div class="ctas">
			<Button href={href('/work-with-me#enquire')}>{copy.cta.primary}</Button>
			<Button href={href('/about')} variant="ghost">{copy.cta.secondary}</Button>
		</div>
	</section>
</main>

<style>
	.hero {
		padding-top: clamp(7rem, 16vh, 11rem);
		padding-bottom: clamp(3rem, 8vh, 5rem);
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0 0 1.75rem;
		padding: 0.4rem 0.9rem 0.4rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.8125rem;
		color: var(--fg-muted);
	}
	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 0 var(--accent);
		animation: pulse 2.4s var(--ease) infinite;
	}
	@keyframes pulse {
		70% {
			box-shadow: 0 0 0 0.5rem transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}
	/* Keeps the name's place in the hero while the name itself is pinned and docked. */
	h1 {
		position: relative;
		height: calc(var(--text-display) * var(--text-display--line-height));
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-display);
		line-height: var(--text-display--line-height);
		letter-spacing: var(--text-display--letter-spacing);
		font-weight: 400;
		white-space: nowrap;
	}
	/* White under `exclusion` inverts whatever is behind it, so the name reads over any card. */
	.name {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 30;
		transform-origin: 0 0;
		color: #fff;
		mix-blend-mode: exclusion;
	}
	.name > span {
		display: block;
	}
	.lead {
		max-width: 38rem;
		margin: 2rem 0 0;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
		color: var(--fg-muted);
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 2.25rem;
	}

	.proof {
		padding-bottom: clamp(3rem, 8vh, 5rem);
	}
	.proof-label {
		margin: 0 0 0.75rem;
		font-weight: 500;
		color: var(--fg-muted);
	}
	.outcomes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem 2rem;
		margin: 0;
		padding: 1.25rem 0;
		border-block: 1px solid var(--rule);
		list-style: none;
	}
	.outcomes li {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.outcomes b {
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: 1;
		font-weight: 400;
		letter-spacing: -0.02em;
	}
	.outcomes span {
		color: var(--fg-muted);
		font-size: 0.9375rem;
	}
	.recognised {
		margin: 1rem 0 0;
		font-size: 0.9375rem;
		color: var(--fg-muted);
	}
	.recognised .font-label {
		margin-right: 0.5rem;
	}
	@media (min-width: 900px) {
		.outcomes {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.note {
		margin: 0 0 1.25rem;
		font-size: 0.9375rem;
		color: var(--fg-muted);
	}
	.tour {
		margin-bottom: 1.5rem;
	}

	.offers {
		display: grid;
		gap: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.offers li {
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		align-items: baseline;
		padding: 1.1rem 0;
		border-top: 1px solid var(--rule);
	}
	.offers li:last-child {
		border-bottom: 1px solid var(--rule);
	}
	.offers a {
		display: block;
	}
	.offers h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.offers p {
		max-width: 40rem;
		margin: 0.25rem 0 0;
		color: var(--fg-muted);
		font-size: 0.9375rem;
		line-height: 1.5;
	}
	.num {
		color: var(--fg-muted);
	}

	.block {
		padding-bottom: clamp(3.5rem, 10vh, 6.5rem);
	}
	/* Clears the fixed nav pill when jumped to via #work. */
	#work {
		scroll-margin-top: 5.5rem;
	}
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.25rem;
	}
	.row h2 {
		margin: 0;
		font-weight: 500;
		color: var(--fg-muted);
	}
	.more {
		font-size: 0.9375rem;
		text-decoration: underline;
		text-decoration-color: var(--rule);
		text-underline-offset: 4px;
		transition: text-decoration-color 200ms var(--ease);
	}
	.more:hover {
		text-decoration-color: currentColor;
	}
	.statement {
		max-width: 28ch;
		margin: 0 0 1.75rem;
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: var(--text-h1--line-height);
		letter-spacing: var(--text-h1--letter-spacing);
	}


	.cta {
		padding-top: clamp(2rem, 6vh, 4rem);
		padding-bottom: clamp(4rem, 12vh, 8rem);
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
	.cta p {
		max-width: 34rem;
		margin: 1.25rem 0 0;
		color: var(--fg-muted);
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
	}
</style>
