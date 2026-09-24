<script lang="ts">
	import LogoMark from '$lib/components/ui/LogoMark.svelte'
	import { nopeChrome } from '$lib/nopeChrome.svelte'
	import { mountGalaga } from './nopeGame.engine'

	let root: HTMLElement | undefined = $state()
	let stage: HTMLElement | undefined = $state()
	let screen: HTMLElement | undefined = $state()
	let canvas: HTMLCanvasElement | undefined = $state()
	let glow: HTMLCanvasElement | undefined = $state()
	let glow2: HTMLCanvasElement | undefined = $state()
	let bg: HTMLCanvasElement | undefined = $state()
	let edge: HTMLElement | undefined = $state()
	let flash: HTMLElement | undefined = $state()
	let pad: HTMLElement | undefined = $state()
	let onTitle = $state(true)

	$effect(() => {
		if (!root || !stage || !screen || !canvas || !glow || !glow2 || !bg || !edge || !flash || !pad)
			return
		nopeChrome.onTitle = true
		onTitle = true
		const stop = mountGalaga({
			root,
			stage,
			screen,
			canvas,
			glow,
			glow2,
			bg,
			edge,
			flash,
			pad,
			onTitleChange: (v) => {
				onTitle = v
				nopeChrome.onTitle = v
			}
		})
		return () => {
			nopeChrome.onTitle = true
			stop()
		}
	})
</script>

<div class="galaga" class:is-title={onTitle} bind:this={root}>
	<div class="fx edge" bind:this={edge}></div>
	<div class="fx flash" bind:this={flash}></div>
	<canvas class="bg" bind:this={bg} aria-hidden="true"></canvas>

	{#if !onTitle}
		<a
			href="/"
			class="mark is-live fixed top-8 left-6 z-[5] size-6 text-chrome-ink sm:size-7 lg:top-10 lg:size-5 2xl:size-6"
			aria-label="Home"
		>
			<span class="mark-glow mark-glow--wide" aria-hidden="true"><LogoMark /></span>
			<span class="mark-glow mark-glow--near" aria-hidden="true"><LogoMark /></span>
			<span class="mark-icon"><LogoMark /></span>
		</a>
	{/if}

	<div class="stage py-8 lg:py-10" bind:this={stage}>
		<div class="screen" class:is-live={!onTitle} bind:this={screen}>
			<canvas class="glow2" bind:this={glow2} aria-hidden="true"></canvas>
			<canvas class="glow" bind:this={glow} aria-hidden="true"></canvas>
			<canvas
				class="play"
				bind:this={canvas}
				aria-label="A playable ASCII arcade shooter."
			></canvas>
		</div>
	</div>

	<div class="pad" bind:this={pad} aria-hidden="true">
		<button type="button" data-k="left">◀</button>
		<button type="button" data-k="fire" class="fire">FIRE</button>
		<button type="button" data-k="right">▶</button>
	</div>
</div>

<style>
	.galaga {
		--ink: #e8e6ff;
		--dim: #3a3670;
		--ship: #7fe7ff;
		--bee: #ffd84d;
		--fly: #ff5fa2;
		--boss: #6bffb0;
		--hurt: #b59cff;
		--shot: #ff6b4a;
		--hull: #ffffff;
		--red: #ff3b3b;
		--m0: #2e7045;
		--m1: #164a29;
		--m2: #0e301b;
		--m3: #081d10;
		--r0: #e06a6a;
		--r1: #9c2020;
		--r2: #5c1212;
		--r3: #300909;
		--glow-op: 1;
		--glow2-op: 0.8;
		--blend: screen;
		--hot: #ffffff;
		--flash: rgba(255, 40, 40, 0.28);

		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		width: 100%;
		min-height: 100dvh;
		background: transparent;
		color: var(--ink);
		font-family: var(--font-mono);
		touch-action: manipulation;
	}
	.galaga.is-title {
		background: var(--bg);
	}

	.fx {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		z-index: 20;
	}
	.edge {
		box-shadow: inset 0 0 18vmin 4vmin var(--red);
	}
	.flash {
		background: var(--flash);
	}
	.edge:global(.hit) {
		animation: edgeHit 1.1s ease-out;
	}
	.flash:global(.hit) {
		animation: flashHit 0.45s ease-out;
	}
	.edge:global(.low) {
		opacity: 0.25;
		animation: edgeLow 1.4s ease-in-out infinite;
	}
	.edge:global(.low.hit) {
		animation: edgeHit 1.1s ease-out;
	}
	.screen:global(.shake) {
		animation: shake 0.45s linear;
	}

	@keyframes edgeHit {
		0% {
			opacity: 1;
		}
		35% {
			opacity: 0.8;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes flashHit {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes edgeLow {
		0%,
		100% {
			opacity: 0.12;
		}
		50% {
			opacity: 0.4;
		}
	}
	@keyframes shake {
		0% {
			transform: translate(0, 0);
		}
		15% {
			transform: translate(-8px, 4px);
		}
		30% {
			transform: translate(7px, -5px);
		}
		45% {
			transform: translate(-5px, -3px);
		}
		60% {
			transform: translate(4px, 3px);
		}
		80% {
			transform: translate(-2px, 1px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.screen:global(.shake) {
			animation: none;
		}
		.edge:global(.low) {
			animation: none;
		}
	}

	.bg {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		filter: blur(0.6px);
	}

	.mark {
		color: var(--hull);
	}
	.mark-icon,
	.mark-glow {
		display: block;
		width: 100%;
		height: 100%;
	}
	.mark-glow {
		position: absolute;
		inset: 0;
		opacity: 0;
		mix-blend-mode: var(--blend);
		pointer-events: none;
		transition: opacity 0.35s var(--ease, ease);
	}
	.mark-glow--near {
		filter: blur(10px) saturate(2.4) brightness(3);
		transform: scale(1.25);
	}
	.mark-glow--wide {
		filter: blur(22px) saturate(2.8) brightness(3.4);
		transform: scale(1.7);
	}
	.mark.is-live .mark-glow--near {
		opacity: 1;
	}
	.mark.is-live .mark-glow--wide {
		opacity: 0.85;
	}
	.mark-icon {
		position: relative;
	}

	.stage {
		position: relative;
		z-index: 1;
		flex: 1;
		min-height: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.screen {
		position: relative;
		line-height: 0;
		overflow: hidden;
	}
	.screen.is-live::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.14) 2px 3px);
		mix-blend-mode: multiply;
	}

	.play {
		display: block;
		position: relative;
	}
	.glow,
	.glow2 {
		position: absolute;
		left: 0;
		top: 0;
		pointer-events: none;
		mix-blend-mode: var(--blend);
		opacity: 0;
	}

	.pad {
		display: none;
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 560px;
		gap: 0.6rem;
		padding: 0.4rem 1rem 1rem;
	}
	.pad button {
		flex: 1;
		font: inherit;
		font-size: 1.6rem;
		padding: 0.7rem 0;
		border-radius: 12px;
		background: transparent;
		color: var(--ink);
		border: 2px solid var(--dim);
		touch-action: none;
	}
	.pad button.fire {
		flex: 1.6;
		color: var(--shot);
		border-color: var(--shot);
	}
	.pad button:active {
		background: rgba(255, 255, 255, 0.08);
	}
	@media (hover: none) and (pointer: coarse) {
		.pad {
			display: flex;
		}
	}
</style>
