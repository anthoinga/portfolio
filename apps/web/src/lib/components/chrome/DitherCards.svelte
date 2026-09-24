<script lang="ts">
	import { onMount } from 'svelte'
	import { subscribeMedia } from '$lib/motion'
	import photo from '$lib/assets/dither/01.jpg?url'

	const BAYER = [
		[0, 8, 2, 10],
		[12, 4, 14, 6],
		[3, 11, 1, 9],
		[15, 7, 13, 5]
	] as const
	const DURATION = 850
	const COLS = 28

	const copy = {
		badge: '01',
		title: 'Peaks that hold the sky',
		body: 'Ridges and summits that make the horizon feel newly invented.'
	}

	type CardState = {
		progress: number
		from: number
		to: number
		ox: number
		oy: number
		start: number
		busy: boolean
	}

	let reduced = $state(false)
	let finePointer = $state(true)
	let open = $state(false)
	let ink = $state(0)

	let rootEl: HTMLElement | undefined = $state()
	let cardEl: HTMLElement | undefined
	let canvasEl: HTMLCanvasElement | undefined
	let image: HTMLImageElement | null = null
	let mosaic: Uint8ClampedArray | null = null
	let mosaicH = 0
	let photoSrc = $state(photo)
	const EXPAND_ASPECT = 2.2
	let anim: CardState = {
		progress: 0,
		from: 0,
		to: 0,
		ox: 0.5,
		oy: 0.5,
		start: 0,
		busy: false
	}
	let raf = 0
	let lookRaf = 0
	let look = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
	let pivotX = $state(0)
	let pivotY = $state(0)
	let pivotZ = $state(0)
	let panX = $state(0)
	let panY = $state(0)
	const photoOpacity = $derived(Math.max(0, (ink - 0.65) / 0.35))

	$effect(() => subscribeMedia('(prefers-reduced-motion: reduce)', (m) => (reduced = m)))
	$effect(() =>
		subscribeMedia('(hover: hover) and (pointer: fine)', (m) => (finePointer = m))
	)

	function ease(t: number) {
		return 1 - Math.pow(1 - t, 3)
	}

	function loadImage(src: string) {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image()
			img.decoding = 'async'
			img.onload = () => resolve(img)
			img.onerror = reject
			img.src = src
		})
	}

	/** Cover-scale the source into a landscape plate for pivot bleed. */
	function expandImage(img: HTMLImageElement, aspect: number) {
		const srcW = img.naturalWidth
		const srcH = img.naturalHeight
		const srcAspect = srcW / srcH
		if (srcAspect >= aspect) return Promise.resolve(img)

		const outH = srcH
		const outW = Math.round(outH * aspect)
		const canvas = document.createElement('canvas')
		canvas.width = outW
		canvas.height = outH
		const ctx = canvas.getContext('2d')
		if (!ctx) return Promise.resolve(img)

		const scale = Math.max(outW / srcW, outH / srcH)
		const dw = srcW * scale
		const dh = srcH * scale
		ctx.drawImage(img, (outW - dw) / 2, (outH - dh) / 2, dw, dh)

		return loadImage(canvas.toDataURL('image/jpeg', 0.92))
	}

	function buildMosaic() {
		if (!image) return
		const rows = Math.max(1, Math.round((COLS * image.naturalHeight) / image.naturalWidth))
		const sc = document.createElement('canvas')
		sc.width = COLS
		sc.height = rows
		const sctx = sc.getContext('2d', { willReadFrequently: true })
		if (!sctx) return
		sctx.drawImage(image, 0, 0, COLS, rows)
		mosaic = sctx.getImageData(0, 0, COLS, rows).data
		mosaicH = rows
	}

	function cellColor(col: number, row: number) {
		if (!mosaic || !mosaicH) return 'rgb(136 136 136)'
		const x = Math.min(COLS - 1, Math.max(0, col))
		const y = Math.min(mosaicH - 1, Math.max(0, row))
		const o = (y * COLS + x) * 4
		return `rgb(${mosaic[o]} ${mosaic[o + 1]} ${mosaic[o + 2]})`
	}

	function paint() {
		if (!canvasEl || !cardEl) return

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const w = cardEl.clientWidth
		const h = cardEl.clientHeight
		if (w < 1 || h < 1) return

		const bw = Math.round(w * dpr)
		const bh = Math.round(h * dpr)
		if (canvasEl.width !== bw || canvasEl.height !== bh) {
			canvasEl.width = bw
			canvasEl.height = bh
		}

		const ctx = canvasEl.getContext('2d')
		if (!ctx) return
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		ctx.clearRect(0, 0, w, h)

		const p = anim.progress
		if (ink !== p) ink = p
		if (p <= 0.001) return

		const cell = Math.max(4, w / COLS)
		const cols = Math.ceil(w / cell)
		const rows = Math.ceil(h / cell)
		const maxDist = Math.hypot(1, 1)

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const cx = (x + 0.5) * cell
				const cy = (y + 0.5) * cell
				const dist = Math.hypot(cx / w - anim.ox, cy / h - anim.oy) / maxDist
				const bayer = BAYER[y & 3][x & 3] / 16
				const threshold = dist * 0.72 + bayer * 0.28
				if (p <= threshold) continue
				const mx = Math.floor(((x + 0.5) / cols) * COLS)
				const my = Math.floor(((y + 0.5) / rows) * Math.max(1, mosaicH))
				ctx.fillStyle = cellColor(mx, my)
				ctx.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5)
			}
		}
	}

	function tick(now: number) {
		if (!anim.busy) {
			raf = 0
			return
		}
		const t = Math.min(1, (now - anim.start) / DURATION)
		anim.progress = anim.from + (anim.to - anim.from) * ease(t)
		if (t >= 1) {
			anim.progress = anim.to
			anim.busy = false
			raf = 0
		} else {
			raf = requestAnimationFrame(tick)
		}
		paint()
	}

	function kick() {
		if (raf) return
		raf = requestAnimationFrame(tick)
	}

	function animateTo(to: number, ox: number, oy: number) {
		if (reduced) {
			anim.progress = to
			anim.busy = false
			anim.ox = ox
			anim.oy = oy
			open = to > 0.5
			paint()
			return
		}
		anim.from = anim.progress
		anim.to = to
		anim.ox = ox
		anim.oy = oy
		anim.start = performance.now()
		anim.busy = true
		open = to > 0.5
		kick()
		if (!lookRaf) lookRaf = requestAnimationFrame(tickLook)
	}

	function localPoint(el: HTMLElement, e: PointerEvent) {
		const r = el.getBoundingClientRect()
		return {
			x: (e.clientX - r.left) / Math.max(1, r.width),
			y: (e.clientY - r.top) / Math.max(1, r.height)
		}
	}

	function applyPivot() {
		const amount = Math.max(0, (anim.progress - 0.55) / 0.45)
		pivotX = (0.5 - look.y) * 16 * amount
		pivotY = (look.x - 0.5) * 20 * amount
		pivotZ = 36 * amount
		panX = (0.5 - look.x) * 5 * amount
		panY = (0.5 - look.y) * 5 * amount
	}

	function tickLook() {
		look.x += (look.tx - look.x) * 0.14
		look.y += (look.ty - look.y) * 0.14
		applyPivot()
		const settling = Math.abs(look.tx - look.x) > 0.001 || Math.abs(look.ty - look.y) > 0.001
		if (settling || anim.busy) {
			lookRaf = requestAnimationFrame(tickLook)
		} else {
			lookRaf = 0
		}
		if (anim.progress > 0.001 && !anim.busy) paint()
	}

	function setLook(x: number, y: number, immediate = false) {
		look.tx = x
		look.ty = y
		if (immediate || reduced) {
			look.x = x
			look.y = y
			applyPivot()
			if (anim.progress > 0.001) paint()
			return
		}
		if (!lookRaf) lookRaf = requestAnimationFrame(tickLook)
	}

	function onEnter(e: PointerEvent) {
		if (!finePointer || !cardEl) return
		const { x, y } = localPoint(cardEl, e)
		setLook(x, y)
		animateTo(1, x, y)
	}

	function onMove(e: PointerEvent) {
		if (!finePointer || !cardEl || anim.progress < 0.2) return
		const { x, y } = localPoint(cardEl, e)
		setLook(x, y)
	}

	function onLeave() {
		if (!finePointer) return
		setLook(0.5, 0.5)
		animateTo(0, anim.ox, anim.oy)
	}

	function onPointerDown(e: PointerEvent) {
		if (finePointer || !cardEl) return
		const { x, y } = localPoint(cardEl, e)
		setLook(x, y, true)
		animateTo(anim.progress > 0.5 ? 0 : 1, x, y)
	}

	function cardAction(el: HTMLElement) {
		cardEl = el
		paint()
		return {
			destroy() {
				cardEl = undefined
			}
		}
	}

	function canvasAction(el: HTMLCanvasElement) {
		canvasEl = el
		paint()
		return {
			destroy() {
				canvasEl = undefined
			}
		}
	}

	onMount(() => {
		let dead = false
		const obs = new ResizeObserver(() => paint())
		if (rootEl) obs.observe(rootEl)

		loadImage(photo)
			.then((img) => expandImage(img, EXPAND_ASPECT))
			.then((img) => {
				if (dead) return
				image = img
				photoSrc = img.src
				buildMosaic()
				paint()
			})

		return () => {
			dead = true
			obs.disconnect()
			if (raf) cancelAnimationFrame(raf)
			if (lookRaf) cancelAnimationFrame(lookRaf)
		}
	})
