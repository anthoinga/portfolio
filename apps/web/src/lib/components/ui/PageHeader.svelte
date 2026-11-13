<script lang="ts">
	let { label, title, lead }: { label: string; title: string; lead?: string } = $props()
</script>

<header class="page-header">
	<p class="font-label reveal" style="--i:0">{label}</p>
	<h1 class="reveal" style="--i:1">{title}</h1>
	{#if lead}<p class="lead reveal" style="--i:2">{lead}</p>{/if}
</header>

<style>
	.page-header {
		padding-top: clamp(7rem, 15vh, 10rem);
		padding-bottom: clamp(2rem, 5vh, 3.5rem);
	}
	.font-label {
		margin: 0 0 1rem;
		color: var(--fg-muted);
	}
	h1 {
		margin: 0;
		max-width: 16ch;
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: var(--text-h1--line-height);
		letter-spacing: var(--text-h1--letter-spacing);
		font-weight: 400;
	}
	.lead {
		max-width: 40rem;
		margin: 1.5rem 0 0;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
		color: var(--fg-muted);
	}
</style>
