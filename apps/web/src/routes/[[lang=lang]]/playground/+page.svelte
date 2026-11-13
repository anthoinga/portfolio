<script lang="ts">
	import DemoCard from '$lib/components/chrome/DemoCard.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { playgroundNotes } from '$lib/data/playground'
	import { currentLang, t } from '$lib/i18n'
	import { feedEndDemo, uiDemos } from '$lib/data/uiDemos'
	import { viewport } from '$lib/scrollRoot.svelte'

	const demos = [...uiDemos, feedEndDemo]
	const notes = $derived(playgroundNotes(currentLang()))
	const noteFor = (id: string) => notes.find((n) => n.id === id)

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
	<div class="page-shell">
		<PageHeader label={t('playground.label')} title={t('playground.title')} lead={t('playground.lead')} />
		<div bind:this={feed} class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
			{#each demos as demo, i (demo.id)}
				<DemoCard {demo} index={i} topOffset={feedTop} wideFirst={false} />
			{/each}
		</div>

		<ol class="notes">
			{#each demos as demo (demo.id)}
				{@const n = noteFor(demo.id)}
				{#if n}
					<li>
						<h2>{demo.title}</h2>
						<p>{n.note}</p>
						<p class="testing"><span class="font-label">{t('playground.testing')}</span> {n.testing}</p>
						<p class="stack font-label">{n.stack.join(' · ')}</p>
					</li>
				{/if}
			{/each}
		</ol>
	</div>
</main>

<style>
	.notes {
		display: grid;
		gap: 2.5rem 2rem;
		margin: 0;
		padding: clamp(3rem, 8vh, 5rem) 0 clamp(4rem, 10vh, 7rem);
		list-style: none;
	}
	li {
		padding-top: 1.25rem;
		border-top: 1px solid var(--rule);
	}
	h2 {
		margin: 0 0 0.5rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	li p {
		margin: 0 0 0.75rem;
		max-width: 32rem;
		line-height: 1.55;
	}
	.testing {
		color: var(--fg-muted);
	}
	.testing .font-label {
		margin-right: 0.5rem;
		color: var(--accent);
	}
	.stack {
		color: var(--fg-muted);
	}
	@media (min-width: 768px) {
		.notes {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
