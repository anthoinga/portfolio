<script lang="ts">
	import IconView from '$lib/components/ui/IconView.svelte'
	import {
		TRAIL,
		clearTrail,
		paintTrail,
		resizeCanvas,
		stamp,
		type TrailEnergy
	} from '$lib/cursorTrail'
	import { subscribeMedia } from '$lib/motion'
	import { readCursorSurface } from '$lib/theme'

	let enabled = $state(false)
	let visible = $state(false)
	let idle = $state(false)
	let caseStudy = $state(false)
	let surface = $state(readCursorSurface(null))
	let node: HTMLElement | undefined = $state()
	let canvas: HTMLCanvasElement | undefined = $state()

	$effect(() =>
		subscribeMedia('(hover: hover) and (pointer: fine)', (matches) => (enabled = matches))
	)

	$effect(() => {
		document.documentElement.classList.toggle('cursor-takeover', enabled)
		return () => document.documentElement.classList.remove('cursor-takeover')
	})

	$effect(() => {
		if (!enabled) {
			visible = false
			idle = false
			caseStudy = false
			return
		}
		if (!canvas) return

		let x = 0
		let y = 0
		let tx = 0
		let ty = 0
		let lx = 0
		let ly = 0
		let raf = 0
		let idleTimer = 0
		let seeded = false
		let reduced = false
		let lastOwner: Element | null = null
		let ctx = resizeCanvas(canvas)
		const energy: TrailEnergy = new Map()

		const wipe = () => {
			energy.clear()
			if (ctx) clearTrail(ctx, window.innerWidth, window.innerHeight)
		}

		const tick = () => {
			const k = reduced ? 1 : TRAIL.follow
			x += (tx - x) * k
			y += (ty - y) * k
			if (node) node.style.transform = `translate3d(${x}px, ${y}px, 0)`

			if (!reduced && seeded && visible) {
				const dx = x - lx
				const dy = y - ly
				const dist = Math.hypot(dx, dy)
				if (dist >= TRAIL.stampAfter) {
					const radius = caseStudy ? TRAIL.radius.pill : TRAIL.radius.rest
					const amount = caseStudy ? TRAIL.amount.pill : TRAIL.amount.rest
					const steps = Math.max(1, Math.ceil(dist / TRAIL.step))
					const deposit = Math.max(TRAIL.minDeposit, amount / Math.max(1, steps * TRAIL.stepSpread))
					for (let i = 1; i <= steps; i++) {
						const t = i / steps
						stamp(energy, lx + dx * t, ly + dy * t, radius, deposit)
					}
					lx = x
					ly = y
				}
			}

			if (ctx && !reduced) paintTrail(ctx, energy, window.innerWidth, window.innerHeight)

			const moving = Math.abs(tx - x) > TRAIL.settle || Math.abs(ty - y) > TRAIL.settle
			raf = moving || energy.size > 0 ? requestAnimationFrame(tick) : 0
		}

		const kick = () => {
			if (!raf) raf = requestAnimationFrame(tick)
		}

		const markMoving = () => {
			idle = false
			clearTimeout(idleTimer)
			idleTimer = window.setTimeout(() => {
				if (seeded) idle = true
			}, TRAIL.idleAfter)
		}

		const follow = (e: PointerEvent) => {
			if (e.pointerType === 'touch') return
			tx = e.clientX
			ty = e.clientY
			if (!seeded) {
				x = tx
				y = ty
				lx = tx
				ly = ty
				seeded = true
				visible = true
			}
			const hit = document.elementFromPoint(e.clientX, e.clientY)
			const study = hit?.closest('[data-cursor="case-study"]') ?? null
			caseStudy = Boolean(study)
			const owner = study ?? (hit instanceof Element ? hit : null)
			if (owner !== lastOwner) {
				lastOwner = owner
				surface = readCursorSurface(study ?? hit)
			}
			kick()
			markMoving()
		}

		const hide = () => {
			visible = false
			idle = false
			clearTimeout(idleTimer)
			caseStudy = false
			lastOwner = null
			surface = readCursorSurface(null)
			wipe()
		}

		const show = () => {
			if (!seeded) return
			visible = true
			markMoving()
		}

		const onResize = () => {
			if (canvas) ctx = resizeCanvas(canvas)
		}

		const stopMotion = subscribeMedia('(prefers-reduced-motion: reduce)', (matches) => {
			reduced = matches
			if (reduced) wipe()
		})

		window.addEventListener('resize', onResize)
		window.addEventListener('pointermove', follow, { passive: true })
		document.addEventListener('mouseleave', hide)
		document.addEventListener('mouseenter', show)
		window.addEventListener('blur', hide)

		return () => {
			cancelAnimationFrame(raf)
			clearTimeout(idleTimer)
			stopMotion()
			window.removeEventListener('resize', onResize)
			window.removeEventListener('pointermove', follow)
			document.removeEventListener('mouseleave', hide)
			document.removeEventListener('mouseenter', show)
			window.removeEventListener('blur', hide)
		}
	})
