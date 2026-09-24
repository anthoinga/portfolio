<script lang="ts">
	import { page } from '$app/state'
	import LogoMark from '$lib/components/ui/LogoMark.svelte'
	import NopeGame from './nopeGame.svelte'

	const is404 = $derived(page.status === 404)
</script>

{#if is404}
	<NopeGame />
{:else}
	<main class="grid min-h-screen place-items-center px-6 text-chrome-ink">
		<div>
			<div class="mb-6 size-7 text-chrome-ink" aria-hidden="true">
				<LogoMark />
			</div>
			<p class="text-[11px] tracking-[0.2em] uppercase opacity-50">{page.status}</p>
			<h1 class="mt-4 text-5xl font-extrabold">Something went wrong.</h1>
			<p class="mt-4 max-w-md text-sm opacity-60">Try again in a moment, or head back home.</p>
			<a class="mt-8 inline-block text-sm tracking-widest uppercase underline" href="/">Home</a>
		</div>
	</main>
{/if}
