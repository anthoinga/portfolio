<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { services } from '$lib/data/services'
</script>

<main id="main">
	<div class="page-shell">
		<PageHeader
			label="Work with me"
			title="Have something to build?"
			lead="I take on a few kinds of work. If yours does not fit one of these, tell me about it anyway."
		/>
		<ol class="services">
			{#each services as s, i (s.id)}
				<li class="reveal" style="--i:{i}">
					<span class="num font-label">0{i + 1}</span>
					<div>
						<h2>{s.title}</h2>
						<p>{s.summary}</p>
						<ul>
							{#each s.deliverables as d (d)}<li>{d}</li>{/each}
						</ul>
					</div>
				</li>
			{/each}
		</ol>
		<div class="cta">
			<Button href="/contact">Start a conversation</Button>
		</div>
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
	h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-display);
		font-size: var(--text-h2);
		line-height: var(--text-h2--line-height);
		letter-spacing: var(--text-h2--letter-spacing);
		font-weight: 400;
	}
	p {
		max-width: 36rem;
		margin: 0 0 1rem;
		line-height: 1.55;
		color: var(--fg-muted);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	ul li {
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.875rem;
	}
	.cta {
		padding: 2.5rem 0 clamp(4rem, 10vh, 7rem);
	}
	@media (min-width: 768px) {
		.services > li {
			grid-template-columns: 5rem 1fr;
		}
	}
</style>