</script>

{#if enabled}
	<canvas
		bind:this={canvas}
		class="cursor-trail"
		class:is-visible={visible}
		class:is-pill={caseStudy}
		aria-hidden="true"
	></canvas>
	<div
		bind:this={node}
		class="cursor-takeover-el"
		class:is-visible={visible}
		class:is-idle={idle}
		class:is-pill={caseStudy}
		class:is-on-light={surface.scheme === 'light'}
		style:--cursor-accent={surface.accent}
		style:--cursor-ink={surface.ink}
		aria-hidden="true"
	>
		<div class="cursor-orb">
			<span class="cursor-grain" aria-hidden="true"></span>
			<div class="cursor-label" class:is-open={caseStudy}>
				<div class="cursor-label-inner">
					<span class="cursor-icon"><IconView /></span>
					<span>VIEW CASE STUDY</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.cursor-trail {
		position: fixed;
		inset: 0;
		z-index: 9998;
		pointer-events: none;
		opacity: 0;
		mix-blend-mode: screen;
		transition: opacity 180ms var(--ease);
	}

	.cursor-trail.is-pill {
		mix-blend-mode: difference;
	}

	.cursor-trail.is-visible {
		opacity: 0.92;
	}

	.cursor-takeover-el {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		pointer-events: none;
		opacity: 0;
		will-change: transform;
		transition:
			opacity 180ms var(--ease),
			--cursor-accent 280ms var(--ease),
			--cursor-ink 280ms var(--ease);
	}

	.cursor-takeover-el.is-visible {
		opacity: 1;
	}

	.cursor-orb {
		position: relative;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		border: 1px solid rgb(0 0 0 / 0.12);
		border-radius: 999px;
		background: color-mix(in srgb, var(--cursor-accent) 12%, rgb(244 244 244 / 0.96));
		color: var(--cursor-ink, #161616);
		transform: translate(-50%, -50%);
		overflow: hidden;
		isolation: isolate;
		transition:
			min-width 420ms var(--ease),
			height 420ms var(--ease),
			padding 420ms var(--ease),
			background 280ms var(--ease),
			border-color 280ms var(--ease),
			color 280ms var(--ease);
	}

	.cursor-takeover-el.is-idle:not(.is-pill) .cursor-orb {
		animation: cursor-pulse 2.4s var(--ease) infinite;
	}

	@keyframes cursor-pulse {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			transform: translate(-50%, -50%) scale(1.45);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor-trail {
			display: none;
		}

		.cursor-takeover-el.is-idle:not(.is-pill) .cursor-orb {
			animation: none;
		}
	}

	.cursor-grain {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		opacity: 0.22;
		mix-blend-mode: multiply;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 80px 80px;
	}

	.cursor-takeover-el.is-pill .cursor-orb {
		height: 40px;
		padding: 0 16px 0 12px;
	}

	.cursor-takeover-el.is-on-light .cursor-orb {
		border-color: rgb(255 255 255 / 0.14);
		background: color-mix(in srgb, var(--cursor-accent) 18%, rgb(22 22 22 / 0.94));
	}

	.cursor-takeover-el.is-on-light .cursor-grain {
		opacity: 0.28;
		mix-blend-mode: overlay;
	}

	@media (prefers-contrast: more) {
		.cursor-orb {
			border-color: rgb(0 0 0 / 0.85);
			background: #f4f4f4;
		}

		.cursor-takeover-el.is-on-light .cursor-orb {
			border-color: rgb(255 255 255 / 0.85);
			background: #161616;
		}

		.cursor-grain,
		.cursor-trail {
			display: none;
		}
	}

	@media (forced-colors: active) {
		.cursor-orb {
			background: Canvas;
			border: 2px solid CanvasText;
		}

		.cursor-grain,
		.cursor-trail {
			display: none;
		}

		.cursor-label-inner {
			color: CanvasText;
		}
	}

	.cursor-label {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 0fr;
		opacity: 0;
		transition:
			grid-template-columns 420ms var(--ease),
			opacity 220ms var(--ease);
	}

	.cursor-label.is-open {
		grid-template-columns: 1fr;
		opacity: 1;
		transition:
			grid-template-columns 420ms var(--ease),
			opacity 280ms 80ms var(--ease);
	}

	.cursor-label-inner {
		display: flex;
		align-items: center;
		gap: 0.45em;
		min-width: 0;
		overflow: hidden;
		color: var(--cursor-ink, #161616);
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		line-height: 1;
		white-space: nowrap;
	}

	.cursor-icon {
		display: flex;
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}
</style>
