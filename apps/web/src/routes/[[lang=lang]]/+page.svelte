<script lang="ts">
	import DemoCard from '$lib/components/chrome/DemoCard.svelte'
	import ProjectCard from '$lib/components/chrome/ProjectCard.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import { sound } from '$lib/actions/sfx'
	import { homeCopy } from '$lib/data/home'
	import { currentLang, href } from '$lib/i18n'
	import { uiDemos } from '$lib/data/uiDemos'
	import { viewport } from '$lib/scrollRoot.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const lang = $derived(currentLang())
	const copy = $derived(homeCopy[lang])
	const featured = $derived(data.projects.slice(0, 3))
	const teaser = uiDemos.slice(0, 2)
	const lines = $derived(copy.headline.split('\n'))

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
		<p class="status reveal" style="--i:0">
			<span class="dot" aria-hidden="true"></span>
			{copy.status}
		</p>
		<h1 class="reveal" style="--i:1">
			{#each lines as line, i (i)}<span>{line}</span>{/each}
		</h1>
		<p class="lead reveal" style="--i:2">{copy.lead}</p>
		<div class="ctas reveal" style="--i:3">
			<Button href={href('/work')}>{copy.ctaPrimary}</Button>
			<Button href={href('/contact')} variant="ghost">{copy.ctaSecondary}</Button>
		</div>
	</section>

	<section class="page-shell proof reveal" style="--i:4" aria-label="Experience and awards">
		<ul>
			{#each data.settings.experiences ?? [] as xp (xp.org)}
				<li><b>{xp.org}</b> <span>{xp.role}</span></li>
			{/each}
			{#each data.settings.awards ?? [] as award (award.org)}
				<li><b>{award.org}</b> <span>{award.role}</span></li>
			{/each}
		</ul>
	</section>

	<section class="page-shell block" aria-labelledby="work-h">
		<header class="row">
			<h2 id="work-h" class="font-label">{copy.work.label}</h2>
			<a href={href('/work')} class="more" use:sound>{copy.work.all} →</a>
		</header>
		<div bind:this={feed} class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
			{#each featured as project, i (project._id)}
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

	<section class="page-shell block" aria-labelledby="how-h">
		<header class="row">
			<h2 id="how-h" class="font-label">{copy.principles.label}</h2>
		</header>
		<ol class="principles">
			{#each copy.principles.items as item, i (item.title)}
				<li>
					<span class="num font-label">0{i + 1}</span>
					<h3>{item.title}</h3>
					<p>{item.body}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section class="page-shell cta">
		<h2>{copy.cta.title}</h2>
		<p>{copy.cta.body}</p>
		<div class="ctas">
			<Button href={href('/work-with-me')}>{copy.cta.primary}</Button>
			<Button href={href('/contact')} variant="ghost">{copy.cta.secondary}</Button>
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
	h1 {
		margin: 0;
		max-width: 14ch;
		font-family: var(--font-display);
		font-size: var(--text-display);
		line-height: var(--text-display--line-height);
		letter-spacing: var(--text-display--letter-spacing);
		font-weight: 400;
	}
	h1 span {
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
	.proof ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
		margin: 0;
		padding: 1rem 0;
		border-block: 1px solid var(--rule);
		list-style: none;
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		letter-spacing: 0;
	}
	.proof b {
		font-weight: 600;
	}
	.proof span {
		color: var(--fg-muted);
	}

	.block {
		padding-bottom: clamp(3.5rem, 10vh, 6.5rem);
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

	.principles {
		display: grid;
		gap: 2rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.principles li {
		padding-top: 1.25rem;
		border-top: 1px solid var(--rule);
	}
	.principles h3 {
		margin: 0.75rem 0 0.5rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	.principles p {
		margin: 0;
		max-width: 30rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.num {
		color: var(--fg-muted);
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

	@media (min-width: 768px) {
		.principles {
			grid-template-columns: repeat(3, 1fr);
			gap: 2.5rem;
		}
	}
</style>
