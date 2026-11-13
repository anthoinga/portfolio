<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<main id="main">
	<div class="page-shell">
		<PageHeader label="Privacy" title={data.copy.title} lead={data.copy.lead} />
		<div class="sections">
			{#each data.copy.sections as s (s.title)}
				<section>
					<h2>{s.title}</h2>
					<p>{s.body}</p>
				</section>
			{/each}
		</div>
	</div>
</main>

<style>
	.sections {
		display: grid;
		gap: 2rem;
		max-width: 44rem;
		padding-bottom: clamp(4rem, 10vh, 7rem);
	}
	section {
		padding-top: 1.25rem;
		border-top: 1px solid var(--rule);
	}
	h2 {
		margin: 0 0 0.5rem;
		font-family: var(--font-display);
		font-size: var(--text-h3);
		font-weight: 400;
		line-height: var(--text-h3--line-height);
	}
	p {
		margin: 0;
		color: var(--fg-muted);
		line-height: 1.6;
	}
</style>
