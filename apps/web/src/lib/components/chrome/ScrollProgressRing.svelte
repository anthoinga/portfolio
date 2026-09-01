<script lang="ts">
	import Pill from '$lib/components/ui/Pill.svelte'

	let { progress = 0, visible = false }: { progress?: number; visible?: boolean } = $props()

	const r = 8
	const c = 2 * Math.PI * r
	const offset = $derived(c * (1 - progress))
</script>

<Pill
	href="/"
	class="px-4 py-2 text-sm tracking-tight {visible ? '' : 'pointer-events-none'}"
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
