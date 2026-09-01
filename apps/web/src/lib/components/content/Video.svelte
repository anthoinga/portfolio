<script lang="ts">
	import { seekOnScroll } from '$lib/actions/seekOnScroll'
	import { isFinePointer, prefersReducedMotion } from '$lib/motion'
	import type { MediaRef } from '$lib/sanity/types'

	let {
		portableText
	}: {
		portableText: {
			value: {
				file?: MediaRef | null
				poster?: MediaRef | null
				canScrub?: boolean
				seekOnScroll?: boolean
				width?: number
				height?: number
			}
		}
	} = $props()

	const value = $derived(portableText.value)

	let videoEl: HTMLVideoElement | undefined = $state()
	let hovering = $state(false)
	let dragging = $state(false)
	let progress = $state(0)
	let timeLabel = $state('0:00')

	const native = $derived(typeof window === 'undefined' ? true : prefersReducedMotion() || !isFinePointer())
	const customScrub = $derived(Boolean(value.canScrub) && !native && !value.seekOnScroll)
	const src = $derived(value.file?.url)

	function fmt(t: number) {
		if (!Number.isFinite(t)) return '0:00'
		const m = Math.floor(t / 60)
		const s = Math.floor(t % 60)
		return `${m}:${s.toString().padStart(2, '0')}`
	}

	function seekFromEvent(e: PointerEvent) {
		if (!videoEl || !videoEl.duration) return
		const rect = videoEl.getBoundingClientRect()
		const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
		videoEl.currentTime = x * videoEl.duration
		progress = x
		timeLabel = fmt(videoEl.currentTime)
	}

	function onPointerDown(e: PointerEvent) {
		if (!customScrub) return
		dragging = true
		;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
		seekFromEvent(e)
	}

	function onPointerMove(e: PointerEvent) {
		if (customScrub && dragging) seekFromEvent(e)
	}

	function onPointerUp() {
		dragging = false
	}

	function onTime() {
		if (!videoEl?.duration) return
		progress = videoEl.currentTime / videoEl.duration
		timeLabel = fmt(videoEl.currentTime)
	}
</script>

<div class="col-span-full relative my-16 w-full overflow-hidden rounded-media" style="aspect-ratio: {value.width && value.height ? `${value.width} / ${value.height}` : '16 / 9'}">
	{#if src}
		<video
			bind:this={videoEl}
			src={src}
			poster={value.poster?.url}
			playsinline
			preload="auto"
			controls={native || !value.canScrub}
			controlslist="nodownload noremoteplayback"
			disablepictureinpicture
			muted={!value.canScrub}
			loop={!value.canScrub}
			autoplay={!value.canScrub && !value.seekOnScroll}
			class="h-full w-full object-cover"
			class:cursor-none={customScrub}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointerleave={() => (hovering = false)}
			onpointerenter={() => (hovering = true)}
			ontimeupdate={onTime}
			use:seekOnScroll={Boolean(value.seekOnScroll)}
		></video>
	{:else if value.poster?.url}
		<img src={value.poster.url} alt={value.poster.alt || ''} class="h-full w-full object-cover" />
	{/if}

	{#if customScrub && hovering}
		<div class="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
			<div class="flex items-center gap-6 text-sm tracking-widest uppercase">
				<span>‹</span>
				<span>{timeLabel}</span>
				<span>›</span>
			</div>
			<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
				<circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-opacity="0.3" />
				<circle
					cx="24"
					cy="24"
					r="18"
					fill="none"
					stroke="currentColor"
					stroke-dasharray={2 * Math.PI * 18}
					stroke-dashoffset={2 * Math.PI * 18 * (1 - progress)}
					transform="rotate(-90 24 24)"
				/>
			</svg>
		</div>
	{/if}
</div>
