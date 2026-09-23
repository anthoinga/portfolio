<script lang="ts">
	import ScrollProgressRing from './ScrollProgressRing.svelte'
	import Pill from '$lib/components/ui/Pill.svelte'
	import IconClose from '$lib/components/ui/IconClose.svelte'

	let {
		overscrollTop = 0,
		overscrollTopStarted = false,
		overscrollBottom = 0,
		overscrollBottomStarted = false
	}: {
		overscrollTop?: number
		overscrollTopStarted?: boolean
		overscrollBottom?: number
		overscrollBottomStarted?: boolean
	} = $props()
</script>

<header
	class="pointer-events-none sticky top-0 z-20 flex items-start px-6 pt-6 pb-4 text-chrome-ink 2xl:px-16"
>
	<Pill
		href="/"
		class="close-btn cursor-pointer p-2"
		style="opacity:{overscrollTopStarted ? 0 : 1}; transition: opacity 200ms var(--ease)"
		aria-label="Back to all projects"
	>
		<IconClose />
	</Pill>
</header>

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-0 flex justify-center pt-8 text-chrome-ink"
	style="opacity:{overscrollTopStarted ? (overscrollTop >= 1 ? 0 : 1) : 0}; transform: translateY({overscrollTopStarted ? overscrollTop * 20 : 30}px); transition: opacity {overscrollTop >= 1 ? '280ms 240ms' : '200ms'} var(--ease)"
>
	<ScrollProgressRing progress={overscrollTop} visible={overscrollTopStarted} />
</div>

<div
	class="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex justify-center pb-8 text-chrome-ink"
	style="opacity:{overscrollBottomStarted ? (overscrollBottom >= 1 ? 0 : 1) : 0}; transform: translateY({overscrollBottomStarted ? overscrollBottom * -20 : -30}px); transition: opacity {overscrollBottom >= 1 ? '280ms 240ms' : '200ms'} var(--ease)"
>
	<ScrollProgressRing progress={overscrollBottom} visible={overscrollBottomStarted} />
</div>
