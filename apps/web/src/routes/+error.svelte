<script lang="ts">
	import { page } from '$app/state'

	const is404 = $derived(page.status === 404)
</script>

<svelte:head>
	<title>{is404 ? 'Not found' : 'Error'}</title>
</svelte:head>

<main class="grid min-h-screen place-items-center px-6 text-ink">
	<div>
		<p class="text-[11px] tracking-[0.2em] uppercase opacity-50">{page.status}</p>
		<h1 class="font-display mt-4 text-5xl font-extrabold">
			{is404 ? 'This page is not here.' : 'Something went wrong.'}
		</h1>
		{#if !is404}
			<p class="mt-4 max-w-md text-sm opacity-60">Try again in a moment, or head back home.</p>
		{/if}
		<a class="mt-8 inline-block text-sm tracking-widest uppercase underline" href="/">Home</a>
	</div>
</main>
