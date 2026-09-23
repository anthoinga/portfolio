<script lang="ts">
	import Pill from '$lib/components/ui/Pill.svelte'

	let { progress = 0, visible = false }: { progress?: number; visible?: boolean } = $props()

	const r = 8
	const c = 2 * Math.PI * r
	const offset = $derived(c * (1 - progress))
	const done = $derived(progress >= 1)
	const hue = $derived(230 - progress * 185)
	const bg = $derived(
		done ? 'oklch(0.82 0.2 148)' : `oklch(${0.44 + progress * 0.28} ${0.03 + progress * 0.2} ${hue})`
	)
	const fg = $derived(done || progress > 0.42 ? 'oklch(0.2 0.04 148)' : 'var(--chrome-ink)')
</script>

<Pill
	href="/"
	class="overscroll-pill px-4 py-2 text-sm tracking-tight {visible ? '' : 'pointer-events-none'} {done
		? 'is-done'
		: ''}"
	style="background:{bg}; color:{fg}; --glow:{progress}"
	aria-label="All projects"
>
	<svg
		class="relative -left-[0.26em] mr-1 -mt-1 inline-block"
		height="24"
		width="24"
		viewBox="0 0 24 24"
		aria-hidden="true"
		style="transform:rotate(-90deg);display:block"
	>
		<circle stroke="currentColor" fill="transparent" stroke-width="2" r="8" cx="12" cy="12" opacity="0.2"></circle>
		<circle
			stroke="currentColor"
			fill="transparent"
			stroke-width="2"
			stroke-dasharray="{c} {c}"
			stroke-dashoffset={offset}
			r="8"
			cx="12"
			cy="12"
		></circle>
	</svg>
	All Projects
</Pill>

<style>
	:global(.overscroll-pill) {
		box-shadow: 0 0 calc(var(--glow) * 28px) oklch(0.75 0.18 55 / calc(var(--glow) * 0.45));
		transition:
			background 90ms linear,
			color 90ms linear,
			transform 320ms var(--ease),
			box-shadow 90ms linear;
	}
	:global(.overscroll-pill.is-done) {
		transform: scale(1.08);
		box-shadow: 0 0 28px oklch(0.82 0.2 148 / 0.55);
	}
</style>