</script>

<div class="dither" bind:this={rootEl}>
	<button
		type="button"
		class="card"
		class:is-open={open}
		use:cardAction
		style:--ink={ink}
		style:--badge-a={1 - ink * 0.45}
		style:--body-a={0.58 + ink * 0.32}
		style:--pivot-x="{pivotX}deg"
		style:--pivot-y="{pivotY}deg"
		style:--pivot-z="{pivotZ}px"
		style:--pan-x="{panX}%"
		style:--pan-y="{panY}%"
		onpointerenter={onEnter}
		onpointermove={onMove}
		onpointerleave={onLeave}
		onpointerdown={onPointerDown}
		aria-pressed={open}
		aria-label="{copy.title}. {finePointer ? 'Hover to reveal' : 'Tap to reveal'}."
	>
		<canvas class="layer" use:canvasAction aria-hidden="true"></canvas>
		<img class="photo" src={photoSrc} alt="" aria-hidden="true" style:opacity={photoOpacity} />
		<span class="shimmer" aria-hidden="true"></span>
		<span class="badge">{copy.badge}</span>
		<span class="copy">
			<span class="title">{copy.title}</span>
			<span class="body">{copy.body}</span>
		</span>
	</button>
</div>

<style>
	.dither {
		width: min(94%, 36rem);
		margin: auto;
		padding: 0;
		box-sizing: border-box;
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		aspect-ratio: 3 / 2;
		height: auto;
		padding: clamp(1.55rem, 4.2vw, 2.25rem);
		border: 0;
		border-radius: clamp(1.75rem, 4vw, 2.75rem);
		background: #000;
		color: #fff;
		text-align: left;
		overflow: hidden;
		cursor: pointer;
		isolation: isolate;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	.layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
	}

	.photo {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 0;
		width: 130%;
		height: 130%;
		object-fit: cover;
		pointer-events: none;
		transform-origin: center;
		transform: translate3d(calc(-50% + var(--pan-x, 0%)), calc(-50% + var(--pan-y, 0%)), var(--pivot-z, 0px))
			perspective(720px) rotateX(var(--pivot-x, 0deg)) rotateY(var(--pivot-y, 0deg)) scale(1.06);
		will-change: transform, opacity;
	}

	.shimmer {
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: inherit;
		overflow: hidden;
		pointer-events: none;
		opacity: calc(1 - var(--ink, 0));
		transition: opacity 0.35s ease;
		background: rgb(255 255 255 / 0.05);
		animation: dither-shimmer 1.8s ease-in-out infinite;
	}

	@keyframes dither-shimmer {
		0%,
		100% {
			background: rgb(255 255 255 / 0.03);
		}
		50% {
			background: rgb(255 255 255 / 0.12);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.shimmer {
			animation: none;
			opacity: 0;
		}

		.photo {
			transform: translate3d(-50%, -50%, 0);
			width: 100%;
			height: 100%;
		}
	}

	.badge,
	.copy {
		position: relative;
		z-index: 1;
	}

	.badge {
		display: grid;
		place-items: center;
		width: clamp(2.1rem, 4.8vw, 2.7rem);
		height: clamp(2.1rem, 4.8vw, 2.7rem);
		border-radius: 999px;
		background: rgb(255 255 255 / var(--badge-a, 1));
		color: #000;
		font-size: clamp(0.8rem, 2vw, 1rem);
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 1;
	}

	.copy {
		display: flex;
		flex-direction: column;
		gap: 0.45em;
		max-width: min(26rem, 90%);
	}

	.title {
		font-size: clamp(1.4rem, 3.8vw, 2.05rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.12;
	}

	.body {
		font-size: clamp(0.95rem, 2.3vw, 1.2rem);
		font-weight: 500;
		line-height: 1.4;
		opacity: var(--body-a, 0.58);
	}

	@media (max-width: 420px) {
		.dither {
			width: min(96%, 22rem);
		}

		.copy {
			max-width: 100%;
		}
	}
</style>
