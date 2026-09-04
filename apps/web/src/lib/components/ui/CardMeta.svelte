<script lang="ts">
	let { title }: { title: string } = $props()
</script>

<div class="card-title-pill">
	<span class="card-title-grain" aria-hidden="true"></span>
	<span class="card-title-inner">{title}</span>
</div>

<style>
	.card-title-pill {
		position: relative;
		display: flex;
		box-sizing: border-box;
		max-width: 100%;
		align-items: center;
		height: 40px;
		padding: 0 16px;
		overflow: hidden;
		isolation: isolate;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent) 18%, rgb(22 22 22 / 0.94));
		color: #fff;
		transition:
			opacity 220ms var(--ease),
			transform 420ms var(--ease),
			background 280ms var(--ease),
			border-color 280ms var(--ease),
			color 280ms var(--ease);
	}

	.card-title-grain {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		opacity: 0.28;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 80px 80px;
	}

	.card-title-inner {
		position: relative;
		z-index: 1;
		min-width: 0;
		overflow: hidden;
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		line-height: 1;
		white-space: nowrap;
		text-transform: uppercase;
		text-overflow: ellipsis;
	}

	@media (hover: hover) and (pointer: fine) {
		.card-title-pill {
			opacity: 0;
			transform: translate3d(0, 6px, 0);
		}

		:global(a:hover) .card-title-pill,
		:global(a:focus-visible) .card-title-pill {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-contrast: more) {
		.card-title-pill {
			border-color: rgb(255 255 255 / 0.85);
			background: #161616;
		}

		.card-title-grain {
			display: none;
		}
	}

	@media (forced-colors: active) {
		.card-title-pill {
			background: Canvas;
			border: 2px solid CanvasText;
			color: CanvasText;
		}

		.card-title-grain {
			display: none;
		}
	}
</style>
